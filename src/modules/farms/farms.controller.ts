import { DataSource } from "typeorm";
import { MemoryCache, caching } from "cache-manager";
import { CreateFarmInputDto } from "./dto/create-farm.input.dto";
import { FarmsService } from "./farms.service";
import { RequestWithUser } from "../../middlewares/auth.middleware";
import { QueryFarmsInputDto } from "./dto/query-farm.input.dto";
import { asPlainFarm } from "./dto/farm.output.dto";
import { User } from "../users/entities/user.entity";

const CACHE_MAX_SIZE = 100;
const CACHE_TTL = 0;

export class FarmsController {
  #cache: MemoryCache;

  constructor(ds: DataSource, private readonly farmsService = new FarmsService(ds)) {}

  public async init() {
    this.#cache = await caching("memory", {
      max: CACHE_MAX_SIZE,
      ttl: CACHE_TTL,
    });
    await this.farmsService.init();
  }

  public resetCache() {
    this.#cache.reset();
  }

  public async create(req: RequestWithUser) {
    const cfid = CreateFarmInputDto.fromPlain(req.body);
    const farm = await this.farmsService.createFarm(cfid, req.user);
    this.resetCache();
    return asPlainFarm(farm);
  }

  public async getFarmsListPage(req: RequestWithUser) {
    const qfid = QueryFarmsInputDto.fromPlain(req.query);
    const cacheKay = qfid.getKey(req.user.id);
    console.log("cacheKay", cacheKay);
    return this.#cache.wrap(cacheKay, () => this.getFarmsListPageRaw(qfid, req.user));
  }

  private async getFarmsListPageRaw(qfid: QueryFarmsInputDto, user: User) {
    const farmsPage = await this.farmsService.fetchFarms(qfid, user);
    return farmsPage.map(asPlainFarm);
  }
}
