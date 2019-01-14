import { fetchItem, setItem } from "./localStorage";

export interface Auth {
  token: string;
  refreshToken: string;
  uid: string;
}
