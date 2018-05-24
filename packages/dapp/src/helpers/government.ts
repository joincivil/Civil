import { Dispatch } from "react-redux";
import { multiSetGovtParameters } from "../actionCreators/government";
import { getGovernmentParameters } from "../apis/civilTCR";

export async function initializeGovernment(dispatch: Dispatch<any>): Promise<void> {
  const paramKeys = ["requestAppealLen", "judgeAppealLen", "appealFee", "appealVotePercentage"];

  const parameterVals = await getGovernmentParameters(paramKeys);
  const paramObj = parameterVals.reduce((acc, item, index) => {
    acc[paramKeys[index]] = item.toString();
    return acc;
  }, {});

  dispatch(multiSetGovtParameters(paramObj));
}

/*export async function initializeProposalsSubscriptions(dispatch: Dispatch<any>): Promise<void> {
  const tcr = getTCR();
  const govt = await tcr.getGovernment();
  await Observable.merge(
    govt.
  ).subscribe(async (propID: string) => {

    dispatch(
      setGovernmentParameter(
        paramName,
        propValue,
      ),
    );
  });
}*/
