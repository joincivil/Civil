export const IDENTITY_LOGIN_REQUEST = "IDENTITY_LOGIN_REQUEST";
export const IDENTITY_LOGIN_RESPONSE = "IDENTITY_LOGIN_RESPONSE";
export const IDENTITY_SIGNUP_REQUEST = "IDENTITY_SIGNUP_REQUEST";

export interface LoginRequest {
  service: string;
}
export interface SignupRequest {
  service: string;
}

export interface LoginResponse {
  did: string;
}
