export * from "./VerifyToken";
export * from "./Auth/EmailAuth";
export * from "./Auth/EmailSent";
export * from "./Auth/EthAuth";
export * from "./LoadUser";

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
