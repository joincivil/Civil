import { AnyAction } from "redux";
import { governmentActions } from "../actionCreators/government";
import { Map } from "immutable";
import { MultisigTransaction } from "@joincivil/core/build/src/contracts/multisig/multisigtransaction";

export function govtParameters(state: object = {}, action: AnyAction): object {
  switch (action.type) {
    case governmentActions.SET_GOVT_PARAMETER:
      return { ...state, [action.paramName]: action.paramValue };
    case governmentActions.MULTI_SET_GOVT_PARAMETERS:
      return { ...state, ...action.params };
    default:
      return state;
  }
}

export function government(state: Map<string, string> = Map<string, string>(), action: AnyAction): Map<string, string> {
  switch (action.type) {
    case governmentActions.ADD_GOVERNMENT_DATA:
      return state.set(action.data.key, action.data.value);
    default:
      return state;
  }
}

export function constitution(
  state: Map<string, string> = Map<string, string>(),
  action: AnyAction,
): Map<string, string> {
  switch (action.type) {
    case governmentActions.SET_CONSTITUTION_DATA:
      return state.set(action.data.key, action.data.value);
    default:
      return state;
  }
}

export function appellate(state: string = "", action: AnyAction): string {
  switch (action.type) {
    case governmentActions.SET_APPELLATE:
      return action.data;
    default:
      return state;
  }
}

export function controller(state: string = "", action: AnyAction): string {
  switch (action.type) {
    case governmentActions.SET_CONTROLLER:
      return action.data;
    default:
      return state;
  }
}

export function appellateMembers(state: string[] = [""], action: AnyAction): string[] {
  switch (action.type) {
    case governmentActions.SET_APPELLATE_MEMBERS:
      return action.data;
    default:
      return state;
  }
}

export function councilMultisigTransactions(
  state: Map<string, MultisigTransaction> = Map<string, MultisigTransaction>(),
  action: AnyAction,
): Map<string, MultisigTransaction> {
  switch (action.type) {
    case governmentActions.ADD_COUNCIL_MULTISIG_TRANSACTION:
      console.log("action.data: ", action.data.information.data);
      return state.set(action.data.information.data, action.data);
    default:
      return state;
  }
}
