import { connectToDB } from "./connectToDB";

const main = async () => {
  const db = await connectToDB();
  await db.dataSource.dropDatabase();
  await db.close();
  console.log(`DB ${db.dataSource.options.database} dropped`);
};

void main();
