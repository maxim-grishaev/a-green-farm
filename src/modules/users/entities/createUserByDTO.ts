import { DeepPartial } from "typeorm";
import { hashPassword } from "../../../helpers/password";
import { CreateUserInputDto } from "../dto/create-user.input.dto";
import { User } from "./user.entity";
import { LocationDto, getPointByCoord } from "../../location/dto/location.dto";
import { plainToInstance } from "class-transformer";

export const createUserByDTO = async (input: CreateUserInputDto): Promise<DeepPartial<User>> => {
  const loc = plainToInstance(LocationDto, input.location);
  const user = new User();
  user.email = input.email;
  user.hashedPassword = await hashPassword(input.password);
  user.address = loc.address;
  user.coord = getPointByCoord(loc);
  return user;
};
