import { DataSource } from "typeorm";
import { CreateFarmInputDto } from "./dto/create-farm.input.dto";
import { Farm } from "./entities/farm.entity";
import { UnprocessableEntityError } from "errors/errors";
import { User } from "../users/entities/user.entity";
import { createFarmByDTO } from "./entities/getFarmByDTO";
import { Outliers, QueryFarmsInputDto } from "./dto/query-farm.input.dto";
import config from "config/config";
import { getLatLngByPoint } from "../../helpers/latLng";
import { createDistanceFetcher } from "../../helpers/createDistanceFetcher";
import { toError } from "../../helpers/toError";

const QUERY_LIMIT = 100;
const OUTLIER_THRESHOLD = 0.3;

type FarmWithDistance = Farm & { drivingDistance: number | undefined };

export class FarmsService {
  #yieldAvg: number;
  #gms = createDistanceFetcher(config.GOOGLE_MAPS_API_KEY);

  constructor(ds: DataSource, private readonly farmsRepository = ds.getRepository(Farm)) {}

  public async init() {
    await this.updateAvgYield();
  }

  private async updateAvgYield(): Promise<void> {
    const resp = await this.farmsRepository.createQueryBuilder().select("AVG(yield)").getRawOne<{ avg: number }>();
    if (resp === undefined) {
      throw new Error("Failed to calculate average yield");
    }
    const avg = resp.avg ?? 0;
    // console.debug("AVG(yield)", avg, resp);
    this.#yieldAvg = avg;
  }

  public getAvgYield(): number {
    return this.#yieldAvg;
  }

  public async createFarm(data: CreateFarmInputDto, user: User): Promise<Farm> {
    const existingFarm = await this.farmsRepository.findOne({
      where: {
        name: data.name,
        user: { id: user.id },
      },
    });
    if (existingFarm) {
      throw new UnprocessableEntityError("A farm with the same name already exists");
    }

    const newFarm = this.farmsRepository.create(createFarmByDTO(data, user));
    const farm = this.farmsRepository.save(newFarm);
    return farm;
  }

  public async selectFarms(query: QueryFarmsInputDto, user: User): Promise<Array<Farm>> {
    const sqlQuery = this.farmsRepository
      .createQueryBuilder("farm")
      .select()
      .leftJoinAndSelect("farm.user", "user")
      .orderBy({ "farm.updatedAt": "ASC" })
      .offset(query.page !== undefined && query.page > 0 ? query.page * QUERY_LIMIT : undefined)
      .limit(QUERY_LIMIT);

    if (query.outliers !== undefined) {
      await this.updateAvgYield();
      const threshhold = OUTLIER_THRESHOLD * this.#yieldAvg;
      if (query.outliers === Outliers.Remove) {
        sqlQuery.where("yield > :threshhold", { threshhold });
      } else if (query.outliers === Outliers.Select) {
        sqlQuery.where("yield <= :threshhold", { threshhold });
      }
    }

    if (query.sortBy === "driving_distance") {
      // FIXME: a wirkaround, because of a weird bug (in typeorm, I think)
      // Providing user.coord directly in the query throws "parse error - invalid geometry"
      sqlQuery.setParameter("user_coord", user.coord.coordinates);
      const geoPoint = `ST_Point(:...user_coord, 4326)::geography`;
      sqlQuery.addSelect(`ST_Distance(${geoPoint}, "farm"."coord")`, "distance");
      sqlQuery.orderBy("distance", "ASC");
    } else if (query.sortBy === "name") {
      sqlQuery.orderBy({ "farm.name": "ASC" });
    }

    const farms = await sqlQuery.getMany();

    return farms;
  }

  protected get _googleClient() {
    return this.#gms;
  }

  public async fetchDrivingDistances(user: User, farms: Farm[]) {
    return this.#gms
      .fetchDistances(
        getLatLngByPoint(user.coord),
        farms.map(f => getLatLngByPoint(f.coord)),
      )
      .catch(ex => {
        throw toError(ex, "Unexpected Google Maps response");
      });
  }

  public async fetchFarms(query: QueryFarmsInputDto, user: User): Promise<FarmWithDistance[]> {
    const farms = await this.selectFarms(query, user);
    // TODO: more granular cache to avoid fetching driving distances when we should know it
    const dDistances = await this.fetchDrivingDistances(user, farms);
    const farmsWithDistance: FarmWithDistance[] = farms.map((farm, i) => ({ ...farm, drivingDistance: dDistances[i] }));
    if (query.sortBy === "driving_distance") {
      farmsWithDistance.sort((a, b) => (a.drivingDistance ?? Infinity) - (b.drivingDistance ?? Infinity));
    }
    return farmsWithDistance;
  }
}
