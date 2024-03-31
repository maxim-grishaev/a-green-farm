import { DeepPartial } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { CreateFarmInputDto } from "../dto/create-farm.input.dto";
import { Farm } from "./farm.entity";
import { plainToInstance } from "class-transformer";
import { LocationDto, getPointByCoord } from "../../location/dto/location.dto";

export const createFarmByDTO = (input: CreateFarmInputDto, user: User): DeepPartial<Farm> => {
  const loc = plainToInstance(LocationDto, input.location);
  const farm: DeepPartial<Farm> = new Farm();
  farm.name = input.name;
  farm.size = input.size;
  farm.yield = input.yield;
  farm.user = user;
  farm.coord = getPointByCoord(loc);
  farm.address = loc.address;
  return farm;
};
