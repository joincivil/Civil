export * from "./VerifyToken";
export * from "./Auth/EmailAuth";
export * from "./Auth/EmailSent";

export enum AuthApplicationEnum {
  DEFAULT = "DEFAULT",
  NEWSROOM = "NEWSROOM",
  STOREFRONT = "STOREFRONT",
}

export interface AuthLoginResponse {
  token: string;
  refreshToken: string;
  uid: string;
}