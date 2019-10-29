import { EthAddress } from "@joincivil/core";
import { Dispatch } from "react-redux";
import { AnyAction } from "redux";
import { CivilHelper } from "../../apis/CivilHelper";

export enum challengeActions {
  ADD_GRANT_APPEAL_TX = "ADD_GRANT_APPEAL_TX",
  FETCH_GRANT_APPEAL_TX = "FETCH_GRANT_APPEAL_TX",
}

export const addGrantAppealTx = (listingAddress: EthAddress, txData: any): AnyAction => {
  return {
    type: challengeActions.ADD_GRANT_APPEAL_TX,
    data: { listingAddress, txData },
  };
};

export const fetchGrantAppealTx = (listingAddress: EthAddress) => {
  return {
    type: challengeActions.FETCH_GRANT_APPEAL_TX,
    data: { listingAddress },
  };
};

export const fetchAndAddGrantAppealTx = (helper: CivilHelper, listingAddress: string): any => {
  return async (dispatch: Dispatch<any>): Promise<AnyAction> => {
    dispatch(fetchGrantAppealTx(listingAddress));
    const tcr = await helper.getTCR();
    const grantAppealTx = await tcr.getRawGrantAppealTxData(listingAddress);

    return dispatch(addGrantAppealTx(listingAddress, grantAppealTx));
  };
};
