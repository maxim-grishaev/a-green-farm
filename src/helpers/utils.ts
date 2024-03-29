import { ValidationError } from "class-validator";
import { DataSource } from "typeorm";

export const disconnectAndClearDatabase = async (ds: DataSource): Promise<void> => {
  await clearDatabase(ds);
  await ds.destroy();
};

export const clearDatabase = async (ds: DataSource): Promise<void> => {
  const { entityMetadatas } = ds;

  await Promise.all(entityMetadatas.map(data => ds.query(`truncate table "${data.tableName}" cascade`)));
};

export const getErrorMessages = (errors: ValidationError[], prefix: string[] = []): string => {
  const addPrefix = (msg: string) => prefix.concat(msg).join(".");
  return errors
    .reduce((messages: string[], currentValue: ValidationError) => {
      if (currentValue.children && currentValue.children.length > 0) {
        messages.push(getErrorMessages(currentValue.children, prefix.concat(currentValue.property)));
      }

      if (currentValue.constraints == null) {
        return prefix ? messages.map(addPrefix) : messages;
      }

      Object.values(currentValue.constraints).forEach(value => {
        messages.push(addPrefix(value));
      });

      return messages;
    }, [])
    .join(", ");
};
