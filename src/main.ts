import config from "config/config";
import { Response } from "express";
import http from "http";
import { dataSource } from "orm/orm.config";
import { setupServer } from "./server/server";

async function bootstrap(): Promise<http.Server> {
  const app = await setupServer(dataSource);

  const port = config.APP_PORT;
  app.get("/", (_, res: Response) => {
    res.send(`Listening on port: ${port}`);
  });

  const server = http.createServer(app);
  server.listen(port);

  console.log(`App started. Listening on port: ${port}`);
  return server;
}

bootstrap();
