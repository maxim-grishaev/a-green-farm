import { DataSource } from "typeorm";
import { MemoryCache, caching } from "cache-manager";
import { CreateFarmInputDto } from "./dto/create-farm.input.dto";
import { FarmsService } from "./farms.service";
import { RequestWithUser } from "../../middlewares/auth.middleware";
import { QueryFarmsInputDto } from "./dto/query-farm.input.dto";
import { FarmOutputDto } from "./dto/farm.output.dto";

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

  public async create(req: RequestWithUser) {
    const cfid = CreateFarmInputDto.fromPlain(req.body);
    const farm = await this.farmsService.createFarm(cfid, req.user);
    return FarmOutputDto.asPlain(farm);
  }

  public async getFarmsListPage(req: RequestWithUser) {
    return this.#cache.wrap(req.url, () => this.getFarmsListPageRaw(req));
  }

  private async getFarmsListPageRaw(req: RequestWithUser) {
    const qfid = QueryFarmsInputDto.fromPlain(req.query);
    const farmsPage = await this.farmsService.fetchAll(qfid, req.user);
    return farmsPage.map(FarmOutputDto.asPlain);
  }
}
