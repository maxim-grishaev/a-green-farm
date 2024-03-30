import { ValidationError } from "class-validator";

const noop = (msg: string) => msg;
const withPrefix = (prefix: string, msg: string) => [prefix, msg].join(".");

export const getErrorMessages = (errors: ValidationError[], prefix = ""): string[] =>
  errors
    .reduce((messages: string[], currentValue: ValidationError) => {
      if (currentValue.children && currentValue.children.length > 0) {
        messages = messages.concat(getErrorMessages(currentValue.children, currentValue.property));
      }

      if (currentValue.constraints !== undefined && currentValue.constraints !== null) {
        Object.values(currentValue.constraints).forEach(value => {
          messages.push(value);
        });
      }

      return messages;
    }, [])
    .map(prefix ? (msg: string) => withPrefix(prefix, msg) : noop);
