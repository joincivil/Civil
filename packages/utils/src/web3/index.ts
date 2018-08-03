import * as Web3 from "web3";
import ProviderEngine = require("web3-provider-engine");
// @ts-ignore
import RpcSubprovider = require("web3-provider-engine/subproviders/rpc");

export * from "./ledger";

export enum ProviderType {
  METAMASK = "Metamask",
  TRUST = "Trust",
  TOSHI = "Toshi",
  CIPHER = "Cipher",
  MIST = "Mist",
  PARITY = "Parity",
  INFURA = "Infura",
  TREZOR = "Trezor",
  LEDGER = "Ledger",
}

// TODO(jorgelo): Maybe promisify web3?
export function getAccountsPromise(web3: Web3): Promise<[any]> {
  return new Promise((fulfill, reject) => {
    web3.eth.getAccounts((err: any, res: any) => {
      if (err) {
        return reject(err);
      }
      fulfill(res);
    });
  });
}

export function getHardwareWeb3(providerFactory: any): Web3 {
  const engine = new ProviderEngine();
  const web3 = new Web3(engine);

  engine.addProvider(providerFactory);

  // engine.addProvider(
  //   new RpcSubprovider({
  //     // rpcUrl: "https://mainnet.infura.io",
  //     rpcUrl: "https://rinkeby.infura.io",
  //   }),
  // );

  engine.start();

  return web3;
}

export function getBrowserWeb3(): Web3 {
  const { web3: globalWeb3 } = window as any;

  if (typeof globalWeb3 === "undefined") {
    throw new Error("Browser web3 not found.");
  }

  const web3 = new Web3(globalWeb3.currentProvider);

  return web3;
}

export function getBrowserProviderType(): ProviderType | undefined {
  // Swiped from here: https://ethereum.stackexchange.com/questions/24266/elegant-way-to-detect-current-provider-int-web3-js

  const globalWindow = window as any;
  const globalWeb3 = globalWindow.web3;

  if (typeof globalWeb3 === "undefined") {
    throw new Error("Browser web3 not found.");
  }

  if (globalWeb3.currentProvider.isMetaMask) {
    return ProviderType.METAMASK;
  }

  // TODO: Test the rest

  // if (globalWeb3.currentProvider.isTrust) {
  //   return ProviderType.TRUST;
  // }

  // if (typeof globalWindow.SOFA !== "undefined") {
  //   return ProviderType.TOSHI;
  // }

  // if (typeof globalWindow.__CIPHER__ !== "undefined") {
  //   return ProviderType.CIPHER;
  // }

  // if (globalWeb3.currentProvider.constructor.name === "EthereumProvider") {
  //   return ProviderType.MIST;
  // }

  // if (globalWeb3.currentProvider.constructor.name === "Web3FrameProvider") {
  //   return ProviderType.PARITY;
  // }

  // if (globalWeb3.currentProvider.host && globalWeb3.currentProvider.host.indexOf("infura") !== -1) {
  //   return ProviderType.INFURA;
  // }

  return;
}
