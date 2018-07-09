import * as Web3 from "web3";
import * as WebsocketProvider from "web3-providers-ws";

export * from "./infura";

export interface WsProviderOptions {
  timeout: number;
  headers: any[];
  protocol: string;
}

export class WebsocketProviderBackport implements Web3.Provider {
  public implementation: any;

  public constructor(url: string, options?: WsProviderOptions) {
    this.implementation = new WebsocketProvider(url, options);
  }

  public sendAsync(payload: Web3.JSONRPCRequestPayload, callback: Web3.JSONRPCErrorCallback): void {
    this.implementation.send(payload, callback);
  }
}
