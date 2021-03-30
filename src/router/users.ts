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
      [check("facebookID").notEmpty(), check("facebookEmail")],
      this.handleLogin
    );
    this.postMethod(
      "/admin-login",
      [check("username").notEmpty(), check("password").notEmpty()],
      this.handleAdminLogin
    );
  }

  private handleAdminLogin = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const username = req.body.username.trim();
      const password = req.body.password.trim();

      let user: User;
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

      if (!user.isAdmin) {
        return this.handleError(
          resp,
          responseData,
          [`UNAUTHORIZED`],
          ResponseCode.UNAUTHORIZED
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
  };

  private handleLogin = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const facebookID = req.body.facebookID.trim();
      const facebookEmail = req.body.facebookEmail.trim();
      const emailRegisted = req.body.email.trim();

      if (!facebookID || (!facebookEmail && !emailRegisted)) {
        return this.handleError(
          resp,
          responseData,
          [`required facebookid, and (facebookEmail or email)`],
          ResponseCode.BAD_REQUEST
        );
      }

      let user: User;
      const dataLogin = await this.userSev.loginByFacebookID(facebookID);
      let dataLoginFromCyber;
      if (!dataLogin.existFacebookId) {
        dataLoginFromCyber = await this.userSev.loginCyberLearnByEmail(
          facebookEmail
        );
        if ((!dataLoginFromCyber || !dataLoginFromCyber.id) && emailRegisted) {
          dataLoginFromCyber = await this.userSev.loginCyberLearnByEmail(
            emailRegisted
          );
          if (!dataLoginFromCyber || !dataLoginFromCyber.id) {
            return this.handleError(
              resp,
              responseData,
              [`facebook is not exist in system`],
              ResponseCode.BAD_REQUEST
            );
          }
        } else if (!dataLoginFromCyber || !dataLoginFromCyber.id) {
          return this.handleError(
            resp,
            responseData,
            [`facebook is not exist in system`],
            ResponseCode.BAD_REQUEST
          );
        }
        user = await this.userSev.storageCyberLearnLogin(
          dataLoginFromCyber,
          facebookID
        );
      } else {
        user = dataLogin.user;
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
