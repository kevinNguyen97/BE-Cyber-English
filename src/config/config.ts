import dotenv from 'dotenv'
import myConfig from '../enviroments'

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST || myConfig.MYSQL_HOST || ""
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || myConfig.MYSQL_DATABASE || ""
const MYSQL_USER = process.env.MYSQL_USER || myConfig.MYSQL_USER || ""
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || myConfig.MYSQL_PASSWORD || ""
const MYSQL_PORT = process.env.MYSQL_PORT || myConfig.MYSQL_PORT || ""
const MYSQL_CONNECTIONLIMIT = process.env.MYSQL_CONNECTIONLIMIT || myConfig.MYSQL_CONNECTIONLIMIT || 10

const MYSQL = {
    host: MYSQL_HOST,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    port: Number(MYSQL_PORT),
    connectionLimit: Number(MYSQL_CONNECTIONLIMIT),
}

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.PORT || myConfig.SERVER_PORT || 3000;


const SERVER = {
    hostName: SERVER_HOSTNAME,
    port: SERVER_PORT,
}

const config = {
    mysql: MYSQL,
    server: SERVER,
}

export const enviroment = process.env.NODE_ENV || 'beta';

export default config;