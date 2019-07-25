import { EthAddress } from "@joincivil/core";
import { BigNumber } from "bignumber.js";

export interface SubmitChallengeProps {
  history?: any;
  listingAddress: EthAddress;
  listingURI: string;
  governanceGuideURI: string;
}

export interface SubmitChallengeReduxProps {
  newsroomName: string;
  charterRevisionId?: number;
}

export interface SubmitChallengeReduxParametersProps {
  minDeposit: BigNumber;
  commitStageLen: BigNumber;
  revealStageLen: BigNumber;
  balance: BigNumber;
}
