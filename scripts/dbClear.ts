import { connectToDB } from "./connectToDB";

const main = async () => {
  const db = await connectToDB();
  await db.clear();
  await db.close();
  console.log(`DB cleared`);
};

void main();
