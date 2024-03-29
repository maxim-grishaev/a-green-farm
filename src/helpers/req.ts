import { Request } from "express";

export type ValidatedBody<B, Req extends Request = Request> = Omit<Req, "body"> & {
  body: B;
};
