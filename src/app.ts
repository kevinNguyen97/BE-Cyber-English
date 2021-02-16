import "reflect-metadata";
import cors from "cors";
import bodyParser from "body-parser";

import express from "express";
import { container, Lifecycle, scoped } from "tsyringe";
import VocabularyRouter from "./router/vocabularies";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import LoggerService from "./config/logger";
import ReadingRouter from "./router/reading";
@scoped(Lifecycle.ResolutionScoped)
class Childrouter {
  readingRouter;
  vocabularyRouter;
  constructor(
    private readingR: ReadingRouter,
    private vocabularyR: VocabularyRouter
  ) {
    this.readingRouter = this.readingR.router;
    this.vocabularyRouter = this.vocabularyR.router;
  }
}

const router = express();

const logger = container.resolve(LoggerService);
router.use(cors());
/** Parse the body of the request */
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ limit: "50mb" }));
/** Routes go here */

router.use("/swagger", swaggerUi.serve);
router.get("/swagger", swaggerUi.setup(swaggerDocument));

/** Error handling */
router.use((req, res, next) => {
  logger.info("Request:", `${req.originalUrl}, " METHOD: ", ${req.method}`);
  logger.info("Request data:", req.body);
  next();
});

// app.get('/', (req, res) => res.send('Hello World!'));

const myrouter = container.resolve(Childrouter);
router.use("/vocabulary", myrouter.vocabularyRouter);
router.use("/reading", myrouter.readingRouter);

export default router;
