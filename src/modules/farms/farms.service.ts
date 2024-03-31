import { DataSource, Point } from "typeorm";
import { CreateFarmInputDto } from "./dto/create-farm.input.dto";
import { Farm } from "./entities/farm.entity";
import { UnprocessableEntityError } from "errors/errors";
import { User } from "../users/entities/user.entity";
import { createFarmByDTO } from "./entities/getFarmByDTO";
import { Outliers, QueryFarmsInputDto } from "./dto/query-farm.input.dto";
import { Client, LatLng, TravelMode } from "@googlemaps/google-maps-services-js";
import config from "config/config";

const QUERY_LIMIT = 100;
const OUTLIER_THRESHOLD = 0.3;

const gmsClient = new Client({});
const getCoord = (point: Point): LatLng => ({
  lat: point.coordinates[0],
  lng: point.coordinates[1],
});

export class FarmsService {
  #yieldAvg: number;
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

  public async fetchAll(query: QueryFarmsInputDto, user: User): Promise<Array<Farm>> {
    const farms = await this.selectFarms(query, user);

    const farms25 = farms.slice(0, 25);
    const resp = await gmsClient.distancematrix({
      params: {
        key: config.GOOGLE_MAPS_API_KEY,
        origins: [{ lat: 50, lng: 10 }],
        destinations: farms25.map(f => f.coord).map(getCoord),
        mode: TravelMode.driving,
      },
    });
    console.log("Google resp", resp.data.rows[0].elements);
    return farms;
  }
}
