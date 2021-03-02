import { container, singleton } from "tsyringe";
import DBService from "../config/mysql";
import mysql from "mysql";
import LoggerService from "../config/logger";

class BaseService {
  protected connection: mysql.Pool;
  protected nameSpace = "";
  private logger: LoggerService = container.resolve(LoggerService);

  constructor() {
    this.connection = container.resolve(DBService).getConnection();
  }
  get timeNow(): number {
    return Date.now();
  }

  protected log = (data: any, message: string = "") => {
    this.logger.info(this.nameSpace, message, data);
  };

  protected logErr = (data: any, message: string = "error") => {
    this.logger.error(this.nameSpace, message, data);
  };
}
export default BaseService;
