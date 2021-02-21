import "reflect-metadata";
import cors from "cors";
import bodyParser from "body-parser";

import express from "express";
import { singleton } from "tsyringe";
import VocabularyRouter from "./router/vocabularies";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import ReadingRouter from "./router/reading";
import BaseRouter from "./router/baseRouter";
import config from './config/config';

// const myrouter = {
//   vocabularyRouter: container.resolve(ReadingRouter).router,
//   readingRouter: container.resolve(VocabularyRouter).router,
// };

@singleton()
class AppRouter extends BaseRouter {
  appRouter = express();

  constructor(
    private vocabulary: VocabularyRouter,
    private reading: ReadingRouter
  ) {
    super();
    this.appRouter = express();
    this.appRouter.use(cors());
    /** Parse the body of the request */
    this.appRouter.use(cors());
    this.appRouter.use(bodyParser.urlencoded({ extended: false }));
    this.appRouter.use(bodyParser.json({ limit: "50mb" }));
    /** Routes go here */

    this.appRouter.use("/swagger", swaggerUi.serve);
    this.appRouter.get("/swagger", swaggerUi.setup(swaggerDocument));
    // static

    /** Error handling */
    this.appRouter.use((req, res, next) => {
      const port= process.env.PORT || config.server.port;
      this.log(`Request`, `doamin: ${req.hostname}${port} Request:${req.originalUrl}, " METHOD: ", ${req.method}`);
      this.log("Request data:", req.body);
      next();
    });

    this.appRouter.use(express.static("public"));

    this.appRouter.use("/vocabulary", this.vocabulary.router);
    this.appRouter.use("/reading", this.reading.router);
  }
}

export default AppRouter;
