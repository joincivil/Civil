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
