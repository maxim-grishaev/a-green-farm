import { instanceToPlain } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { DataSource } from "typeorm";

export const disconnectAndClearDatabase = async (ds: DataSource): Promise<void> => {
  await clearDatabase(ds);
  await ds.destroy();
};

export const clearDatabase = async (ds: DataSource): Promise<void> => {
  const { entityMetadatas } = ds;

  await Promise.all(entityMetadatas.map(data => ds.query(`truncate table "${data.tableName}" cascade`)));
};

/**
 * Create a new instance of a class and return it as a plain object.
 * Useful to cnstruct asPlain static methods for OutputDto, used in controllers
 */
export const createAsPlain =
  <In extends new (...args: unknown[]) => unknown>(OutputDto: In) =>
  (...args: ConstructorParameters<In>) =>
    instanceToPlain(new OutputDto(...args), { excludeExtraneousValues: true });

export const toError = (err: unknown) => (err instanceof Error ? err : new Error(String(err)));

/**
 * Wrap an async function to be used as an express middleware.
 * Handles errors by calling the next function with the error, so no need in try/catch.
 */
export const asAsyncMiddleware =
  <Req extends Request>(fn: (req: Req, res: Response) => Promise<void>, handleError = toError) =>
  (req: Req, res: Response, next: NextFunction): Promise<void> =>
    Promise.resolve()
      .then(() => fn(req, res))
      .then(next)
      .catch(err => next(handleError(err)));

// Poor man's decorator
export const asAsyncRoute = <Req extends Request, T>(fn: (req: Req, res: Response) => T | Promise<T>, handleError = toError) =>
  asAsyncMiddleware<Req>(async (req, res) => {
    const data = await fn(req, res);
    res.status(201).send(data);
  }, handleError);
