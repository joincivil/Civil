import * as React from "react";
import { ToolTipHdr, ToolTipItalic } from "./styledComponents";

// Text for reviewing a vote to commit
export const CommitVoteReviewButtonText: React.SFC = props => <>Review My Vote</>;

// Text for whitelisting action. Used in buttons and calls to action
export const WhitelistActionText: React.SFC = props => <>accepted</>;

// Text for removing action. Used in buttons and calls to action
export const RemoveActionText: React.SFC = props => <>removed</>;

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

export const CommitVoteCalloutButtonText: React.SFC = props => <>Submit My Vote</>;

// Reveal Vote
export const RevealVoteButtonText: React.SFC = props => <>Reveal My Vote</>;

// Phase Card Display Names
export const UnderChallengePhaseDisplayNameText: React.SFC = props => <>Under Challenge</>;

export const ReadyToCompletePhaseDisplayNameText: React.SFC = props => <>Ready to Complete</>;

export const NewApplicationDisplayNameText: React.SFC = props => <>New Application</>;

export const RejectedNewroomDisplayNameText: React.SFC = props => <>Rejected Newroom</>;

export const WhitelistedNewroomsDisplayNameText: React.SFC = props => <>Approved Newroom</>;

// Tooltips
export const NewApplicationToolTipText: React.SFC = props => {
  return (
    <>
      <ToolTipHdr>Under review by the community</ToolTipHdr>
      <ToolTipItalic>Time duration: 14 days</ToolTipItalic>
      <p>
        CVL token holders may challenge a Newsroom if their mission, charter, or roster is perceived to misalign with
        the{" "}
        <a href="https://civil.co/consitution" target="_blank">
          Civil Constitution
        </a>. Newsroom will be approved if there are no challenges.
      </p>
    </>
  );
};

export const UnderChallengeToolTipText: React.SFC = props => {
  return (
    <>
      <ToolTipHdr>A CVL token holder is challenging this newsroom</ToolTipHdr>
      <ToolTipItalic>Time duration: 20 days total</ToolTipItalic>
      <p>
        This Newsroom is being challenged by a CVL token holder who believes it violates one of principles outlined in
        the{" "}
        <a href="https://civil.co/consitution" target="_blank">
          Civil Constitution
        </a>. Read the challenger's statement in the Discussion section.
      </p>
      <p>
        The challenge phase consists of 3 subphases: Commit vote (10 days), Confirm vote (7 days), and Request an Appeal
        (5 days).
      </p>
    </>
  );
};

export const WhitelistedNewroomsToolTipText: React.SFC = props => {
  return (
    <>
      <p>
        This Newsroom has been approved to be on the Civil Registry, on condition they commit to uphold the values of
        the Civil Constitution.
      </p>
      <p>
        CVL token holders are the stewards of ethical journalism on the Civil Registry. If for any reason you believe
        that a Newsroom has violated either the Civil Constitution or the Newsroom's own stated mission and charter, you
        may challenge them at any time.
      </p>
    </>
  );
};

export const RejectedNewsroomsToolTipText: React.SFC = props => {
  return (
    <>
      <p>
        This Newsroom has been rejected by the CVL token-holding community due to misalignment with the Civil
        Constitution.
      </p>
      <p>Rejected Newsrooms may reapply to the Civil Registry at any time.</p>
    </>
  );
};

export const ResolveChallengeToolTipText: React.SFC = props => {
  return (
    <>
      <ToolTipHdr>Resolve Challenge</ToolTipHdr>
      <p>
        Challenge results are in, and any CVL token holder may resolve this challenge. When this is resolved, Newsroom
        will be listed or delisted from The Civil Registry. Please note that this requires paying some Ethereum gas to
        complete.
      </p>
    </>
  );
};

export const CommitVoteToolTipText: React.SFC = props => {
  return (
    <>
      <ToolTipHdr>Commit tokens to cast a secret vote</ToolTipHdr>
      <ToolTipItalic>Time duration: 10 days</ToolTipItalic>
      <p>
        Decide how many tokens you would like to put towards this vote. Note that the more tokens you include, the more
        power your vote carries. You can never lose your vote, but you will not be able to withdraw them until the end
        of the voting process. All votes will be hidden, using a secret phrase, until the end of the voting period. You
        have to come back and confirm your vote for it to count.
      </p>
    </>
  );
};

export const ConfirmVoteToolTipText: React.SFC = props => {
  return (
    <>
      <ToolTipHdr>Finalize vote using secret phrase</ToolTipHdr>
      <ToolTipItalic>Time duration: 7 days</ToolTipItalic>
      <p>
        Voters must enter the secret phrase they received during the commit vote stage of the process in order to
        confirm their vote. Votes can not be counted and rewards can not be claimed unless voters confirm their earlier
        vote.
      </p>
    </>
  );
};

export const RevealVoteToolTipText: React.SFC = props => {
  return (
    <>
      <ToolTipHdr>Reveal Vote</ToolTipHdr>
      <ToolTipItalic>Time duration: </ToolTipItalic>
      <p>
        TKTK
      </p>
    </>
  );
};

export const RewardPoolToolTipText: React.SFC = props => {
  return (
    <>
      Amount of tokens to be distributed to voters of the winning party at the conclusion of the challenge. The amount
      comes from 50% of the challenger or Newsroom's deposit.
    </>
  );
};

export const DepositsToolTipText: React.SFC = props => {
  return (
    <>
      Amount of CVL tokens staked by the Newsroom when they apply to The Civil Registry, and by the Challenger upon
      challenging this Newsroom.
    </>
  );
};
