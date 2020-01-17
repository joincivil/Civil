import { Action, MiddlewareAPI, Dispatch } from "redux";
import { ChildPlugin, PARENT_REQUEST, ParentHandler, ViewPlugin } from "@kirby-web3/child-core";
import { EthereumChildPlugin } from "@kirby-web3/plugin-ethereum";
import * as ethers from "ethers";

import { IDENTITY_LOGIN_REQUEST, IDENTITY_LOGIN_RESPONSE, IDENTITY_SIGNUP_REQUEST, LoginResponse } from "./common";

// action types
// state
export interface ChildPluginState {
  pendingLoginRequest?: {
    requestID: number;
    message: string;
    domain: string;
  };
  pendingSignupRequest?: {
    requestID: number;
    message: string;
    domain: string;
  };
}

// actions
export interface IdentityLoginResponseAction {
  type: typeof IDENTITY_LOGIN_RESPONSE;
  payload: LoginResponse;
}

// action union type
export type ChildPluginActions = IdentityLoginResponseAction;

export interface ChildDependencies {
  ethereum: EthereumChildPlugin;
  iframe: ParentHandler;
}

export class CivilIDPlugin extends ChildPlugin<any, ChildDependencies, ChildPluginActions> {
  public name = "civilid";
  public dependsOn = ["view", "ethereum", "iframe"];
  public channel?: any;

  public middleware = (api: MiddlewareAPI<any>) => (next: Dispatch<any>) => <A extends Action>(action: any): void => {
    if (action.type === PARENT_REQUEST) {
      switch (action.data.type) {
        case IDENTITY_LOGIN_REQUEST:
          (this.dependencies.view as ViewPlugin).requestView("/identity/login");
          next(action);
          break;
        case IDENTITY_SIGNUP_REQUEST:
          (this.dependencies.view as ViewPlugin).requestView("/identity/signup");
          next(action);
          break;
        default:
          next(action);
      }
    } else {
      next(action);
    }
  };

  public reducer(state: ChildPluginState = {}, action: any): any {
    if (action.type === PARENT_REQUEST && action.data.type === IDENTITY_LOGIN_REQUEST) {
      return {
        ...state,
        pendingLoginRequest: this.buildSignatureRequest(action.requestID, this.dependencies.iframe.parentDomain),
      };
    } else if (action.type === PARENT_REQUEST && action.data.type === IDENTITY_SIGNUP_REQUEST) {
      return {
        ...state,
        pendingSignupRequest: this.buildSignatureRequest(action.requestID, this.dependencies.iframe.parentDomain),
      };
    }
    return state;
  }

  public async startup(): Promise<void> {
    this.logger("starting up");
  }

  public buildSignatureRequest(requestID: string, domain: string): any {
    const message = `Authenticate to ${domain} @ ${new Date().toISOString()}`;
    return {
      message,
      requestID,
      domain,
    };
  }

  public sendLoginResponse(signer: string, signature: string): void {
    const state = this.getState().civilid as ChildPluginState;
    const { requestID, domain, ...request } = state.pendingLoginRequest!;
    const response = { signer, signature, ...request };
    this.dependencies.iframe.respond(requestID, response);
  }
  public cancelLogin(reason?: any): void {
    const state = this.getState().civilid as ChildPluginState;
    const { requestID } = state.pendingLoginRequest!;
    this.dependencies.iframe.reject(requestID, reason || "cancelled");
  }

  public sendSignupResponse(signer: string, signature: string): void {
    const state = this.getState().civilid as ChildPluginState;
    const { requestID, domain, ...request } = state.pendingSignupRequest!;
    const response = { signer, signature, ...request };
    this.dependencies.iframe.respond(requestID, response);
  }
  public cancelSignup(reason?: any): void {
    const state = this.getState().civilid as ChildPluginState;
    const { requestID } = state.pendingSignupRequest!;
    this.dependencies.iframe.reject(requestID, reason || "cancelled");
  }

  public generateWallet(mnemonic: string): void {
    const walletPath = "m/44'/60'/0'/0/0";

    const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonic);
    const node = hdnode.derivePath(walletPath);

    console.log("node", node.derivePath("1"));
    console.log("node1", node.derivePath("2"));
    console.log("node2", node.derivePath("3"));
    console.log("node3", node.derivePath("4"));
  }
}
