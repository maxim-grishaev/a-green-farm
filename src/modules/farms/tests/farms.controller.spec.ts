import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { clearDatabase, disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import { dataSource as ds } from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { CreateFarmInputDto } from "../dto/create-farm.input.dto";
import { Farm } from "../entities/farm.entity";
import { User } from "../../users/entities/user.entity";
import { hashPassword } from "../../../helpers/password";
import { TokenOutputDto } from "../../auth/dto/token.output.dto";
import { createFarmByDTO } from "../entities/getFarmByDTO";
import { getPointByCoord } from "../../location/dto/location.dto";

describe("FarmsController", () => {
  let app: Express;
  let agent: SuperAgentTest;
  let server: Server;

  beforeAll(async () => {
    app = await setupServer(ds);

    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(async () => {
    await disconnectAndClearDatabase(ds);
    server.close();
  });

  beforeEach(async () => {
    await clearDatabase(ds);

    agent = supertest.agent(app);
  });

  describe("POST /farms", () => {
    let user: User;
    let input: CreateFarmInputDto;
    let token: string;

    beforeEach(async () => {
      user = await ds.getRepository(User).save({
        email: "no@no.no",
        hashedPassword: await hashPassword("test"),
        address: "address",
        coord: getPointByCoord({
          lat: 0,
          lng: 0,
        }),
      });
      const resp = await agent.post("/api/auth/login").send({ email: user.email, password: "test" });
      token = (resp.body as TokenOutputDto).token;
      input = {
        name: "Test Farm 1",
        size: 10,
        yield: 200,
        location: { address: "address", lat: 0, lng: 0 },
      };
    });

    it("should not accept unauthorised", async () => {
      const res = await agent.post("/api/farms").send(input);

      expect(res.statusCode).toBe(401);
      expect(res.body).toMatchObject({
        name: "UnauthorizedError",
        message: "Unauthorized",
      });
    });

    it("should create new farm", async () => {
      const res = await agent.post("/api/farms").send(input).set("authorization", `Bearer ${token}`);

      const farm = await ds.getRepository(Farm).findOne({ where: { name: input.name, user: { id: user.id } } });

      const expectedObject = {
        id: expect.any(String),
        name: input.name,
        size: input.size,
        yield: input.yield,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      expect(res.statusCode).toBe(201);
      expect(farm).toMatchObject(expectedObject);
      expect(res.body).toMatchObject({
        ...expectedObject,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should throw UnprocessableEntityError if farm name already exists", async () => {
      await ds.getRepository(Farm).save(createFarmByDTO(input, user));
      const res = await agent.post("/api/farms").send(input).set("authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(422);
      expect(res.body).toMatchObject({
        name: "UnprocessableEntityError",
        message: "A farm with the same name already exists",
      });
    });

    it("should throw BadRequestError if invalid inputs are provided", async () => {
      const res = await agent
        .post("/api/farms")
        .send({ ...input, size: -1 })
        .set("authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({
        name: "BadRequestError",
        message: "size must not be less than 1",
      });
    });
  });
});
