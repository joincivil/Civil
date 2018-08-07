import * as React from "react";
import { ClaimRewards, RescueTokens } from "@joincivil/components";
import { StyledFormContainer, FormGroup } from "../utility/FormElements";
import {
  EthAddress,
  TwoStepEthTransaction,
  UserChallengeData,
  ChallengeData,
  canUserCollectReward,
  canRescueTokens,
  isUserWinner,
  AppealChallengeData,
  isUserAppealChallengeWinner,
  canUserCollectAppealChallengeReward,
  canRescueAppealChallengeTokens,
} from "@joincivil/core";
import { claimRewards, rescueTokens } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { fetchSalt } from "../../helpers/salt";

export interface ChallengeRewardsDetailProps {
  challengeID: BigNumber;
  challenge?: ChallengeData;
  appealChallenge?: AppealChallengeData;
  user?: EthAddress;
  userChallengeData?: UserChallengeData;
}

export interface ChallengeRewardsDetailState {
  salt?: string;
}

class ChallengeRewardsDetail extends React.Component<ChallengeRewardsDetailProps, ChallengeRewardsDetailState> {
  constructor(props: ChallengeRewardsDetailProps) {
    super(props);

    this.state = {
      salt: fetchSalt(this.props.challengeID, this.props.user), // TODO(jorgelo): This should probably be in redux.
    };
  }

  public render(): JSX.Element {
    const userChallengeData = this.props.userChallengeData;
    let isWinner;
    let isClaimRewardsVisible;
    let isRescueTokensVisible;
    let isClaimedRewardVisible;
    if (userChallengeData) {
      const challenge = this.props.challenge;
      const appealChallenge = this.props.appealChallenge;
      if (challenge) {
        isWinner = isUserWinner(challenge, userChallengeData);
        isClaimRewardsVisible = canUserCollectReward(challenge, userChallengeData);
        isRescueTokensVisible = canRescueTokens(challenge, userChallengeData);
      } else if (appealChallenge) {
        isWinner = isUserAppealChallengeWinner(appealChallenge, userChallengeData);
        isClaimedRewardVisible = canUserCollectAppealChallengeReward(appealChallenge, userChallengeData);
        isRescueTokensVisible = canRescueAppealChallengeTokens(appealChallenge, userChallengeData);
      }
      isClaimedRewardVisible = userChallengeData.didCollectAmount;
    }

    return (
      <StyledFormContainer>
        {!isWinner && (
          <FormGroup>
            Sorry, there are no rewards available for you for this challenge. Better luck next time!
          </FormGroup>
        )}

        {isClaimedRewardVisible && (
          <>
            <h3>Reward Claimed</h3>
            <label>
              You have collected {getFormattedTokenBalance(this.props.userChallengeData!.didCollectAmount!)} tokens by
              voting with the winning side of this challenge.
            </label>
          </>
        )}

        {isClaimRewardsVisible && (
          <ClaimRewards
            challengeID={this.props.challengeID.toString()}
            salt={this.state.salt!}
            transactions={[{ transaction: this.claimRewards }]}
            onInputChange={this.updateSalt}
          />
        )}

        {isRescueTokensVisible && (
          <RescueTokens
            challengeID={this.props.challengeID.toString()}
            transactions={[{ transaction: this.rescueTokens }]}
          />
        )}
      </StyledFormContainer>
    );
  }

  private updateSalt = (data: any, callback?: () => void) => {
    if (callback) {
      this.setState({ ...data }, callback);
    } else {
      this.setState({ ...data });
    }
  };

  private claimRewards = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    return claimRewards(this.props.challengeID, salt);
  };

  private rescueTokens = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return rescueTokens(this.props.challengeID);
  };
}

export default ChallengeRewardsDetail;
