import "reflect-metadata";
import { singleton } from "tsyringe";
import { logger } from "../helpers/default.logger";
import { loggerRequest } from "../helpers/request.logger";

@singleton()
class LoggerService {
  info = (namespace: string, message: string, object?: any) => {
    if (object) {
      logger.info(`[[${namespace}] ${message}`, object);
    } else {
      logger.info(`[${namespace}] ${message}`);
    }
  };

  warn = (namespace: string, message: string, object?: any) => {
    if (object) {
      logger.warn(`[[${namespace}] ${message}`, object);
    } else {
      logger.warn(`[${namespace}] ${message}`);
    }
  };

  error = (namespace: string, message: string, object?: any) => {
    if (object) {
      logger.error(`[[${namespace}] ${message}`, object);
    } else {
      logger.error(`[[${namespace}] ${message}`);
    }
  };

  debug = (namespace: string, message: string, object?: any) => {
    if (object) {
      logger.debug(`[[${namespace}] ${message}`, object);
    } else {
      logger.debug(`[[${namespace}] ${message}`);
    }
  };
}

// tslint:disable-next-line: max-classes-per-file
@singleton()
export class LoggerRequest {
  request = (ip: string, originalUrl: string, method: string, object?: any) => {
    loggerRequest.info(
      `${ip} Request:${originalUrl}, " METHOD: ", ${method}`,
      "Request data:",
      JSON.stringify(object)
    );
  };
}

export default LoggerService;
