import config from "config/config";
import { UnauthorizedError } from "errors/errors";
import { Request } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { AuthService } from "modules/auth/auth.service";
import { DataSource } from "typeorm";
import { User } from "../modules/users/entities/user.entity";
import { asAsyncMiddleware } from "../helpers/asAsyncMiddleware";

export interface RequestWithUser extends Request {
  user: User;
}

export const authMiddleware = (ds: DataSource) =>
  asAsyncMiddleware(
    async (req: RequestWithUser) => {
      const authService = new AuthService(ds);
      if (!req.headers.authorization) {
        throw new Error();
      }

      const token = req.headers.authorization.split(" ")[1];
      const verifiedToken = await verifyAsync(token);
      if (!verifiedToken) {
        throw new Error();
      }

      const existingToken = await authService.getAccessToken(token);
      req.user = existingToken.user;
    },
    () => new UnauthorizedError(),
  );

const verifyAsync = async (token: string): Promise<JwtPayload | null> =>
  new Promise(res => {
    verify(token, config.JWT_SECRET, (err, data) => {
      if (err) return res(null);

      return res(data as JwtPayload);
    });
  });
