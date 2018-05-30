import { Civil } from "@joincivil/core";
import { CivilTCR } from "../../../core/build/src/contracts/tcr/civilTCR";

let civil: Civil;
let tcr: CivilTCR;

export const setCivil = () => {
  if (!civil) {
    civil = new Civil();
    try {
      tcr = civil.tcrSingletonTrusted();
    } catch (ex) {
      console.error("Unable to get TCR. Check that Metamask is installed and set to Rinkeby.");
    }
  }
};

export const getCivil = () => {
  if (!civil) {
    setCivil();
  }
  return civil;
};

export const getTCR = () => {
  if (!tcr) {
    setCivil();
  }
  return tcr;
};
