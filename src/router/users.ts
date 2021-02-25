import "reflect-metadata";
import express from "express";
import { check, validationResult } from "express-validator";
import { singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
// import Authentication from '../middleware/Authentication';
import UserService from "../services/user.service";
import BaseRouter from "./baseRouter";
import { User, UserLoginResponse } from "../models/User.model";

@singleton()
class UserRouter extends BaseRouter {
  constructor(
    // private auth: Authentication,
    private userSev: UserService
  ) {
    super();
    this.init();
  }

  init() {
    // create swagger
    // code
    this.postMethod(
      "/login",
      [check("username").isString(), check("password").isString()],
      async (
        req: express.Request,
        resp: express.Response,
        next: express.NextFunction,
        responseData: ResponseData<any>
      ) => {
        try {
          const username = req.body.username;
          const password = req.body.password;

          const dataLogin: any = await this.userSev.login(username, password);
          const user: User = dataLogin.user;
          if (!dataLogin.usernameIsCorrect) {
            return this.handleError(
              resp,
              responseData,
              [
                `incorrect_username`,
              ],
              ResponseCode.BAD_REQUEST
            );
          }
          if (!dataLogin.passwordIsCorrect) {
            return this.handleError(
              resp,
              responseData,
              [
                `incorrect_password`,
              ],
              ResponseCode.BAD_REQUEST
            );
          }
          if (user) {
            const token: string | undefined = await this.userSev.getToken(user);
            responseData.success = true;
            responseData.data = new UserLoginResponse(token, user);

            return resp.status(ResponseCode.OK).json(responseData);
          } else {
            responseData.success = false;
            responseData.data = null;
            return resp.status(ResponseCode.UNAUTHORIZED).json(responseData);
          }
        } catch (error) {
          return handleError(
            resp,
            ResponseCode.INTERNAL_SERVER_ERROR,
            error,
            this.nameSpace
          );
        }
      }
    );
  }
}

export default UserRouter;
