import { DataSource, Repository } from "typeorm";
import { CreateFarmInputDto } from "./dto/create-farm.input.dto";
import { Farm } from "./entities/farm.entity";
import { UnprocessableEntityError } from "errors/errors";

export class FarmsService {
  private readonly farmsRepository: Repository<Farm>;

  constructor(ds: DataSource) {
    this.farmsRepository = ds.getRepository(Farm);
  }

  public async createFarm(data: CreateFarmInputDto): Promise<Farm> {
    const existingFarm = await this.farmsRepository.findOne({
      where: {
        name: data.name,
        user: { id: data.user.id },
      },
    });

    if (existingFarm) throw new UnprocessableEntityError("A farm with the same name already exists");

    const newFarm = this.farmsRepository.create(data);

    return this.farmsRepository.save(newFarm);
  }

  public async getFarmsByUserId(userId: string): Promise<Farm[]> {
    return this.farmsRepository.find({ where: { user: { id: userId } } });
  }
  public async hasFarmName(userId: string, farmName: string): Promise<boolean> {
    const farms = await this.getFarmsByUserId(userId);
    return farms.some(farm => farm.name === farmName);
  }
}
