import * as React from "react";
import { urlConstants as links } from "@joincivil/utils";

import {
  WhitelistActionText,
  RemoveActionText,
  OverturnActionText,
  UpholdActionText,
} from "../ListingDetailPhaseCard/textComponents";

// Review Vote modal
export const ReviewVoteHeaderTitleText: React.FunctionComponent = props => {
  return <>Review and Save Your Voting Information</>;
};

export interface ReviewVoteCopyTextProps {
  handlePrintClick(): void;
}

export const ReviewVoteCopyText: React.FunctionComponent<ReviewVoteCopyTextProps> = props => {
  return (
    <>
      <p>
        Civil does not store your voting information; it is stored in a{" "}
        <a href={links.FAQ_WHAT_IS_PLCR_CONTRACT} target="_blank">
          voting smart contract
        </a>.
      </p>

      <p>
        You need to carefully <b>save your unique 4-word voting code</b> for the next voting stage. If you forget this
        voting code when you confirm your vote in the next voting stage, your vote will not be counted.
      </p>

      <p>
        We recommend writing your voting code down and emailing it to yourself, taking a screenshot of this page, or{" "}
        <span onClick={props.handlePrintClick}>print this out</span>. Or, <b>add a reminder to your calendar</b> so you
        don’t forget to confirm your vote.
      </p>
    </>
  );
};

export const ReviewVoteDepositedCVLLabelText: React.FunctionComponent = props => {
  return <>Amount of Voting Tokens Submitted</>;
};

export const ReviewVoteMyAddressLabelText: React.FunctionComponent = props => {
  return <>My Public Address</>;
};

export interface SaltLabelTextProps {
  challengeID: string;
}

export const SaltLabelText: React.FunctionComponent<SaltLabelTextProps> = props => {
  return <>Unique 4-word Voting Code for Challenge #{props.challengeID}</>;
};

export interface ReviewVoteDecisionTextProps {
  newsroomName?: string;
  voteOption?: string;
}

export const ReviewVoteDecisionText: React.FunctionComponent<ReviewVoteDecisionTextProps> = props => {
  if (!props.voteOption) {
    return <></>;
  }
  const voteText = props.voteOption === "0" ? <RemoveActionText /> : <WhitelistActionText />;
  return (
    <>
      I voted to <b>{voteText}</b> {props.newsroomName || "this newsroom"} {props.voteOption === "0" ? "from" : "in"}{" "}
      the Civil Registry
    </>
  );
};

export const AppealChallengeReviewVoteDecisionText: React.FunctionComponent<ReviewVoteDecisionTextProps> = props => {
  if (!props.voteOption) {
    return <></>;
  }
  const voteText = props.voteOption === "1" ? <OverturnActionText /> : <UpholdActionText />;
  return (
    <>
      I voted for the Granted Appeal for {props.newsroomName || "this newsroom"} to be <b>{voteText}</b>
    </>
  );
};

export const ConfirmVotesLabelText: React.FunctionComponent = props => {
  return <>Confirm Vote Dates</>;
};

export const TransactionButtonText: React.FunctionComponent = props => {
  return <>Open MetaMask to Approve</>;
};

export const SaltPhraseToolTipText: React.FunctionComponent = props => {
  return (
    <>
      <p>
        Your vote will be hidden, using this secret phrase. You will need to enter this secret phrase when you confirm
        your vote during the reveal phase of this challenge.
      </p>
      <p>
        Be sure to record your secret phrase for safekeeping. If you lose your secret phrase, your vote is lost.
        Unfortunately, we can not recover it for you.
      </p>
    </>
  );
};

export const TransactionFinePrintText: React.FunctionComponent = props => {
  return (
    <>
      This will open a new window asking to confirm and process your transaction. A small transaction fee will be added
      for all votes. This fee does not go to the Civil Media Company.{" "}
      <a href={links.FAQ_GAS} target="_blank">
        Learn more
      </a>.
    </>
  );
};

export const SaveSaltCheckboxLabelText: React.FunctionComponent = props => {
  return (
    <>
      I have saved my voting information by one of the following ways: <b>Added to My Calendar</b>, wrote down the
      voting code, took a screenshot or printed this page.{" "}
    </>
  );
};
