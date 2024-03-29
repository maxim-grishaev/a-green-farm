import { plainToInstance } from "class-transformer";
import { Farm } from "../src/modules/farms/entities/farm.entity";
import { User } from "../src/modules/users/entities/user.entity";
import { DeepPartial } from "typeorm";
import { connectToDB } from "./connectToDB";
import { hashPassword } from "../src/helpers/password";

const range = (n: number) => [...Array(n).keys()];

const REQ = {
  countUsers: 1000,
  maxFarmPerUser: 3,
};

const createFarm = (n: number, userNo: number) => {
  const frm: DeepPartial<Farm> = {};
  frm.name = `Farm # ${n} of user ${userNo}`;
  frm.size = Math.random() * 100;
  frm.yield = Math.random() * 100;
  return plainToInstance(Farm, frm);
};

const createUser = async (n: number) => {
  const farmsNo = Math.floor(Math.random() * REQ.maxFarmPerUser + 1);
  const usr: DeepPartial<User> = {
    email: `usr_${n}@foo.bar`,
    hashedPassword: await hashPassword(`password${n}`),
    farms: range(farmsNo).map(fn => createFarm(fn, n)),
  };
  console.log(`User ${n} has ${farmsNo} farms`);
  return usr;
};

const main = async () => {
  const db = await connectToDB();
  console.log(`DB connected`);

  const createUserDB = async (n: number) => {
    const usr = await createUser(n);
    const dbUsr = db.user.create(usr);
    return dbUsr;
  };

  console.log(`Prepare ${REQ.countUsers} users...`);
  const users = await Promise.all(range(REQ.countUsers).map(createUserDB));
  console.log(`${users.length} users created`);

  console.log("First user:", users[0]);

  await db.clear();

  console.log(`Saving ${users.length} users`);
  await db.user.save(users, { chunk: 10_000 });

  await db.close();
  console.log(`Done!`);
};

void main();
