import { UnprocessableEntityError } from "errors/errors";
import { clearDatabase, disconnectAndClearDatabase } from "helpers/db";
import { dataSource as ds } from "orm/orm.config";
import { CreateFarmInputDto } from "../dto/create-farm.input.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";
import { User } from "../../users/entities/user.entity";
import { createFarmByDTO } from "../entities/getFarmByDTO";
import { getPointByCoord } from "../../location/dto/location.dto";
import { QueryFarmsInputDto } from "../dto/query-farm.input.dto";

describe("FarmsService", () => {
  let farmsService: FarmsService;
  let user: User;
  let input: CreateFarmInputDto;
  let farmsRepository = ds.getRepository(Farm);
  const userRepository = ds.getRepository(User);
  let repoSaveSpy = jest.spyOn(farmsRepository, "save");
  let repoCreateSpy = jest.spyOn(farmsRepository, "create");

  beforeAll(async () => {
    await ds.initialize();
    farmsRepository = ds.getRepository(Farm);
  });

  afterAll(async () => {
    await disconnectAndClearDatabase(ds);
  });

  beforeEach(async () => {
    await clearDatabase(ds);
    farmsService = new FarmsService(ds);

    user = await userRepository.save({
      email: "no@no.no",
      hashedPassword: "xx",
      address: "address",
      coord: getPointByCoord({
        lat: 0,
        lng: 0,
      }),
    });

    input = {
      name: "Test Farm 1",
      size: 10,
      yield: 200,
      location: { address: "address", lat: 0, lng: 0 },
    };

    jest.clearAllMocks();

    repoSaveSpy.mockRestore();
    repoSaveSpy = jest.spyOn(farmsRepository, "save");

    repoCreateSpy.mockRestore();
    repoCreateSpy = jest.spyOn(farmsRepository, "create");
  });

  describe(".createFarm", () => {
    it("should create new farm", async () => {
      const result = await farmsService.createFarm(input, user);

      expect(repoCreateSpy).toBeCalledTimes(1);
      expect(repoSaveSpy).toBeCalledTimes(1);
      expect(repoSaveSpy).toBeCalledWith(
        expect.objectContaining({
          address: "address",
          coord: getPointByCoord({
            lat: 0,
            lng: 0,
          }),
          name: "Test Farm 1",
          size: 10,
          yield: 200,
          user,
        }),
      );
      expect(result).toBeInstanceOf(Farm);
      expect(result).toMatchObject({
        id: expect.any(String),
        name: input.name,
        size: input.size,
        yield: input.yield,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        user: expect.anything(),
      });
    });

    describe("if farm name already exists", () => {
      it("should throw UnprocessableEntityError", async () => {
        await farmsRepository.save(createFarmByDTO(input, user));
        repoSaveSpy.mockClear();

        repoSaveSpy = jest.spyOn(farmsRepository, "save");

        await expect(farmsService.createFarm(input, user)).rejects.toThrow(
          new UnprocessableEntityError("A farm with the same name already exists"),
        );
        expect(repoSaveSpy).toBeCalledTimes(0);
      });
    });
  });

  describe(".fetchAll", () => {
    // it("should fetch all farms with no params (limit: 100)", async () => {
    // });

    it("should sort by name", async () => {
      await farmsRepository.save(createFarmByDTO({ ...input, name: "BBBB" }, user));
      await farmsRepository.save(createFarmByDTO({ ...input, name: "AAAA" }, user));

      const result = await farmsService.fetchAll(QueryFarmsInputDto.fromPlain({ sortBy: "name" }), user);

      expect(result).toHaveLength(2);
      expect(result.map(it => it.name)).toEqual(["AAAA", "BBBB"]);
    });

    it("should sort by date", async () => {
      const farm1 = await farmsRepository.save(createFarmByDTO({ ...input, name: "a" }, user));
      await new Promise(resolve => setTimeout(resolve, 10));
      const farm2 = await farmsRepository.save(createFarmByDTO({ ...input, name: "b" }, user));
      await farmsRepository.save({ name: "a2", id: farm1.id });

      // Check it's not sorted by name
      const resultD = await farmsService.fetchAll(QueryFarmsInputDto.fromPlain({ sortBy: "date" }), user);
      expect(resultD).toHaveLength(2);
      expect(resultD.map(it => it.id)).toEqual([farm2.id, farm1.id]);
      expect(resultD.map(it => it.name)).toEqual(["b", "a2"]);
    });

    describe("outliers filter (yield less than threshold)", () => {
      it.each([
        ["1", ["a"]],
        ["true", ["a"]],
        ["0", ["b", "c"]],
        ["false", ["b", "c"]],
        [undefined, ["a", "b", "c"]],
      ])("should filter outliers: if outliers=%p, result: %p", async (outliers, exp) => {
        await farmsRepository.save(createFarmByDTO({ ...input, name: "a", yield: 10 }, user));
        await farmsRepository.save(createFarmByDTO({ ...input, name: "b", yield: 200 }, user));
        await farmsRepository.save(createFarmByDTO({ ...input, name: "c", yield: 300 }, user));

        const result = await farmsService.fetchAll(QueryFarmsInputDto.fromPlain({ outliers, sortBy: "name" }), user);

        expect(result.map(it => it.name)).toEqual(exp);
      });
    });

    describe("if sortBy is driving_distance", () => {
      it("should throw UnprocessableEntityError", async () => {
        await expect(farmsService.fetchAll({ sortBy: "driving_distance" }, user)).rejects.toThrow(
          new UnprocessableEntityError("Sort by driving_distance is not implemented"),
        );
      });
    });
  });
});
