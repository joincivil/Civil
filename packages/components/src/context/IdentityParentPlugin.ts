import { ParentPlugin, DMZ } from "@kirby-web3/parent-core";
import { EthereumParentPlugin } from "@kirby-web3/plugin-ethereum";

export const IDENTITY_LOGIN_REQUEST = "IDENTITY_LOGIN_REQUEST";
export const IDENTITY_LOGIN_RESPONSE = "IDENTITY_LOGIN_RESPONSE";
export const IDENTITY_SIGNUP_REQUEST = "IDENTITY_SIGNUP_REQUEST";

export interface LoginRequest {
  service: string;
  challenge: string;
}

export interface LoginResponse {
  did: string;
}

export type IdentityPluginState = any;

export interface IdentityLoginRequestAction {
  type: typeof IDENTITY_LOGIN_REQUEST;
  payload: LoginRequest;
}

export type IdentityPluginActions = IdentityLoginRequestAction;

export interface Config {
  readOnlyNodeURI: string;
}

export interface ParentDependencies {
  ethereum: EthereumParentPlugin;
  dmz: DMZ;
}

export class IdentityParentPlugin extends ParentPlugin<Config, ParentDependencies, IdentityPluginActions> {
  public name = "identity";
  public dependsOn = ["ethereum", "dmz"];
  public web3: any;
  public provider: any;

  public reducer(state: IdentityPluginState = {}, action: any): any {
    return state;
  }

  public async login(service: string): Promise<void> {
    this.logger("starting DID login");
    const response = await this.dependencies.dmz.send({ type: IDENTITY_LOGIN_REQUEST, payload: { service } });
    this.logger("DID login response", response);
    return response;
  }
  public async signup(service: string): Promise<void> {
    this.logger("starting DID signup");
    const response = await this.dependencies.dmz.send({ type: IDENTITY_SIGNUP_REQUEST, payload: { service } });
    this.logger("DID signup response", response);
    return response;
  }
}
