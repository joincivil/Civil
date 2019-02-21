import { AnyAction } from "redux";
import { Dispatch } from "react-redux";
import { getTCR } from "../../helpers/civilInstance";
import { ParamPropChallengeData, EthAddress, UserChallengeData } from "@joincivil/core";
import { ensureWeb3BigNumber } from "../../apis/civilTCR";

export enum parameterizerActions {
  ADD_OR_UPDATE_PROPOSAL = "ADD_OR_UPDATE_PROPOSAL",
  SET_PARAMETER = "SET_PARAMETER",
  MULTI_SET_PARAMETERS = "MULTI_SET_PARAMETERS",
  ADD_OR_UPDATE_CHALLENGE = "PARAMETERIZER_ADD_OR_UPDATE_CHALLENGE",
  FETCH_CHALLENGE_DATA = "PARAMETERIZER_FETCH_CHALLENGE_DATA",
  FETCH_CHALLENGE_DATA_COMPLETE = "PARAMETERIZER_FETCH_CHALLENGE_DATA_COMPLETE",
  FETCH_CHALLENGE_DATA_IN_PROGRESS = "PARAMETERIZER_FETCH_CHALLENGE_DATA_IN_PROGRESS",
  FETCH_AND_ADD_CHALLENGE_DATA = "PARAMETERIZER_FETCH_AND_ADD_CHALLENGE_DATA",
  ADD_OR_UPDATE_USER_PROPOSAL_CHALLENGE_DATA = "ADD_OR_UPDATE_USER_PROPOSAL_CHALLENGE_DATA",
}

export const setParameter = (paramName: string, paramValue: any): AnyAction => {
  return {
    type: parameterizerActions.SET_PARAMETER,
    paramName,
    paramValue,
  };
};

export const multiSetParameters = (paramsObj: object): AnyAction => {
  return {
    type: parameterizerActions.MULTI_SET_PARAMETERS,
    params: paramsObj,
  };
};

export const addOrUpdateProposal = (proposal: object): AnyAction => {
  return {
    type: parameterizerActions.ADD_OR_UPDATE_PROPOSAL,
    proposal,
  };
};

export const addParameterProposalChallenge = (
  challengeID: string,
  challengeData: ParamPropChallengeData,
): AnyAction => {
  return {
    type: parameterizerActions.ADD_OR_UPDATE_CHALLENGE,
    data: { challengeID, ...challengeData },
  };
};

export const addUserProposalChallengeData = (
  challengeID: string,
  user: EthAddress,
  userChallengeData: UserChallengeData,
) => {
  return {
    type: parameterizerActions.ADD_OR_UPDATE_USER_PROPOSAL_CHALLENGE_DATA,
    data: { challengeID, user, userChallengeData },
  };
};

export const fetchParameterProposalChallenge = (challengeID: string): AnyAction => {
  return {
    type: parameterizerActions.FETCH_CHALLENGE_DATA,
    data: {
      challengeID,
      isFetching: true,
    },
  };
};

export const fetchParameterProposalChallengeInProgress = (challengeID: string): AnyAction => {
  return {
    type: parameterizerActions.FETCH_CHALLENGE_DATA_IN_PROGRESS,
    data: {
      challengeID,
      isFetching: true,
    },
  };
};

export const fetchParameterProposalChallengeComplete = (challengeID: string): AnyAction => {
  return {
    type: parameterizerActions.FETCH_CHALLENGE_DATA_COMPLETE,
    data: {
      challengeID,
      isFetching: false,
    },
  };
};

export const fetchAndAddParameterProposalChallengeData = (challengeID: string): any => {
  return async (dispatch: Dispatch<any>, getState: any): Promise<AnyAction> => {
    const { challengesFetching } = getState().networkDependent;
    const challengeRequest = challengesFetching.get(challengeID);

    // Never fetchParameterProposaled this before, so let's fetchParameterProposal it
    if (challengeRequest === undefined) {
      dispatch(fetchParameterProposalChallenge(challengeID));

      const tcr = await getTCR();
      const parameterizer = await tcr.getParameterizer();
      const challengeIDBN = ensureWeb3BigNumber(parseInt(challengeID, 10));
      const challengeData = await parameterizer.getChallengeData(challengeIDBN);
      dispatch(addParameterProposalChallenge(challengeID, challengeData));

      return dispatch(fetchParameterProposalChallengeComplete(challengeID));

      // We think it's still fetchParameterProposaling, so fire an action in case we want to capture this
      // state for a progress indicator
    } else if (challengeRequest.isFetching) {
      return dispatch(fetchParameterProposalChallengeInProgress(challengeID));

      // This was an additional request for a challenge that was already fetchParameterProposaled
    } else {
      return dispatch(fetchParameterProposalChallengeComplete(challengeID));
    }
  };
};

export const checkAndUpdateParameterProposalState = (paramPropID: string): any => {
  return async (dispatch: Dispatch<any>, getState: any): Promise<AnyAction | undefined> => {
    const { proposals } = getState().networkDependent;
    const paramProposal = proposals.get(paramPropID);
    if (!paramProposal) {
      return;
    }
    const tcr = await getTCR();
    const parameterizer = await tcr.getParameterizer();
    const paramProposalState = await parameterizer.getPropState(paramPropID);

    if (paramProposalState !== paramProposal.state) {
      return dispatch(addOrUpdateProposal({ ...paramProposal, state: paramProposalState }));
    }

    return;
  };
};
