import { toError } from "../toError";

describe("toError", () => {
  it("should return the same error", () => {
    const error = new Error("test error");
    expect(toError(error, "abc")).toBe(error);
  });

  it("should return a new error if it's anything other", () => {
    const error = "test error";
    const result = toError(error);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("test error");
  });

  it("should return a new error with a message", () => {
    const error = "test error";
    const result = toError(error, "msg");
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("msg\ntest error");
  });
});
