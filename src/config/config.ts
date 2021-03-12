import dotenv from "dotenv";
import myConfig from "../enviroments";
import envConfig from "../config.env";

dotenv.config();

const MYSQL_HOST = envConfig.MYSQL_HOST || myConfig.MYSQL_HOST || "";
const MYSQL_DATABASE =
  envConfig.MYSQL_DATABASE || myConfig.MYSQL_DATABASE || "";
const MYSQL_USER = envConfig.MYSQL_USER || myConfig.MYSQL_USER || "";
const MYSQL_PASSWORD =
  envConfig.MYSQL_PASSWORD || myConfig.MYSQL_PASSWORD || "";
const MYSQL_PORT = envConfig.MYSQL_PORT || myConfig.MYSQL_PORT || "";
const MYSQL_CONNECTIONLIMIT =
  envConfig.MYSQL_CONNECTIONLIMIT || myConfig.MYSQL_CONNECTIONLIMIT || 10;

const MYSQL = {
  host: MYSQL_HOST,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  port: Number(MYSQL_PORT),
  connectionLimit: Number(MYSQL_CONNECTIONLIMIT),
};

const SERVER_HOSTNAME = envConfig.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = envConfig.SERVER_PORT || myConfig.SERVER_PORT || 3000;
const SERVER_DOMAIN_ASSETS =
  envConfig.SERVER_DOMAIN_ASSETS || myConfig.SERVER_DOMAIN_ASSETS;

const SERVER = {
  hostName: SERVER_HOSTNAME,
  port: SERVER_PORT,
  domainAssets: SERVER_DOMAIN_ASSETS,
};

console.log(envConfig.SERVER_DOMAIN_ASSETS);
const config = {
  mysql: MYSQL,
  server: SERVER,
};


export default config;
