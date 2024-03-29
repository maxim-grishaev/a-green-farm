import config from "config/config";
import { Express } from "express";
import http from "http";
import { dataSource as ds } from "orm/orm.config";
import * as supertest from "supertest";
import { setupServer } from "server/server";
import { clearDatabase, disconnectAndClearDatabase } from "helpers/utils";
import { LoginUserInputDto } from "../dto/login-user.input.dto";
import { AccessToken } from "../entities/access-token.entity";
import { User } from "modules/users/entities/user.entity";
import { hashPassword } from "../../../helpers/password";

describe("AuthController", () => {
  let app: Express;
  let agent: supertest.SuperAgentTest;
  let server: http.Server;
  let hashedPassword: string;

  const validPassword = "password";

  beforeAll(async () => {
    app = setupServer(ds);
    await ds.initialize();

    server = http.createServer(app).listen(config.APP_PORT);

    hashedPassword = await hashPassword(validPassword);
  });

  afterAll(async () => {
    await disconnectAndClearDatabase(ds);
    server.close();
  });

  beforeEach(async () => {
    await clearDatabase(ds);
    agent = supertest.agent(app);
  });

  describe("POST /auth", () => {
    const createUser = async (userDto: Partial<User>) =>
      ds.getRepository(User).save({ email: userDto.email, hashedPassword, address: "xx", lat: 0, lng: 0 });
    const loginDto: LoginUserInputDto = { email: "user@test.com", password: validPassword };

    it("should login existing user", async () => {
      await createUser(loginDto);

      const res = await agent.post("/api/auth/login").send(loginDto);
      const { token } = res.body as AccessToken;

      expect(res.statusCode).toBe(201);
      expect(token).toBeDefined();
    });

    it("should throw UnprocessableEntityError when user logs in with an unregistered email", async () => {
      const res = await agent.post("/api/auth/login").send({ email: "unregistered@email.com", password: loginDto.password });

      expect(res.statusCode).toBe(422);
      expect(res.body).toMatchObject({
        name: "UnprocessableEntityError",
        message: "Invalid user email or password",
      });
    });

    it("should throw UnprocessableEntityError when user logs in with invalid password", async () => {
      await createUser(loginDto);

      const res = await agent.post("/api/auth/login").send({ email: loginDto.email, password: "invalidPassword" });

      expect(res.statusCode).toBe(422);
      expect(res.body).toMatchObject({
        name: "UnprocessableEntityError",
        message: "Invalid user email or password",
      });
    });

    it("should throw BadRequestError if invalid inputs are provided", async () => {
      const res = await agent.post("/api/auth/login").send({ email: "not-an-email", password: 12345 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({
        name: "BadRequestError",
        message: "email must be an email, password must be a string",
      });
    });
  });
});
