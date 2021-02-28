import "reflect-metadata";
import mysql from "mysql";
import { IRole } from "../interfaces/Role";
import DBService from "../config/mysql";
import { singleton } from "tsyringe";
import { Role } from "../models/role.model";

@singleton()
class RoleService {
  private connection: mysql.Pool;
  allRole: IRole[] = [];
  constructor(private dBService: DBService) {
    this.connection = this.dBService.getConnection();
  }

  getRoleIdByName = (userRole: any) => {
    if (this.allRole.length) {
      const role = this.allRole.find((_role) => _role.name === userRole);
      return new Promise((resolve) => resolve(role ? role.id : null));
    }
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM role`, (err, result) => {
        if (err) return reject(err);
        let role: IRole | null = null;
        if (result && result.length > 0) {
          this.allRole = result;
          role = result.find((_role) => _role.name === userRole);
        }
        resolve(role ? role.id : null);
      });
    });
  };

  getRoleNameById = (_roleId: any): Promise<string> => {
    const roleId = Number(_roleId);
    if (this.allRole.length) {
      const role = this.allRole.find((item) => item.id === roleId);
      return new Promise((resolve) => resolve(role ? role.name : ""));
    }
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM role`, (err, result) => {
        if (err) return reject(err);
        let role: IRole | undefined = new Role();
        if (result && result.length > 0) {
          this.allRole = result.map((item: any) => new Role(item));
          role = this.allRole.find((item) => item.id === roleId);
        }
        resolve(role ? role.name : "");
      });
    });
  };

  checkUserRoleById = (userId: any, roleName: any) => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT 1 FROM users ut
                    INNER JOIN role rt
                    ON rt.id=ut.user_role
                    WHERE ut.id=${userId} AND rt.name='${roleName}'`,
        (err, result) => {
          if (err) return reject(err);
          resolve(result && result.length > 0);
        }
      );
    });
  };

  checkUserRoleValid = (userId: any, listRoleName) => {
    const roleQuery = listRoleName
      .map((roleName) => `rt.name='${roleName}'`)
      .join(" OR ");
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT 1 FROM users ut
                    INNER JOIN role rt
                    ON rt.id=ut.user_role
                    WHERE ut.id=${userId} AND (${roleQuery})`,
        (err, result) => {
          if (err) return reject(err);
          resolve(result && result.length > 0);
        }
      );
    });
  };

  getUserRole = (userId: number): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT rt.name FROM users ut
                    INNER JOIN role rt
                    ON rt.id=ut.user_role
                    WHERE ut.id=${userId}`,
        (err, result) => {
          if (err) return reject(err);
          let role = null;
          if (result && result.length > 0) {
            role = result[0].name;
          }
          resolve(role);
        }
      );
    });
  };

  getAllRole = () => {
    if (this.allRole && this.allRole.length) {
      return new Promise((resolve) => resolve(this.allRole));
    }
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM role`, (err, result) => {
        if (err) return reject(err);
        if (result && result.length > 0) {
          this.allRole = result;
        }
        resolve(this.allRole);
      });
    });
  };
}

export default RoleService;
