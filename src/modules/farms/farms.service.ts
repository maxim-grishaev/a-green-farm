import { DataSource, FindManyOptions, LessThanOrEqual, MoreThan } from "typeorm";
import { CreateFarmInputDto } from "./dto/create-farm.input.dto";
import { Farm } from "./entities/farm.entity";
import { UnprocessableEntityError } from "errors/errors";
import { User } from "../users/entities/user.entity";
import { getFarmByDTO } from "./entities/getFarmByDTO";
import { Outliers, QueryFarmsInputDto } from "./dto/query-farm.input.dto";

const QUERY_LIMIT = 100;
const OUTLIER_THRESHOLD = 0.3;

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

    const newFarm = this.farmsRepository.create(getFarmByDTO(data, user));
    const farm = this.farmsRepository.save(newFarm);
    await this.updateAvgYield();
    return farm;
  }

  public async fetchAll(query: QueryFarmsInputDto, user: User): Promise<Farm[]> {
    console.log("fetchAll", query, user);

    let findOptions: FindManyOptions<Farm> = {};

    if (query.outliers === Outliers.Select) {
      findOptions = { where: { yield: LessThanOrEqual(OUTLIER_THRESHOLD * this.#yieldAvg) } };
    } else if (query.outliers === Outliers.Remove) {
      findOptions = { where: { yield: MoreThan(OUTLIER_THRESHOLD * this.#yieldAvg) } };
    }

    switch (query.sortBy) {
      case "name":
        findOptions.order = { name: "ASC" };
        break;
      case "date":
        findOptions.order = { updatedAt: "ASC" };
        break;
      case "driving_distance":
        throw new UnprocessableEntityError("Sort by driving_distance is not implemented");
      default:
        break;
    }

    const farms = await this.farmsRepository.find({
      ...findOptions,
      relations: ["user"],
      take: QUERY_LIMIT,
    });
    return farms;
  }
}
