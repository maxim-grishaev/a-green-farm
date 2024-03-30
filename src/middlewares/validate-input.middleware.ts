import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { BadRequestError } from "errors/errors";
import { Request } from "express";
import { getErrorMessages } from "helpers/getErrorMessages";
import { asAsyncMiddleware } from "../helpers/utils";

export const validateInputMiddleware = (validationSchema: ClassConstructor<object>) =>
  asAsyncMiddleware(async (req: Request) => {
    const input: unknown = req.method === "GET" ? req.query : req.body;

    const validationErrors = await validate(plainToInstance(validationSchema, input));
    if (validationErrors.length === 0) {
      return;
    }

    const messages = getErrorMessages(validationErrors).join(", ");
    throw new BadRequestError(messages);
  });
