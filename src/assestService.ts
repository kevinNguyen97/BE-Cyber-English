import "reflect-metadata";
import cors from "cors";
import bodyParser from "body-parser";

import express from "express";
import config from "./config/config";
import LoggerService from "./config/logger";
import { container } from "tsyringe";

class AssetsRouter {
  assetsRouter = express();
  private logger: LoggerService = container.resolve(LoggerService);
  private nameSpace = "assets service";
  constructor() {
    this.assetsRouter = express();
    /** Parse the body of the request */
    this.assetsRouter.use(cors());
    this.assetsRouter.use(bodyParser.urlencoded({ extended: false }));
    this.assetsRouter.use(bodyParser.json({ limit: "50mb" }));
    /** Routes go here */
    this.assetsRouter.use("/assets", express.static("public"));
  }
  log = (data: any, message: string = "") => {
    this.logger.info(this.nameSpace, message, data);
  };
}
const assets = new AssetsRouter();

const assetsRouter = assets.assetsRouter;

assetsRouter.listen(config.server.assestPort, () =>
  assets.log(
    `running at ${config.server.hostName}:${config.server.assestPort}`,
    "Assets"
  )
);
