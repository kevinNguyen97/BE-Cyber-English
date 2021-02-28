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

  log = (data: any, message: string = "") => {
    this.logger.info(this.nameSpace, message, data);
  };


  handleGetAllResult = (
    err: any,
    result: any,
    resolve: any,
    reject: any,
    callBackMap = (item) => item
  ): void => {
    if (err) {
      this.log(err, "");
     reject(err);
    }
    if (result && result?.length) {
      const data = result.map(callBackMap);
      resolve(data);
    } else {
      resolve(null);
    }
  };
}
export default BaseService;