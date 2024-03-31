import { NextFunction, Request, Response } from "express";

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
      .then(() => next())
      .catch(err => next(handleError(err)));

// Poor man's decorator
export const asAsyncRoute = <Req extends Request, T>(fn: (req: Req, res: Response) => T | Promise<T>, handleError = toError) =>
  asAsyncMiddleware<Req>(async (req, res) => {
    const data = await fn(req, res);
    res.status(201).send(data);
  }, handleError);
