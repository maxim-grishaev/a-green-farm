import config from "config/config";
import { UnauthorizedError } from "errors/errors";
import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { AuthService } from "modules/auth/auth.service";
import { DataSource } from "typeorm";
import { User } from "../modules/users/entities/user.entity";

export interface RequestWithUser extends Request {
  user: User;
}

export const authMiddleware =
  (ds: DataSource) =>
  async (req: RequestWithUser, _: Response, next: NextFunction): Promise<void> => {
    const authService = new AuthService(ds);

    if (!req.headers.authorization) {
      next(new UnauthorizedError());
      return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const verifiedToken = await verifyAsync(token);

    if (!verifiedToken) {
      next(new UnauthorizedError());
      return;
    }

    const existingToken = await authService.getAccessToken(token);
    req.user = existingToken.user;

    next();
  };

const verifyAsync = async (token: string): Promise<JwtPayload | null> =>
  new Promise(res => {
    verify(token, config.JWT_SECRET, (err, data) => {
      if (err) return res(null);

      return res(data as JwtPayload);
    });
  });
