import { DeepPartial } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { CreateFarmInputDto } from "../dto/create-farm.input.dto";
import { Farm } from "./farm.entity";

export const getFarmByDTO = (input: CreateFarmInputDto, user: User): DeepPartial<Farm> => {
  const farm = new Farm();
  farm.name = input.name;
  farm.size = input.size;
  farm.yield = input.yield;
  farm.user = user;
  farm.lat = input.location.lat;
  farm.lng = input.location.lng;
  farm.address = input.location.address;
  return farm;
};
