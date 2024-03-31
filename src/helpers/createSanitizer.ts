import { instanceToPlain } from "class-transformer";

/**
 * Create a new instance of a class and return it as a plain object.
 * Useful to cnstruct asPlain static methods for OutputDto, used in controllers
 */
export const createSanitizer =
  <In extends new (...args: unknown[]) => unknown>(OutputDto: In) =>
  (...args: ConstructorParameters<In>) =>
    instanceToPlain(new OutputDto(...args), { excludeExtraneousValues: true });
