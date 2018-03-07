import * as Web3 from "web3";

import { promisify } from "./language";

export async function rpc(provider: Web3.Provider, method: string, ...params: any[]): Promise<Web3.JSONRPCResponsePayload> {
  const send = promisify<Web3.JSONRPCResponsePayload>(provider.sendAsync, provider);
  return send({
    id: new Date().getSeconds(),
    jsonrpc: "2.0",
    method,
    params,
  });
}
