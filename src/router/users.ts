import "reflect-metadata";
import express from "express";
import { check } from "express-validator";
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
      [
        check("username").isString(),
        check("password").isString(),
        check("facebookID").isString(),
        check("facebookEmail").isEmpty(),
      ],
      this.handleLogin
    );
  }

  private handleLogin = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const username = req.body.username.trim();
      const password = req.body.password.trim();
      const facebookID = Number(req.body.facebookID.trim());
      const facebookEmail = req.body.facebookEmail;

      if (!username && !facebookID) {
        return this.handleError(
          resp,
          responseData,
          [`required login by userName of facebookID`],
          ResponseCode.BAD_REQUEST
        );
      }
      let user: User;
      if (username) {
        const dataLogin: any = await this.userSev.login(username, password);
        user = dataLogin.user;
        if (!dataLogin.usernameIsCorrect) {
          return this.handleError(
            resp,
            responseData,
            [`incorrect_username`],
            ResponseCode.BAD_REQUEST
          );
        }
        if (!dataLogin.passwordIsCorrect) {
          return this.handleError(
            resp,
            responseData,
            [`incorrect_password`],
            ResponseCode.BAD_REQUEST
          );
        }
      } else {
        const dataLogin = await this.userSev.loginByFacebookID(facebookID);
        let dataLoginFromCyber;
        if (!dataLogin.existFacebookId) {
          dataLoginFromCyber = await this.userSev.loginCyberLearn(
            facebookID,
            facebookEmail
          );
          if (!dataLoginFromCyber || !dataLoginFromCyber.id) {
            return this.handleError(
              resp,
              responseData,
              [`facebool is not exist in our system`],
              ResponseCode.BAD_REQUEST
            );
          }
          user = await this.userSev.storageCyberLearnLogin(dataLoginFromCyber);
        } else {
          user = dataLogin.user;
        }
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
  };
}

export default UserRouter;
