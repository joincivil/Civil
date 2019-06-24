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
    const { implementation } = this;
    // Check if websocket connection is open (readyState === 1) before sending. Otherwise calling `send` indiscriminately can cause a too much recursion error
    if (implementation && (implementation as any).connection && (implementation as any).connection.readyState === 1) {
      this.implementation.send(payload, callback);
    }
  }
}
