import { baseMediaUrl } from "../constants";

export const getFullMediaUrl = (path: string, domain: string="local"): string | null =>
  path ? baseMediaUrl + path : null;
