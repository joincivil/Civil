import * as React from "react";
import { WhitelistActionText, RemoveActionText } from "../ListingDetailPhaseCard/textComponents";

// Review Vote modal
export const ReviewVoteHeaderTitleText: React.SFC = props => {
  return <>Review Voting Information</>;
};

export const ReviewVoteHeaderCopyText: React.SFC = props => {
  return <>Save this information to reveal and confirm your votes in the “Confirm Vote” phase.</>;
};

export const ReviewVoteCopyText: React.SFC = props => {
  return (
    <>
      Your votes are concealed with a given secret phrase until the end of the commit voting period. This is to prevent
      decision bias, and to minimize the risk of “groupthink” affecting voter rationale when assessing the merits of the
      challenge. You will need the secret phrase to reveal your votes in the “Confirm Vote” phase, so keep it safe.
    </>
  );
};

export const ReviewVoteDepositedCVLLabelText: React.SFC = props => {
  return <>My Deposited CVL</>;
};

export const ReviewVoteMyAddressLabelText: React.SFC = props => {
  return <>My Public Address</>;
};

export const SaltLabelText: React.SFC = props => {
  return <>My Secret Phrase</>;
};

export interface ReviewVoteDecisionTextProps {
  newsroomName: string;
  voteOption?: string;
}

export const ReviewVoteDecisionText: React.SFC<ReviewVoteDecisionTextProps> = props => {
  if (!props.voteOption) {
    return <></>;
  }
  const voteText = props.voteOption === "0" ? <RemoveActionText /> : <WhitelistActionText />;
  return (
    <>
      I voted for {props.newsroomName} to be <b>{voteText}</b> {props.voteOption === "0" ? "from" : "in"} the Civil
      Registry
    </>
  );
};

export const ConfirmVotesHeaderText: React.SFC = props => {
  return <>Confirm Vote Dates</>;
};

export const ConfirmVotesSaveSaltCopyText: React.SFC = props => {
  return <>We also recommend doing one of the following to save your information:</>;
};

export const WriteItDownText: React.SFC = props => {
  return <>Write it down</>;
};

export const TakeAScreenShotText: React.SFC = props => {
  return <>Take a screenshot</>;
};

export const PrintThisText: React.SFC = props => {
  return <>Print this out</>;
};

export const EmailYourselfText: React.SFC = props => {
  return <>Email it to yourself</>;
};

export const TransactionButtonText: React.SFC = props => {
  return <>Confirm With Metamask</>;
};

export const SaltPhraseToolTipText: React.SFC = props => {
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
