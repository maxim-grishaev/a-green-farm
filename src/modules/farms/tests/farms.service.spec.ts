import { UnprocessableEntityError } from "errors/errors";
import { clearDatabase, disconnectAndClearDatabase } from "helpers/utils";
import { dataSource as ds } from "orm/orm.config";
import { CreateFarmInputDto } from "../dto/create-farm.input.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";
import { Repository } from "typeorm";
import { User } from "../../users/entities/user.entity";

describe("FarmsService", () => {
  let farmsService: FarmsService;
  let farmsRepository: Repository<Farm>;
  let user: User;
  let input: CreateFarmInputDto;

  beforeAll(async () => {
    await ds.initialize();
    farmsRepository = ds.getRepository(Farm);
  });

  afterAll(async () => {
    await disconnectAndClearDatabase(ds);
  });

  beforeEach(async () => {
    await clearDatabase(ds);
    jest.clearAllMocks();
    farmsService = new FarmsService(ds);
    user = await ds.getRepository(User).save({
      email: "no@no.no",
      hashedPassword: "xx",
    });
    input = {
      name: "Test Farm 1",
      size: 10,
      yield: 200,
      user: { id: user.id },
    };
  });

  describe(".createFarm", () => {
    it("should create new farm", async () => {
      const repoSaveSpy = jest.spyOn(farmsRepository, "save");
      const repoCreateSpy = jest.spyOn(farmsRepository, "create");

      const result = await farmsService.createFarm(input);

      const expectedResult = {
        id: expect.any(String),
        name: input.name,
        size: input.size,
        yield: input.yield,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        user: expect.anything(),
      };

      expect(repoCreateSpy).toBeCalledTimes(1);
      expect(repoCreateSpy).toBeCalledWith(input);
      expect(repoSaveSpy).toBeCalledTimes(1);
      expect(repoSaveSpy).toBeCalledWith(expectedResult);
      expect(result).toBeInstanceOf(Farm);
      expect(result).toMatchObject(expectedResult);
    });

    describe("if farm name already exists", () => {
      it("should throw UnprocessableEntityError", async () => {
        await ds.getRepository(Farm).save(input);

        const repoSpy = jest.spyOn(farmsRepository, "save");

        await expect(farmsService.createFarm(input)).rejects.toThrow(
          new UnprocessableEntityError("A farm with the same name already exists"),
        );
        expect(repoSpy).toBeCalledTimes(1);
        expect(repoSpy).toBeCalledWith(input);
      });
    });
  });
});
