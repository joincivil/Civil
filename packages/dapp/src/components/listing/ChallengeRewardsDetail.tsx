import * as React from "react";
import TransactionButton from "../utility/TransactionButton";
import { InputElement, StyledFormContainer, FormGroup } from "../utility/FormElements";
import { EthAddress, TwoStepEthTransaction } from "@joincivil/core";
import { voterReward, claimRewards } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";
import styled from "styled-components";

interface ToggleDisplayDiv {
  visible: boolean;
}

const StyledDiv = styled<ToggleDisplayDiv, "div">("div")`
  display: ${props => (props.visible ? "block" : "none")};
`;

export interface ChallengeRewardsDetailProps {
  challengeID: BigNumber;
  user?: EthAddress;
}

export interface ChallengeRewardsDetailState {
  salt?: string;
  rewardAmount: BigNumber | undefined;
  isCheckRewardsVisible: boolean;
  isClaimRewardsVisible: boolean;
  isNoRewardsVisible: boolean;
}

class ChallengeRewardsDetail extends React.Component<ChallengeRewardsDetailProps, ChallengeRewardsDetailState> {
  constructor(props: any) {
    super(props);

    this.state = {
      rewardAmount: new BigNumber(0),
      isCheckRewardsVisible: true,
      isClaimRewardsVisible: false,
      isNoRewardsVisible: false,
    };
  }

  public render(): JSX.Element {
    return (
      <StyledFormContainer>
        <StyledDiv visible={this.state.isCheckRewardsVisible}>
          <h3>Check For Rewards</h3>

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
            <button onClick={this.checkForRewards}>Check For Rewards</button>
          </FormGroup>
        </StyledDiv>

        <StyledDiv visible={this.state.isNoRewardsVisible}>
          Sorry, there are no rewards availble for you for this challenge. Better luck next time!
        </StyledDiv>

        <StyledDiv visible={this.state.isClaimRewardsVisible}>
          <h3>Claim Rewards</h3>

          <FormGroup>Congrats! You have a reward avaible of: {this.state.rewardAmount!.toString()}</FormGroup>

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
        </StyledDiv>
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

  private checkForRewards = async (): Promise<void> => {
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    const rewardAmount = await voterReward(this.props.challengeID, salt, this.props.user as string);
    if (!rewardAmount.isZero()) {
      this.setState({
        rewardAmount,
        isCheckRewardsVisible: false,
        isClaimRewardsVisible: true,
      });
    } else {
      this.setState({
        isCheckRewardsVisible: false,
        isNoRewardsVisible: true,
      });
    }
  };

  private claimRewards = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    return claimRewards(this.props.challengeID, salt);
  };
}

export default ChallengeRewardsDetail;
