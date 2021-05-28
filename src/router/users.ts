import "reflect-metadata";
import express from "express";
import { check } from "express-validator";
import { singleton } from "tsyringe";
import { handleError, ResponseCode, ResponseData } from "../models/response";
// import Authentication from '../middleware/Authentication';
import UserService from "../services/user.service";
import BaseRouter from "./baseRouter";
import {
  User,
  UserLoginResponse,
  UserResponse,
  UserResponseDB,
} from "../models/User.model";
import config from "../config/config";
import RoleService from "../services/role.service";
import { getDateTime, timeStampSeconds } from "../ultils/Ultil";
import UnitService from "../services/unit.service";

@singleton()
class UserRouter extends BaseRouter {
  constructor(
    // private auth: Authentication,
    private unitServ: UnitService,
    private userSev: UserService,
    private roleServ: RoleService
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

    this.getMethod("/infor", [this.checkAuthThenGetuser], this.handleInforUser);

    this.getMethod(
      "/users/:page_size/:page_index",
      [this.checkIsAdmin],
      this.handleGetUserPagin
    );

    this.postMethod(
      "/admin-login",
      [check("username").notEmpty(), check("password").notEmpty()],
      this.handleAdminLogin
    );

    this.getMethod("/get-all-role", [this.checkIsAdmin], this.handleGetAllRole);

    this.patchMethod(
      "/admin-update-user",
      [
        check("userId").notEmpty(),
        check("fullName").notEmpty(),
        check("dateExpired").notEmpty(),
        check("currentUnit").notEmpty(),
        check("userRole").notEmpty(),
      ],
      this.handleUpdateUserInfor
    );
  }

  private handleUpdateUserInfor = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;

      const userId = req.body.userId ? req.body.userId : "";
      const fullName = req.body.fullName ? req.body.fullName : "";
      const dateExpired = Number(req.body.dateExpired) || 0;
      const currentUnit = Number(req.body.currentUnit) || 0;
      const userRole = Number(req.body.userRole) || 0;

      if (!userId) {
        return this.handleError(
          resp,
          responseData,
          [`invaild input userId ${userId}`],
          ResponseCode.BAD_REQUEST
        );
      }

      const isExistUserId = await this.userSev.checkUserIsExistById(userId);

      if (!isExistUserId) {
        return this.handleError(
          resp,
          responseData,
          [`user id ${userId} is not exist in system`],
          ResponseCode.BAD_REQUEST
        );
      }

      const isExistUnit = await this.unitServ.checkUnitsExist(currentUnit);

      if (!isExistUnit) {
        return this.handleError(
          resp,
          responseData,
          [`unit ${currentUnit} is not exist in system`],
          ResponseCode.BAD_REQUEST
        );
      }
      const role = await this.roleServ.getUserRole(userRole);
      if (!role) {
        return this.handleError(
          resp,
          responseData,
          [`dateExpired ${dateExpired} is a feature timeStamp`],
          ResponseCode.BAD_REQUEST
        );
      }

      const result = await this.userSev.updateUserInfor(
        userId,
        fullName,
        dateExpired,
        currentUnit,
        userRole
      );

      if (!result) {
        return this.handleError(
          resp,
          responseData,
          [`can't not update`],
          ResponseCode.BAD_REQUEST
        );
      }

      const userInfor = await this.userSev.getUserById(userId);

      responseData.success = true;
      responseData.data = new UserResponse(userInfor);
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

  private handleGetAllRole = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const result = this.roleServ.allRole;
      responseData.success = true;
      responseData.data = result;
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

  private handleGetUserPagin = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;

      const pageSize: number = Number(req.params.page_size)
        ? Number(req.params.page_size)
        : 0;
      const pageIndex: number = Number(req.params.page_index)
        ? Number(req.params.page_index)
        : 0;
      const userList = await this.userSev.getUsersPagin(pageSize, pageIndex);

      if (!userList) {
        return this.handleError(
          resp,
          responseData,
          [`invaild paginator data`],
          ResponseCode.BAD_REQUEST
        );
      }
      responseData.success = true;
      responseData.data = userList;
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

  private handleInforUser = async (
    req: express.Request,
    resp: express.Response,
    next: express.NextFunction,
    responseData: ResponseData<any>
  ) => {
    try {
      const user: User = req.body.userData;
      responseData.success = true;
      responseData.data = new UserLoginResponse("", user);
      return resp.status(ResponseCode.OK).json(responseData);
    } catch (error) {
      return handleError(
        resp,
        ResponseCode.INTERNAL_SERVER_ERROR,
        error,
        this.nameSpace
      );
    }
  };

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
      const facebookID = req.body.facebookID ? Number(req.body.facebookID) : 0;
      const facebookEmail = req.body.facebookEmail
        ? req.body.facebookEmail.trim()
        : "";
      const emailRegisted = req.body.email ? req.body.email.trim() : "";

      if ((!facebookID && !facebookEmail) || (!facebookID && !emailRegisted)) {
        return this.handleError(
          resp,
          responseData,
          [`required facebookid, and (facebookEmail or email)`],
          ResponseCode.BAD_REQUEST
        );
      }

      let user: User | null = null;
      let isFirstTimeLogin = false;
      const dataLogin = await this.userSev.loginByFacebookID(facebookID);
      let dataLoginFromCyber;
      if (!dataLogin.existFacebookId) {
        dataLoginFromCyber = await this.userSev.loginCyberLearnByFacebookId(
          facebookID
        );
      }

      if (
        !dataLogin.existFacebookId &&
        (!dataLoginFromCyber || !dataLoginFromCyber.id) &&
        facebookEmail
      ) {
        dataLoginFromCyber = await this.userSev.loginCyberLearnByEmail(
          facebookEmail
        );
      }

      if (
        !dataLogin.existFacebookId &&
        (!dataLoginFromCyber || !dataLoginFromCyber.id) &&
        emailRegisted
      ) {
        dataLoginFromCyber = await this.userSev.loginCyberLearnByEmail(
          emailRegisted
        );
      }

      if (
        !dataLogin.existFacebookId &&
        !dataLoginFromCyber &&
        !dataLoginFromCyber?.id
      ) {
        return this.handleError(
          resp,
          responseData,
          [`facebook is not exist in system`],
          ResponseCode.BAD_REQUEST
        );
      } else if (
        !dataLogin.existFacebookId &&
        dataLoginFromCyber &&
        dataLoginFromCyber.id
      ) {
        user = await this.userSev.storageCyberLearnLogin(
          dataLoginFromCyber,
          facebookID
        );
        isFirstTimeLogin = true;
      } else {
        user = dataLogin?.user;
      }

      if (user && user.id && user.isActiveAccount) {
        const token: string | undefined = await this.userSev.getToken(user);
        responseData.success = true;
        responseData.data = new UserLoginResponse(
          token,
          user,
          isFirstTimeLogin
        );

        return resp.status(ResponseCode.OK).json(responseData);
      } else {
        responseData.success = false;
        responseData.data = null;
        return resp.status(ResponseCode.BAD_REQUEST).json(responseData);
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
