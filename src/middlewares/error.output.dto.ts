import { Exclude, Expose } from "class-transformer";
import { createAsPlain } from "../helpers/utils";

/**
 * @openapi
 * components:
 *  schemas:
 *    ErrorOutputDto:
 *      type: object
 *      properties:
 *       name:
 *         type: string
 *         example: "BadRequestError"
 *       message:
 *         type: string
 *         example: "Invalid request data"
 */
export class ErrorOutputDto {
  @Exclude()
  @Exclude()
  public static asPlain = createAsPlain(ErrorOutputDto);

  constructor(data: { errorName: string; message: string }) {
    this.name = data.errorName;
    this.message = data.message;
  }

  @Expose()
  public readonly name: string;

  @Expose()
  public readonly message: string;
}