import { getErrorMessages } from "helpers/utils";

describe("utils", () => {
  describe(".getErrorMessages", () => {
    it("should return error messages", () => {
      const errors = [
        { property: "name", constraints: { isNotEmpty: "name should not be empty" } },
        { property: "age", constraints: { isNotEmpty: "age should not be empty" } },
        { property: "email" },
      ];

      const result = getErrorMessages(errors);

      expect(result).toEqual("name should not be empty, age should not be empty");
    });

    it("should return error messages with prefix", () => {
      const errors = [
        { property: "name", constraints: { isNotEmpty: "name should not be empty" } },
        { property: "age", constraints: { isNotEmpty: "age should not be empty" } },
        { property: "email" },
      ];

      const result = getErrorMessages(errors, ["User"]);

      expect(result).toEqual("User.name should not be empty, User.age should not be empty");
    });

    it("should return error messages with nested errors", () => {
      const errors = [
        {
          property: "foobar",
          children: [
            { property: "firstName", constraints: { isNotEmpty: "firstName should not be empty" } },
            { property: "lastName", constraints: { isNotEmpty: "lastName should not be empty" } },
          ],
        },
        { property: "age", constraints: { isNotEmpty: "age should not be empty" } },
        { property: "email" },
      ];

      const result = getErrorMessages(errors);

      expect(result).toEqual(
        "foobar.firstName should not be empty, foobar.lastName should not be empty, age should not be empty",
      );
    });
  });
});
