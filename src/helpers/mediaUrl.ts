import { baseMediaUrl } from "../constants";

export const getFullMediaUrl = (path: string): string | null =>
  path ? baseMediaUrl + path : null;
