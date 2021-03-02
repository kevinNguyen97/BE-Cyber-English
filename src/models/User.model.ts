import { container } from "tsyringe";
import ROLE from "../constants/role.constant";
import CacheService from "../services/cache.service";
import RoleService from "../services/role.service";

const getUserRoleName = (roleID: number): string => {
  const data = container.resolve(CacheService).role.getMediaById(roleID);
  return data ? data.name : "";
};
export class User {
  id: number = 0;
  firstName: string = "";
  lastName: string = "";
  userEmail: string = "";
  nickname: string = "";
  userRole: number = 0;
  avatarUrl: string = "";
  displayName: string = "";
  dateConnected: number = 0;
  userLogin: string = "";
  currentUnit: number = 0;
  userPass: string = "";
  address: string = "";
  userRoleName: string = "";
  isActiveAccount: boolean = false;
  isAdmin: boolean = false;
  modified: number = 0;
  constructor(data: any) {
    if (data && data.id) {
      this.id = data.id;
      this.firstName = data.first_name;
      this.modified = data.modified;
      this.lastName = data.last_name;
      this.userEmail = data.user_email;
      this.nickname = data.nickname;
      this.userRole = data.user_role;
      this.avatarUrl = data.avatar_url;
      this.displayName = data.display_name;
      this.dateConnected = data.date_connected;
      this.userLogin = data.user_login;
      this.userPass = data.user_pass;
      this.address = data.address;
      this.isActiveAccount = !!data.is_active_account;
      this.currentUnit = data.current_unit;
      this.userRoleName = getUserRoleName(this.userRole);
        this.isAdmin = this.userRoleName === ROLE.ADMIN;
    }
  }
}

// tslint:disable-next-line: max-classes-per-file
export class UserLoginResponse {
  id: number | null = null;
  firstName: string = "";
  lastName: string = "";
  displayName: string = "";
  userEmail: string = "";
  userRole: number = 0;
  userRoleName: string = "";
  country: string = "";
  authKey: string = "";
  constructor(authKey: string = "", data?: User) {
    if (data) {
      this.authKey = authKey;
      this.id = data.id;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.displayName = data.displayName;
      this.userEmail = data.userEmail;
      this.userRole = data.userRole;
      this.userRoleName = data.userRoleName;
    }
  }
}
