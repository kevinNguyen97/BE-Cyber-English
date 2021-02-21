import config, { enviroment } from "../config/config";
import { baseMediaUrl, betaDomain } from "../constants";

export const getFullMediaUrl = (path: string): string | null => {
  const domain =
  enviroment === "development"
      ? `${config.server.hostName}:${config.server.port}`
      : betaDomain;
  return path ? domain + baseMediaUrl + path : null;
};
