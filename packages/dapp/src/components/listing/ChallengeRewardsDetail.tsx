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
import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";
import { BigNumber } from "@joincivil/typescript-types";
import { getFormattedTokenBalance } from "@joincivil/utils";

export interface ChallengeRewardsDetailProps {
  challengeID: BigNumber;
  challenge?: ChallengeData;
  appealChallenge?: AppealChallengeData;
  user?: EthAddress;
  userChallengeData?: UserChallengeData;
}

class ChallengeRewardsDetail extends React.Component<ChallengeRewardsDetailProps> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

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
        isClaimRewardsVisible = canUserCollectAppealChallengeReward(appealChallenge, userChallengeData);
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
            transactions={[{ transaction: this.claimRewards }]}
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

  private claimRewards = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return this.context.claimRewards(this.props.challengeID, this.props.userChallengeData!.salt!);
  };

  private rescueTokens = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return this.context.rescueTokens(this.props.challengeID);
  };
}

export default ChallengeRewardsDetail;
