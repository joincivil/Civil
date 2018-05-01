import * as React from "react";
import TransactionButton from "../utility/TransactionButton";
import { InputElement, StyledFormContainer, FormGroup } from "../utility/FormElements";
import { TwoStepEthTransaction } from "@joincivil/core";
import { revealVote } from "../../apis/civilTCR";
import BigNumber from "bignumber.js";

export interface RevealVoteDetailProps {
  challengeID: BigNumber;
}

export interface RevealVoteDetailState {
  voteOption?: string;
  salt?: string;
}

class RevealVoteDetail extends React.Component<RevealVoteDetailProps, RevealVoteDetailState> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <StyledFormContainer>
        <h3>Reveal Vote</h3>

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
          <label>
            Support This Challenge (Vote Option)
            <InputElement type="radio" value="1" name="voteOption" onChange={this.updateRevealVoteParam} /> Yes
            <InputElement type="radio" value="0" name="voteOption" onChange={this.updateRevealVoteParam} /> No
          </label>
        </FormGroup>

        <FormGroup>
          <label>Salt</label>
          <InputElement type="text" name="salt" onChange={this.updateRevealVoteParam} />
        </FormGroup>

        <FormGroup>
          <TransactionButton transactions={[{ transaction: this.revealVoteOnChallenge }]}>
            Reveal Vote
          </TransactionButton>
        </FormGroup>
      </StyledFormContainer>
    );
  }

  private updateRevealVoteParam = (event: any): void => {
    const paramName = event.target.getAttribute("name");
    const val = event.target.value;
    const newState = {};
    newState[paramName] = val;
    this.setState(newState);
  };

  private revealVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    return revealVote(this.props.challengeID, voteOption, salt);
  };
}

export default RevealVoteDetail;
