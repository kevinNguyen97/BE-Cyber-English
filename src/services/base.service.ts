import { container, singleton } from "tsyringe";
import DBService from "../config/mysql";
import mysql from "mysql";

class BaseService {
  protected connection: mysql.Pool;
  constructor() {
    this.connection = container.resolve(DBService).getConnection();
  }
  get timeNow(): number {
    return Date.now();
  }
}
export default BaseService;