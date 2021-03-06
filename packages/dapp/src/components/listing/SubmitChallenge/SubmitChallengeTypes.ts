import { BigNumber, EthAddress } from "@joincivil/typescript-types";

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
  balance: BigNumber;
}
