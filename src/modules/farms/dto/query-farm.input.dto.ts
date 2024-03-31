import { Transform, plainToInstance } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

export enum Outliers {
  Select = "select",
  Remove = "remove",
}
const normaliseBooleanString = (value: string): Outliers | undefined => {
  switch (value) {
    case "1":
    case "true":
      return Outliers.Select;
    case "0":
    case "false":
      return Outliers.Remove;
    default:
      return undefined;
  }
};

/**
 * @openapi
 * components:
 *  schemas:
 *    QueryFarmsInputDto:
 *      type: object
 *      properties:
 *        sortBy:
 *          type: string
 *          description: Sort order
 *          enum: [name, date, driving_distance]
 *        outliers:
 *          type: boolean
 *          description:
 *            Filter by outliers (<30% of average).
 *            If true select only outliers, if false remove outliers, if not provided do not filter
 */
export class QueryFarmsInputDto {
  public static fromPlain = (data: Partial<Record<keyof QueryFarmsInputDto, string>>) =>
    plainToInstance(QueryFarmsInputDto, data);

  @IsEnum(["name", "date", "driving_distance"])
  @IsOptional()
  public sortBy?: "name" | "date" | "driving_distance";

  @IsOptional()
  @Transform(({ value }) => normaliseBooleanString(value as string), {
    toClassOnly: true,
  })
  public outliers?: Outliers;
}
