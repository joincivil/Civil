import * as React from "react";
import { TransactionButton } from "@joincivil/components";
import { InputElement, StyledFormContainer, FormGroup } from "../utility/FormElements";
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
          <>
            <h3>Claim Rewards</h3>

            <FormGroup>Congrats, you have a reward available!</FormGroup>

            {/* @TODO(jon): We can remove this at some point in the near future
              since the value still get stored in React and the user will never see it.
              This is just here for debug purposes. */}
            <FormGroup>
              <label>
                Poll ID
                <InputElement type="text" name="" value={this.props.challengeID.toString()} readOnly={true} />
              </label>
            </FormGroup>

            <FormGroup>
              <label>Salt</label>
              <InputElement type="text" name="salt" onChange={this.updateChallengeRewardsParam} />
            </FormGroup>

            <FormGroup>
              <TransactionButton transactions={[{ transaction: this.claimRewards }]}>Claim Rewards</TransactionButton>
            </FormGroup>
          </>
        )}

        {isRescueTokensVisible && (
          <>
            <h3>Rescue Tokens</h3>

            <FormGroup>
              It seems like you didn't reveal your vote for this challenge. You can rescue your tokens using the below
              form.
            </FormGroup>

            {/* @TODO(jon): We can remove this at some point in the near future
              since the value still get stored in React and the user will never see it.
              This is just here for debug purposes. */}
            <FormGroup>
              <label>
                Poll ID
                <InputElement type="text" name="" value={this.props.challengeID.toString()} readOnly={true} />
              </label>
            </FormGroup>

            <FormGroup>
              <TransactionButton transactions={[{ transaction: this.rescueTokens }]}>Rescue Tokens</TransactionButton>
            </FormGroup>
          </>
        )}
      </StyledFormContainer>
    );
  }

  private updateChallengeRewardsParam = (event: any): void => {
    const paramName = event.target.getAttribute("name");
    const val = event.target.value;
    const newState = {};
    newState[paramName] = val;
    this.setState(newState);
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
