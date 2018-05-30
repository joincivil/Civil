import { Civil } from "@joincivil/core";
import { CivilTCR } from "../../../core/build/src/contracts/tcr/civilTCR";

let civil: Civil;
let tcr: CivilTCR;

export const setCivil = (onAccountUpdated?: () => any) => {
  if (!civil) {
    civil = new Civil(undefined, onAccountUpdated);
    try {
      tcr = civil.tcrSingletonTrusted();
    } catch (ex) {
      console.error("Unable to get TCR. Check that Metamask is installed and set to Rinkeby.");
    }
  }
};

export const getCivil = (onAccountUpdated?: () => any) => {
  if (!civil || onAccountUpdated) {
    setCivil(onAccountUpdated);
  }
  return civil;
};

export const getTCR = () => {
  if (!tcr) {
    setCivil();
  }
  return tcr;
};
