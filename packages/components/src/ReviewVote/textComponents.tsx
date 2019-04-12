import * as React from "react";
import {
  WhitelistActionText,
  RemoveActionText,
  OverturnActionText,
  UpholdActionText,
} from "../ListingDetailPhaseCard/textComponents";

// Review Vote modal
export const ReviewVoteHeaderTitleText: React.FunctionComponent = props => {
  return <>Review Voting Information</>;
};

export const ReviewVoteHeaderCopyText: React.FunctionComponent = props => {
  return <>Save this information to reveal and confirm your votes in the “Confirm Vote” phase.</>;
};

export const ReviewVoteCopyText: React.FunctionComponent = props => {
  return (
    <>
      Your votes are concealed with a given secret phrase until the end of the commit voting period. This is to prevent
      decision bias, and to minimize the risk of “groupthink” affecting voter rationale when assessing the merits of the
      challenge. You will need the secret phrase to reveal your votes in the “Confirm Vote” phase, so keep it safe.
    </>
  );
};

export const ReviewVoteDepositedCVLLabelText: React.FunctionComponent = props => {
  return <>My Deposited CVL</>;
};

export const ReviewVoteMyAddressLabelText: React.FunctionComponent = props => {
  return <>My Public Address</>;
};

export const SaltLabelText: React.FunctionComponent = props => {
  return <>My Secret Phrase</>;
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

export const ConfirmVotesHeaderText: React.FunctionComponent = props => {
  return <>Confirm Vote Dates</>;
};

export const ConfirmVotesSaveSaltCopyText: React.FunctionComponent = props => {
  return <>We also recommend doing one of the following to save your information:</>;
};

export const WriteItDownText: React.FunctionComponent = props => {
  return <>Write it down</>;
};

export const TakeAScreenShotText: React.FunctionComponent = props => {
  return <>Take a screenshot</>;
};

export const PrintThisText: React.FunctionComponent = props => {
  return <>Print this out</>;
};

export const EmailYourselfText: React.FunctionComponent = props => {
  return <>Email it to yourself</>;
};

export const TransactionButtonText: React.FunctionComponent = props => {
  return <>Confirm With Metamask</>;
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
