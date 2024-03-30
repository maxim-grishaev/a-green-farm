import { DataSource } from "typeorm";
import { CreateFarmInputDto } from "./dto/create-farm.input.dto";
import { Farm } from "./entities/farm.entity";
import { UnprocessableEntityError } from "errors/errors";
import { User } from "../users/entities/user.entity";
import { getFarmByDTO } from "./entities/getFarmByDTO";

export class FarmsService {
  constructor(ds: DataSource, private readonly farmsRepository = ds.getRepository(Farm)) {}

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
    return this.farmsRepository.save(newFarm);
  }
}
