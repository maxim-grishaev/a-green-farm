import { NextFunction, Request, Response } from "express";
import { EntityNotFoundError } from "typeorm";
import { BadRequestError, UnauthorizedError, UnprocessableEntityError } from "errors/errors";
import { asPlainError } from "./error.output.dto";

const nameByType: Record<number, string> = {
  400: "BadRequestError",
  401: "UnauthorizedError",
  404: "EntityNotFoundError",
  422: "UnprocessableEntityError",
  500: "InternalServerError",
};
const DEFAULT_ERROR_STATUS = 500;
const getErrorNameByStatus = (status: number): string => nameByType[status] || nameByType[DEFAULT_ERROR_STATUS];

type ErrorWithStatus = Error & { statusCode: number };
const isErrorWithStatus = (error: Error & { statusCode?: unknown }): error is ErrorWithStatus =>
  "statusCode" in error && typeof error.statusCode === "number";

export function handleErrorMiddleware(error: Error, _: Request, res: Response, next: NextFunction): void {
  let status = DEFAULT_ERROR_STATUS;
  let errorMessage = error.message;

  if (error instanceof UnprocessableEntityError) {
    status = 422;
  } else if (error instanceof BadRequestError) {
    status = 400;
  } else if (error instanceof UnauthorizedError) {
    status = 401;
  } else if (error instanceof EntityNotFoundError) {
    status = 404;
  } else if (isErrorWithStatus(error)) {
    status = error.statusCode;
  }

  if (!(status in nameByType)) {
    status = DEFAULT_ERROR_STATUS;
  }

  // Safety reasons, Hide internals
  if (status === DEFAULT_ERROR_STATUS) {
    console.error(error);
    errorMessage = "Internal Server Error";
  }

  res.status(status).send(
    asPlainError({
      errorName: getErrorNameByStatus(status),
      message: errorMessage,
    }),
  );
  next();
}
