import * as Web3 from "web3";

export interface WsProviderOptions {
  timeout: number;
  headers: any[];
  protocol: string;
}

export interface Web310Provider {
  send(payload: Web3.JSONRPCRequestPayload, callback: Web3.JSONRPCErrorCallback): void;
}

export class ProviderBackport implements Web3.Provider {
  public implementation: Web310Provider;

  public constructor(newProvider: Web310Provider) {
    this.implementation = newProvider;
  }

  public send(payload: Web3.JSONRPCRequestPayload): Web3.JSONRPCResponsePayload {
    throw new Error("Not supported by design");
  }

  public sendAsync(payload: Web3.JSONRPCRequestPayload, callback: Web3.JSONRPCErrorCallback): void {
    this.implementation.send(payload, callback);
  }
}
