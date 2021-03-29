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
import config from "./config/config";
import UserRouter from "./router/users";
import MultipleChoiceRouter from "./router/multipleChoice";
import ListeningComprehension from "./router/listeningComprehension";
import UnitRouter from "./router/unit";
import FlashCardRouter from "./router/flashCard";
import pm2ProdDoc from "./pm2Config.prod.json";
import pm2stagingDoc from "./pm2Config.staging.json";
import { ResponseData } from "./models/response";

// const myrouter = {
//   vocabularyRouter: container.resolve(ReadingRouter).router,
//   readingRouter: container.resolve(VocabularyRouter).router,
// };

@singleton()
class AppRouter extends BaseRouter {
  appRouter = express();

  constructor(
    private vocabulary: VocabularyRouter,
    private listening: ListeningComprehension,
    private reading: ReadingRouter,
    private user: UserRouter,
    private multipleChoice: MultipleChoiceRouter,
    private unit: UnitRouter,
    private flashCard: FlashCardRouter
  ) {
    super();
    this.appRouter = express();
    /** Parse the body of the request */
    this.appRouter.use(cors());
    this.appRouter.use(bodyParser.urlencoded({ extended: false }));
    this.appRouter.use(bodyParser.json({ limit: "50mb" }));
    /** Routes go here */
    if (process.env.NODE_ENV !== "production") {
      this.appRouter.use(
        "/api/swagger",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument)
      );
    }

    // this.appRouter.get("/api/swagger", swaggerUi.setup(swaggerDocument));

    /** Error handling */
    this.appRouter.use((req, res, next) => {
      const port = process.env.PORT || config.server.port;
      if (
        process.env.NODE_ENV === "production" &&
        req.hostname !== "eng.cybersoft.edu.vn"
      ) {
        const responseData = new ResponseData();
        responseData.data = null;
        responseData.success = false;
        responseData.errorCodes = ["auth"];
        return res.status(401).json(responseData);
      }
      this.log(
        `Request`,
        `${req.hostname} Request:${req.originalUrl}, " METHOD: ", ${req.method}`
      );
      this.log("Request data:", JSON.stringify(req.body));
      next();
    });

    // static

    this.appRouter.use("/api/vocabulary", this.vocabulary.router);
    this.appRouter.use("/api/listening", this.listening.router);
    this.appRouter.use("/api/reading", this.reading.router);
    this.appRouter.use("/api/multiple-choice", this.multipleChoice.router);
    this.appRouter.use("/api/flash-card", this.flashCard.router);
    this.appRouter.use("/api/unit", this.unit.router);
    this.appRouter.use("/api/user", this.user.router);
  }
}

export default AppRouter;
