import { Request, Response } from "express";
import { asAsyncMiddleware, asAsyncRoute, toError } from "../asAsyncMiddleware";

describe("asAsyncMiddleware", () => {
  it.each([
    ["async", () => Promise.reject(new Error("test error"))],
    [
      "sync",
      () => {
        throw new Error("test error");
      },
    ],
  ])("should handle %s errors", async (_, src) => {
    const fn = jest.fn().mockImplementation(src);
    const next = jest.fn();
    const req = {} as Request;
    const res = {} as Response;

    const middleware = asAsyncMiddleware(fn);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error("test error"));
  });

  it.each([
    ["async", () => Promise.resolve()],
    ["sync", () => undefined],
  ])("should call next with no error if it resolves %s", async (_, src) => {
    const fn = jest.fn().mockImplementation(src);
    const next = jest.fn();
    const req = {} as Request;
    const res = {} as Response;

    const middleware = asAsyncMiddleware(fn);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});

describe("asAsyncRoute", () => {
  it.each([
    ["async", () => Promise.resolve("test data")],
    [
      "sync",
      () => {
        return "test data";
      },
    ],
  ])("should handle %s errors", async (_, src) => {
    const fn = jest.fn().mockImplementation(src);
    const next = jest.fn();
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const middleware = asAsyncRoute(fn);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith("test data");
  });
});

describe("toError", () => {
  it("should return the same error", () => {
    const error = new Error("test error");
    expect(toError(error)).toBe(error);
  });

  it("should return a new error if it's anything other", () => {
    const error = "test error";
    const result = toError(error);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("test error");
  });
});
