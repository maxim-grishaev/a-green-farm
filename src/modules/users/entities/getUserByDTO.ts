import { DeepPartial } from "typeorm";
import { hashPassword } from "../../../helpers/password";
import { CreateUserInputDto } from "../dto/create-user.input.dto";
import { User } from "./user.entity";

export const getUserByDTO = async (input: CreateUserInputDto): Promise<DeepPartial<User>> => {
  const user = new User();
  user.hashedPassword = await hashPassword(input.password);
  user.email = input.email;
  user.lat = input.location.lat;
  user.lng = input.location.lng;
  user.address = input.location.address;
  return user;
};
