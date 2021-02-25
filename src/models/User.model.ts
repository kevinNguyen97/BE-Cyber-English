import { container } from "tsyringe";
import RoleService from '../services/role.service';

export class User {
    id: number = 0;
    firstName: string = '';
    lastName: string = '';
    userEmail: string = '';
    nickname: string = '';
    userRole: number = 0;
    avatarUrl: string = '';
    displayName: string = '';
    dateConnected: number = 0;
    userLogin: string = '';
    userPass: string = '';
    address: string = '';
    userRoleName: string = ''

    constructor(data: any) {
        if (data && data.id) {
            this.id = data.id
            this.firstName = data.first_name
            this.lastName = data.last_name
            this.userEmail = data.user_email
            this.nickname = data.nickname
            this.userRole = data.user_role
            this.avatarUrl = data.avatar_url
            this.displayName = data.display_name
            this.dateConnected = data.date_connected
            this.userLogin = data.user_login
            this.userPass = data.user_pass
            this.address = data.address
            this.getUserRoleName(data.user_role);
        }
    }

    getUserRoleName = async (roleID: number) => {
        const roleServ = container.resolve(RoleService)
        this.userRoleName = await roleServ.getRoleNameById(roleID);
    }
}

// tslint:disable-next-line: max-classes-per-file
export class UserLoginResponse {
    id: number | null = null;
    firstName: string = '';
    lastName: string = '';
    displayName: string = '';
    userEmail: string = '';
    userRole: number = 0;
    userRoleName: string = '';
    country: string = '';
    authKey: string = '';
    constructor(authKey: string = '', data?: User,) {
        if (data) {
            this.authKey = authKey
            this.id = data.id;
            this.firstName = data.firstName
            this.lastName = data.lastName
            this.displayName = data.displayName
            this.userEmail = data.userEmail
            this.userRole = data.userRole
            this.userRoleName = data.userRoleName
        }
    }
}
