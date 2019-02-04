import { AnyAction } from "redux";
import { Map } from "immutable";
import { EthAddress } from "@joincivil/core";
import { contractAddressesActions } from "../actionCreators/contractAddresses";

export function contractAddresses(
  state: Map<string, EthAddress> = Map<string, EthAddress>(),
  action: AnyAction,
): Map<string, EthAddress> {
  switch (action.type) {
    case contractAddressesActions.SET_CONTRACT_ADDRESS:
      return state.set(action.key, action.value);
    default:
      return state;
  }
}
