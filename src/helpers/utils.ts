import { instanceToPlain } from "class-transformer";
import { Response } from "express";
import { DataSource } from "typeorm";

export const disconnectAndClearDatabase = async (ds: DataSource): Promise<void> => {
  await clearDatabase(ds);
  await ds.destroy();
};

export const clearDatabase = async (ds: DataSource): Promise<void> => {
  const { entityMetadatas } = ds;

  await Promise.all(entityMetadatas.map(data => ds.query(`truncate table "${data.tableName}" cascade`)));
};

export const respondWithSchema = (res: Response, schema: unknown, status = 201) => {
  res.status(status).send(instanceToPlain(schema, { excludeExtraneousValues: true }));
};
