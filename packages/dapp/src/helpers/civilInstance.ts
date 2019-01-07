import { Civil } from "@joincivil/core";
import { CivilTCR } from "../../../core/build/src/contracts/tcr/civilTCR";
import { detectProvider, INFURA_WEBSOCKET_HOSTS } from "@joincivil/ethapi";
import * as WSProvider from "web3-providers-ws";

let civil: Civil;
let tcr: CivilTCR;

export const setCivil = () => {
  if (!civil) {
    let provider = detectProvider();
    if (!provider) {
      provider = new WSProvider(INFURA_WEBSOCKET_HOSTS.RINKEBY);
      console.warn("No injected provider found, using infura for read only dapp");
    }
    civil = new Civil({ web3Provider: provider });
  }
};

export const getCivil = () => {
  if (!civil) {
    setCivil();
  }
  return civil;
};

export const getTCR = async () => {
  if (!tcr) {
    setCivil();
  }
  if (!tcr) {
    try {
      tcr = await civil.tcrSingletonTrusted();
    } catch (ex) {
      console.error("Unable to get TCR. Check that Metamask is installed and set to Rinkeby.");
    }
  }
  return tcr;
};

export const isGraphQLSupportedOnNetwork = (network: string): boolean => {
  if (network === "1") {
    // mainnet
    return false; // TODO: should be true once production tcr is deployed with graphql support
  } else if (network === "4") {
    // rinkeby
    return true;
  } else if (network === "50") {
    return true;
  } else {
    return false;
  }
};
