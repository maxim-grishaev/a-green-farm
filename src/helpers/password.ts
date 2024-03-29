import config from "../config/config";
import * as bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(config.SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};
