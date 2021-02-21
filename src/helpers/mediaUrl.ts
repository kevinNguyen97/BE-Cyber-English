import config from "../config/config";
import { baseMediaUrl } from "../constants";

export const getFullMediaUrl = (path: string): string | null => {
  const domain =
    config.server.hostName === "localhost"
      ? "localhost:3000"
      : config.server.hostName;
  return path ? domain + baseMediaUrl + path : null;
};
