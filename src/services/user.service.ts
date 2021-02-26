import "reflect-metadata";
import mysql from "mysql";
// import { TUser } from '../models/DB_model/db.model';
import DBService from "../config/mysql";
import { singleton } from "tsyringe";
import JWTHelper from "../helpers/jwt.helper";
import { User } from "../models/User.model";
import hasher from 'wordpress-hash-node'

@singleton()
class UserService {
  private connection: mysql.Pool;
  private myHasher = hasher
  constructor(private dBService: DBService, private jwtHelper: JWTHelper) {
    this.connection = this.dBService.getConnection();
  }

  getListUser() {
    this.connection.query("SELECT * FROM users", (error, result) => {
      (result);
    });
  }

  login = (username: string, password: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM users WHERE user_login='${username}'`,
        async (err, result) => {
          if (err) return reject(err);
          const data = {
            usernameIsCorrect: false,
            passwordIsCorrect: false,
            user: new User(null),
          };
          if (result && result.length > 0) {
            data.usernameIsCorrect = true;
            data.passwordIsCorrect = this.myHasher.CheckPassword(
              password,
              result[0].user_pass
            );
            data.user = new User(result[0]);
          }
          resolve(data);
        }
      );
    });
  };

  getToken = (user): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      const timeExpired = 86400; // 1 day = 86400s
      const timeNow = Date.now();
      const token = await this.jwtHelper.generateToken(
        user,
        "access-token-secret",
        "24h"
      );
      this.connection.query(
        `INSERT INTO user_token (user_id, token, created_date, expired_date, modified_date)
                        VALUES (${user.id}, '${token}', ${timeNow}, ${
          timeNow + timeExpired
        }, ${timeNow})
                        ON DUPLICATE KEY UPDATE 
                        token = '${token}', expired_date=${
          timeNow + timeExpired
        }, modified_date=${timeNow};`,
        (err, result) => {
          if (err) return reject(err);
          resolve(token ? token : "");
        }
      );
    });
  };

  getUserByToken = async (token): Promise<string> => {
    return this.jwtHelper.verifyToken(token, "access-token-secret");
  };
}

export default UserService;
