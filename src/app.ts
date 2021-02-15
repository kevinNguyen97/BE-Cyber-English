import "reflect-metadata";
import cors from "cors";
import bodyParser from "body-parser";

import express from "express";
import { container, singleton } from "tsyringe";
import VocabularyRouter from "./router/vocabularies";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import readingRouter from "./router/reading";
import LoggerService from "./config/logger";
const vocabularyRouter = container.resolve(VocabularyRouter);
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

router.get("/test", (req, res, next) => {
  res.send("Hello World!"), next();
});

router.use("/user", readingRouter);
router.use("/vocabulary", vocabularyRouter.router);

export default router;
