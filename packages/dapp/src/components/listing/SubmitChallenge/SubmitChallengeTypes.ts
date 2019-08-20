import { EthAddress } from "@joincivil/core";
import { BigNumber } from "@joincivil/typescript-types";

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
