import { AnyAction } from "redux";
import { Dispatch } from "react-redux";
import { getTCR } from "../../helpers/civilInstance";
import { MultisigTransaction } from "@joincivil/core/build/src/contracts/multisig/multisigtransaction";

export enum governmentActions {
  ADD_OR_UPDATE_GOVT_PROPOSAL = "ADD_OR_UPDATE_GOVT_PROPOSAL",
  SET_GOVT_PARAMETER = "SET_GOVT_PARAMETER",
  MULTI_SET_GOVT_PARAMETERS = "MULTI_SET_GOVT_PARAMETERS",
  ADD_GOVERNMENT_DATA = "ADD_GOVERNMENT_DATA",
  SET_CONSTITUTION_DATA = "SET_CONSTITUTION_DATA",
  SET_APPELLATE = "SET_APPELLATE",
  SET_CONTROLLER = "SET_CONTROLLER",
  SET_APPELLATE_MEMBERS = "SET_APPELLATE_MEMBERS",
  ADD_COUNCIL_MULTISIG_TRANSACTION = "ADD_COUNCIL_MULTISIG_TRANSACTION",
}

export const setGovernmentParameter = (paramName: string, paramValue: any): AnyAction => {
  return {
    type: governmentActions.SET_GOVT_PARAMETER,
    paramName,
    paramValue,
  };
};

export const multiSetGovtParameters = (paramsObj: object): AnyAction => {
  return {
    type: governmentActions.MULTI_SET_GOVT_PARAMETERS,
    params: paramsObj,
  };
};

export const addOrUpdateGovtProposal = (proposal: object): AnyAction => {
  return {
    type: governmentActions.ADD_OR_UPDATE_GOVT_PROPOSAL,
    proposal,
  };
};

export const addGovernmentData = (governmentDataKey: string, governmentDataValue: string): AnyAction => {
  return {
    type: governmentActions.ADD_GOVERNMENT_DATA,
    data: {
      key: governmentDataKey,
      value: governmentDataValue,
    },
  };
};

export const setConstitutionData = (constitutionDataKey: string, constitutionDataValue: string): AnyAction => {
  return {
    type: governmentActions.SET_CONSTITUTION_DATA,
    data: {
      key: constitutionDataKey,
      value: constitutionDataValue,
    },
  };
};

export const setAppellate = (appellate: string): AnyAction => {
  return {
    type: governmentActions.SET_APPELLATE,
    data: appellate,
  };
};

export const setController = (controller: string): AnyAction => {
  return {
    type: governmentActions.SET_CONTROLLER,
    data: controller,
  };
};
export const setAppellateMembers = (members: string[]): AnyAction => {
  return {
    type: governmentActions.SET_APPELLATE_MEMBERS,
    data: members,
  };
};

export const addCouncilMultisigTransaction = (transaction: MultisigTransaction): AnyAction => {
  return {
    type: governmentActions.ADD_COUNCIL_MULTISIG_TRANSACTION,
    data: transaction,
  };
};

export const checkAndUpdateGovtParameterProposalState = (paramPropID: string): any => {
  return async (dispatch: Dispatch<any>, getState: any): Promise<AnyAction | undefined> => {
    const { proposals } = getState().networkDependent;
    const paramProposal = proposals.get(paramPropID);
    if (!paramProposal) {
      return;
    }
    const tcr = await getTCR();
    const government = await tcr.getGovernment();
    const paramProposalState = await government.getPropState(paramPropID);

    if (paramProposalState !== paramProposal.state) {
      return dispatch(addOrUpdateGovtProposal({ ...paramProposal, state: paramProposalState }));
    }

    return;
  };
};
