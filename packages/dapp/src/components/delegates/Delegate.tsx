import * as React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import { EthAddress } from "@joincivil/core";

import { State } from "../../redux/reducers";
import { StyledPageContent } from "../utility/styledComponents";
import { List } from "immutable";
import { getCivil } from "../../helpers/civilInstance";
import { Button, TextInput, buttonSizes } from "@joincivil/components";
import BigNumber from "@joincivil/ethapi/node_modules/bignumber.js";
import { getVoteSaltHash } from "@joincivil/utils";

export interface DelegateListItemProps {
  delegateAddress: EthAddress;
}

export interface DelegateListItemReduxProps {
  userAcct: EthAddress;
}

export interface DelegateListItemState {
  currentUser?: EthAddress;
  charterUri: string;
  totalDeposits: BigNumber;
  currentUserDeposit: BigNumber;
  currentUserExitingDeposit: BigNumber;
  currentUserExitingReleaseTime: BigNumber;
  pollID: BigNumber;
  choice: BigNumber;
}

class DelegateListItem extends React.Component<
  DelegateListItemProps & DelegateListItemReduxProps,
  DelegateListItemState
> {
  constructor(props: DelegateListItemProps & DelegateListItemReduxProps) {
    super(props);
    this.state = {
      currentUser: "",
      charterUri: "",
      totalDeposits: new BigNumber(0),
      currentUserDeposit: new BigNumber(0),
      currentUserExitingDeposit: new BigNumber(0),
      currentUserExitingReleaseTime: new BigNumber(0),
      pollID: new BigNumber(0),
      choice: new BigNumber(0),
    };
  }
  public async componentDidMount(): Promise<void> {
    return this.refreshState();
  }

  public async refreshState(): Promise<void> {
    const civil = getCivil();
    const currentUser = await civil.currentAccount();
    const delegate = civil.delegateAtUntrusted(this.props.delegateAddress);
    const charterUri = await delegate.charterUri();
    console.log("charterUri: ", charterUri);
    const totalDeposits = await delegate.totalDeposits();
    console.log("totalDeposits: ", totalDeposits);
    console.log("current user: ", currentUser);
    let currentUserDeposit = new BigNumber(0);
    let currentUserExitingReleaseTime = new BigNumber(0);
    let currentUserExitingDeposit = new BigNumber(0);
    if (currentUser) {
      currentUserDeposit = await delegate.userDeposit(currentUser);
      const currentUserExiting = await delegate.userExitingDeposit(currentUser);
      currentUserExitingReleaseTime = currentUserExiting.releaseTime;
      currentUserExitingDeposit = currentUserExiting.numTokens;
    }

    this.setState({
      currentUser,
      charterUri,
      totalDeposits,
      currentUserDeposit,
      currentUserExitingDeposit,
      currentUserExitingReleaseTime,
    });
  }
  public render(): JSX.Element {
    return (
      <div>
        <h3>Charter: {this.state.charterUri}</h3>
        <h4>Total Deposits: {this.state.totalDeposits.toString()}</h4>
        <h5>Current User Deposit: {this.state.currentUserDeposit.toString()}</h5>
        <h5>Current User Exiting Deposit: {this.state.currentUserExitingDeposit.toString()}</h5>
        <h5>Current User Exiting Release Time: {this.state.currentUserExitingReleaseTime.toString()}</h5>
        <Button size={buttonSizes.SMALL} onClick={this.onDeposit1000Click}>
          Deposit 1 CVL
        </Button>
        <Button size={buttonSizes.SMALL} onClick={this.onBeginWithdraw1000Click}>
          Begin Withdrawing 1 CVL
        </Button>
        <Button size={buttonSizes.SMALL} onClick={this.onFinishWithdraw1000Click}>
          Finish Withdrawing 1 CVL
        </Button>
        <br />
        PollID
        <TextInput name="pollID" onChange={this.onPollIDChanged} />
        Choice
        <TextInput name="choice" onChange={this.onChoiceChanged} />
        <br />
        <Button size={buttonSizes.SMALL} onClick={this.onCommitVoteClick}>
          Commit Vote
        </Button>
        <Button size={buttonSizes.SMALL} onClick={this.onRevealVoteClick}>
          Reveal Vote
        </Button>
      </div>
    );
  }

  public onPollIDChanged = async (name: any, value: any): Promise<void> => {
    console.log("lets go click!");
    this.setState({ pollID: new BigNumber(value) });
  };

  public onChoiceChanged = async (name: any, value: any): Promise<void> => {
    console.log("lets go click!");
    this.setState({ choice: new BigNumber(value) });
  };

  public onDeposit1000Click = async (ev: any): Promise<void> => {
    const civil = getCivil();
    const delegate = civil.delegateAtUntrusted(this.props.delegateAddress);
    const tcr = await civil.tcrSingletonTrusted();
    const token = await tcr.getToken();
    const approveTx = await token.approveSpender(this.props.delegateAddress, new BigNumber(1));
    await approveTx.awaitReceipt();
    const depositTx = await delegate.deposit(new BigNumber(1));
    await depositTx.awaitReceipt();
    this.refreshState();
  };

  public onBeginWithdraw1000Click = async (ev: any): Promise<void> => {
    const civil = getCivil();
    const delegate = civil.delegateAtUntrusted(this.props.delegateAddress);

    const withdrawTx = await delegate.beginWithdrawal(new BigNumber(1));
    await withdrawTx.awaitReceipt();
    this.refreshState();
  };

  public onFinishWithdraw1000Click = async (ev: any): Promise<void> => {
    const civil = getCivil();
    const delegate = civil.delegateAtUntrusted(this.props.delegateAddress);

    const withdrawTx = await delegate.finishWithdrawal();
    await withdrawTx.awaitReceipt();
    this.refreshState();
  };

  public onCommitVoteClick = async (ev: any): Promise<void> => {
    const civil = getCivil();
    const delegate = civil.delegateAtUntrusted(this.props.delegateAddress);
    const tcr = await civil.tcrSingletonTrusted();
    const voting = tcr.getVoting();

    const poll = await voting.getPoll(new BigNumber(86));
    console.log("poll: ", poll);

    const secretHash = getVoteSaltHash(this.state.choice.toString(), "1234");
    const prevPollID = await voting.getPrevPollID(this.state.totalDeposits, new BigNumber(this.state.pollID));

    console.log("pollID: ", this.state.pollID);
    console.log("secretHash: ", secretHash);
    console.log("this.state.totalDeposits: ", this.state.totalDeposits);
    console.log("prevPollID: ", prevPollID);
    const commitTx = await delegate.commitVote(this.state.pollID, secretHash, this.state.totalDeposits, prevPollID);
    await commitTx.awaitReceipt();
    this.refreshState();
  };

  public onRevealVoteClick = async (ev: any): Promise<void> => {
    const civil = getCivil();
    const delegate = civil.delegateAtUntrusted(this.props.delegateAddress);
    const tcr = await civil.tcrSingletonTrusted();

    const commitTx = await delegate.revealVote(this.state.pollID, this.state.choice, new BigNumber("1234"));
    await commitTx.awaitReceipt();
    this.refreshState();
  };
}

const mapStateToProps = (
  state: State,
  ownProps: DelegateListItemProps,
): DelegateListItemProps & DelegateListItemReduxProps => {
  const { user } = state.networkDependent;
  const userAcct = user && user.account && user.account.account;
  return {
    ...ownProps,
    userAcct,
  };
};

export default connect(mapStateToProps)(DelegateListItem);
