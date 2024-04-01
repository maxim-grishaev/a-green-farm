export const toError = (ex: unknown, msg?: string) => {
  const error = ex instanceof Error ? ex : new Error(String(ex));
  if (msg) {
    error.message = [msg, error.message].join("\n");
  }
  return error;
};
