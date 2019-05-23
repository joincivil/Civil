import { EthAddress } from "@joincivil/core";

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
  minDeposit: string;
  commitStageLen: string;
  revealStageLen: string;
  isInsufficientBalance: boolean;
}
