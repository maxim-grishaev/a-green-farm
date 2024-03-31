import { Exclude, Expose } from "class-transformer";
import { createSanitizer } from "../createSanitizer";

describe("createSanitizer", () => {
  it("should return a function", () => {
    const fn = createSanitizer(class {});
    expect(typeof fn).toBe("function");
  });

  describe("should return a function that returns an object ", () => {
    it("sanitized", () => {
      class TestDto {
        constructor(data: TestDto) {
          Object.assign(this, data);
        }

        @Exclude()
        public readonly password: string;

        @Expose()
        public readonly id: string = "id";
      }
      const fn = createSanitizer(TestDto);
      const result = fn({ password: "password", id: "id" });
      expect(result).toEqual({ id: "id" });
    });

    it("removes non-whitelisted", () => {
      class TestDto {
        public readonly a: string = "a";

        @Expose()
        public readonly b: string = "b";
      }
      const fn = createSanitizer(TestDto);
      const result = fn();
      expect(result).toEqual({ b: "b" });
    });

    it("calls constructor correctly", () => {
      class TestDto {
        @Expose()
        public readonly id: string;

        @Expose()
        public readonly email: string;

        constructor(id: string, email: string) {
          this.id = id;
          this.email = email;
        }
      }
      const fn = createSanitizer(TestDto);
      const result = fn("id", "email");
      expect(result).toEqual({ id: "id", email: "email" });
    });
  });
});
