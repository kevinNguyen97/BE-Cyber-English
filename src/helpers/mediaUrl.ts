import config from "../config/config";
import { baseMediaUrl } from "../constants";

export const getFullMediaUrl = (path: string): string => {
  return path ? config.server.domainAssets + "/" + baseMediaUrl + path : "";
};
