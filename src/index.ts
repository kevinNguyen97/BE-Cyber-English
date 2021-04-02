import "reflect-metadata";
import { container } from "tsyringe";
import AppRouter from "./app";
import config from "./config/config";
import LoggerService from "./config/logger";

const appRouter = container.resolve(AppRouter);
const logger = container.resolve(LoggerService);

appRouter.appRouter.listen(config.server.port, () =>
  logger.info(
    "App",
    `listening at ${config.server.hostName}:${
      config.server.port
    }`
  )
);

// ,
//         {
//             "name": "serveFileStaging",
//             "script": "./assestService.js",
//             "exec_mode": "fork",
//             "instances": 1
//         }


// ,
//         {
//             "name": "serveFileEnglish",
//             "script": "./assestService.js",
//             "exec_mode": "fork",
//             "instances": 1
//         }