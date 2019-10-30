import { combineReducers, AnyAction } from "redux";
import { grantAppealTxs, grantAppealTxsFetching } from "./challenges";
import {
  government,
  govtParameters,
  constitution,
  appellate,
  controller,
  appellateMembers,
  councilMultisigTransactions,
  govtProposals,
} from "./government";
import { user } from "./userAccount";
import { network, networkName } from "./network";
import { ui, useGraphQL, showWeb3AuthModal, web3AuthType } from "./ui";
import { contractAddresses } from "./contractAddresses";
import { Set, Map } from "immutable";
import { EthAddress, MultisigTransaction, EthContentHeader, ContentData, TxDataAll } from "@joincivil/core";
import { currentUserNewsrooms, content, contentFetched, charterRevisions } from "./newsrooms";
import {
  newsrooms,
  NewsroomState,
  newsroomUi,
  newsroomUsers,
  newsroomGovernment,
  grantApplication,
} from "@joincivil/newsroom-signup";
import { networkActions } from "../actionCreators/network";

export interface State {
  networkDependent: NetworkDependentState;
  network: string;
  networkName: string;
  ui: Map<string, any>;
  useGraphQL: boolean;
  showWeb3AuthModal: boolean;
  web3AuthType: string;
  newsrooms: Map<string, NewsroomState>;
  newsroomUi: Map<string, any>;
  newsroomUsers: Map<EthAddress, string>;
  newsroomGovernment: Map<string, string>;
  grantApplication: Map<string, boolean>;
}

export interface NetworkDependentState {
  currentUserNewsrooms: Set<string>;
  content: Map<string, ContentData>;
  contentFetched: Map<string, EthContentHeader>;
  user: { account: any };
  govtParameters: object;
  govtProposals: Map<string, object>;
  grantAppealTxs: Map<string, TxDataAll>;
  grantAppealTxsFetching: Map<string, boolean>;
  government: Map<string, string>;
  constitution: Map<string, string>;
  appellate: string;
  controller: string;
  appellateMembers: string[];
  councilMultisigTransactions: Map<string, MultisigTransaction>;
  contractAddresses: Map<string, EthAddress>;
}

const networkDependentReducers = combineReducers({
  currentUserNewsrooms,
  content,
  contentFetched,
  charterRevisions,
  user,
  govtParameters,
  govtProposals,
  grantAppealTxs,
  grantAppealTxsFetching,
  government,
  constitution,
  appellate,
  controller,
  appellateMembers,
  councilMultisigTransactions,
  contractAddresses,
});

const networkDependent = (state: any, action: AnyAction) => {
  if (action.type === networkActions.SET_NETWORK) {
    return networkDependentReducers(undefined, action);
  }
  return networkDependentReducers(state, action);
};
import { connectRouter } from "connected-react-router";

export default (history: any) =>
  combineReducers({
    router: connectRouter(history),
    newsrooms, // have to be top level because come from a package
    newsroomUi,
    newsroomUsers,
    newsroomGovernment,
    grantApplication,
    networkDependent,
    network,
    networkName,
    ui,
    useGraphQL,
    showWeb3AuthModal,
    web3AuthType,
  });
