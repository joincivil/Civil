import * as React from "react";

// Text for reviewing a vote to commit
export const CommitVoteReviewButtonText: React.SFC = props => {
  return <>Review My Vote</>;
};

// Text for whitelisting action. Used in buttons and calls to action
export const WhitelistActionText: React.SFC = props => {
  return <>accepted</>;
};

// Text for removing action. Used in buttons and calls to action
export const RemoveActionText: React.SFC = props => {
  return <>removed</>;
};

// Call to action text. Used on Commit Vote form
export interface VoteCallToActionTextProps {
  newsroomName?: string;
}

export const VoteCallToActionText: React.SFC<VoteCallToActionTextProps> = props => {
  return (
    <>
      Should {props.newsroomName || "this newsroom"} be{" "}
      <b>
        <WhitelistActionText />
      </b>{" "}
      or{" "}
      <b>
        <RemoveActionText />
      </b>{" "}
      from the Civil Registry?
    </>
  );
};

// Label for Commit Vote num tokens form
export const CommitVoteNumTokensLabelText: React.SFC = props => {
  return <>Enter amount of tokens to vote. 1 vote equals 1 token </>;
};

// Commit Vote callouts
export const CommitVoteCalloutHeaderText: React.SFC = props => {
  return <>Submit Your Votes!</>;
};

export const CommitVoteCalloutCopyText: React.SFC = props => {
  return <>Submit your vote with your CVL tokens, and help curate credible, trustworthy journalism on Civil.</>;
};

export const CommitVoteAlreadyVotedHeaderText: React.SFC = props => {
  return <>Thanks for participating in this challenge!</>;
};

export const CommitVoteAlreadyVotedCopyText: React.SFC = props => {
  return (
    <>You have committed a vote in this challenge. Thanks for that. You can change your vote until the deadline.</>
  );
};

export const CommitVoteCalloutButtonText: React.SFC = props => {
  return <>Submit My Vote</>;
};

// Reveal Vote
export const RevealVoteButtonText: React.SFC = props => {
  return <>Reveal My Vote</>;
};

// Phase Card Display Names
export const UnderChallengePhaseDisplayNameText: React.SFC = props => {
  return <>Under Challenge</>;
};
