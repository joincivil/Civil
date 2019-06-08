import { Civil } from "@joincivil/core";
import { CivilTCR } from "../../../core/build/src/contracts/tcr/civilTCR";
import { detectProvider, INFURA_WEBSOCKET_HOSTS } from "@joincivil/ethapi";
import * as WSProvider from "web3-providers-ws";
import { supportedNetworks } from "../helpers/networkHelpers";
import config from "./config";
import Portis from "@portis/web3";

let civil: Civil;
let tcr: CivilTCR;

export const setCivil = () => {
  if (!civil) {
    let provider;
    // let provider = detectProvider();
    // if (!provider) {
    switch (config.DEFAULT_ETHEREUM_NETWORK!) {
      case "1":
        provider = new WSProvider(INFURA_WEBSOCKET_HOSTS.MAINNET + "/" + config.INFURA_APP_KEY);
        break;
      case "4":
        provider = new WSProvider(INFURA_WEBSOCKET_HOSTS.RINKEBY + "/" + config.INFURA_APP_KEY);
        break;
      default:
        provider = new WSProvider(INFURA_WEBSOCKET_HOSTS.RINKEBY + "/" + config.INFURA_APP_KEY);
        break;
    }
    // console.warn("No injected provider found, using infura for read only dapp");
    // const portis = new Portis("548c174e-7484-463d-ac26-2633dd2ced69", "rinkeby");
    // console.log("portis: ", portis);
    // provider = portis.provider;
    // console.log("provider: ", provider);
    // }
    civil = new Civil({ web3Provider: provider });
  }
};

export const setReadWriteProvider = () => {
  let provider = detectProvider();
  if (provider) {
    civil = new Civil({ web3Provider: provider });
    (window as any).ethereum.enable();
  } else {
    const portis = new Portis("548c174e-7484-463d-ac26-2633dd2ced69", "rinkeby");
    console.log("portis: ", portis);
    provider = portis.provider;
    console.log("provider: ", provider);
    civil = new Civil({ web3Provider: provider });
    portis.showPortis();
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

export const isGraphQLSupportedOnNetwork = (network: number): boolean => {
  return supportedNetworks.includes(network);
};
