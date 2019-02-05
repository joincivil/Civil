import { AnyAction } from "redux";
import { EthAddress } from "@joincivil/core";

export enum contractAddressesActions {
  SET_CONTRACT_ADDRESS = "SET_CONTRACT_ADDRESS",
}

export const setContractAddress = (contractAddressKey: string, contractAddressValue: EthAddress): AnyAction => {
  return {
    type: contractAddressesActions.SET_CONTRACT_ADDRESS,
    key: contractAddressKey,
    value: contractAddressValue,
  };
};
