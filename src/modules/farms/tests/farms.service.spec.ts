import { UnprocessableEntityError } from "errors/errors";
import { clearDatabase, disconnectAndClearDatabase } from "helpers/utils";
import { dataSource as ds } from "orm/orm.config";
import { CreateFarmInputDto } from "../dto/create-farm.input.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";
import { User } from "../../users/entities/user.entity";
import { getFarmByDTO } from "../entities/getFarmByDTO";

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
      lat: 0,
      lng: 0,
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
          lat: 0,
          lng: 0,
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
        await farmsRepository.save(getFarmByDTO(input, user));
        repoSaveSpy.mockClear();

        repoSaveSpy = jest.spyOn(farmsRepository, "save");

        await expect(farmsService.createFarm(input, user)).rejects.toThrow(
          new UnprocessableEntityError("A farm with the same name already exists"),
        );
        expect(repoSaveSpy).toBeCalledTimes(0);
      });
    });
  });
});
