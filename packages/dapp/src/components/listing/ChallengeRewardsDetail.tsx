import * as React from "react";
import TransactionButton from "../utility/TransactionButton";
import { InputElement, StyledFormContainer, FormGroup } from "../utility/FormElements";
import { EthAddress, TwoStepEthTransaction, UserChallengeData } from "@joincivil/core";
import { claimRewards, rescueTokens } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";

export interface ChallengeRewardsDetailProps {
  challengeID: BigNumber;
  user?: EthAddress;
  userChallengeData: UserChallengeData | undefined;
}

export interface ChallengeRewardsDetailState {
  salt?: string;
}

class ChallengeRewardsDetail extends React.Component<ChallengeRewardsDetailProps, ChallengeRewardsDetailState> {
  public render(): JSX.Element {
    const isNoRewardsVisible = this.props.userChallengeData && this.props.userChallengeData.didUserCollect === false;
    const isClaimRewardsVisible = this.props.userChallengeData && this.props.userChallengeData.didUserCollect;
    const isRescueTokensVisible = this.props.userChallengeData && this.props.userChallengeData.didUserRescue === false;

    return (
      <StyledFormContainer>
        {isNoRewardsVisible && (
          <FormGroup>
            Sorry, there are no rewards available for you for this challenge. Better luck next time!
          </FormGroup>
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
              <TransactionButton transactions={[{ transaction: this.rescueTokens }]}>Claim Rewards</TransactionButton>
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
