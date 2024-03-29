import { clearDatabase } from "../src/helpers/utils";
import { AccessToken } from "../src/modules/auth/entities/access-token.entity";
import { Farm } from "../src/modules/farms/entities/farm.entity";
import { User } from "../src/modules/users/entities/user.entity";
import { dataSource } from "../src/orm/orm.config";

export const connectToDB = async () => {
  await dataSource.initialize();
  return {
    dataSource,
    clear: async () => {
      await clearDatabase(dataSource);
    },
    close: async () => {
      await dataSource.destroy();
    },
    user: dataSource.getRepository(User),
    farm: dataSource.getRepository(Farm),
    accessToken: dataSource.getRepository(AccessToken),
  };
};
