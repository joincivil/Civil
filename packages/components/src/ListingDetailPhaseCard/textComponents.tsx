import * as React from "react";
import { ToolTipHdr, ToolTipItalic } from "./styledComponents";

// Text for reviewing a vote to commit
export const CommitVoteReviewButtonText: React.SFC = props => <>Review My Vote</>;

// Text for whitelisting action. Used in buttons and calls to action
export const WhitelistActionText: React.SFC = props => <>approve</>;

// Text for removing action. Used in buttons and calls to action
export const RemoveActionText: React.SFC = props => <>reject</>;

// Text for upholding granted appeal action. Used in buttons and calls to action
export const UpholdActionText: React.SFC = props => <>upheld</>;

// Text for overturning granted appeal  action. Used in buttons and calls to action
export const OverturnActionText: React.SFC = props => <>overturned</>;

// Call to action text. Used on Commit Vote form
export interface VoteCallToActionTextProps {
  newsroomName?: string;
}

export const VoteCallToActionText: React.SFC<VoteCallToActionTextProps> = props => {
  return (
    <>
      Do you{" "}
      <b>
        <WhitelistActionText />
      </b>{" "}
      or{" "}
      <b>
        <RemoveActionText />
      </b>{" "}
      <i>{props.newsroomName || "this newsroom"}</i> from being listed on the Civil Registry?
    </>
  );
};

export const AppealChallengeVoteCallToActionText: React.SFC<VoteCallToActionTextProps> = props => {
  return (
    <>
      Should the Civil Council's decision be{" "}
      <b>
        <UpholdActionText />
      </b>{" "}
      or{" "}
      <b>
        <OverturnActionText />
      </b>{" "}
      ?
    </>
  );
};

// Label for Commit Vote num tokens form
export const CommitVoteNumTokensLabelText: React.SFC = props => {
  return <>Enter amount of tokens to vote. 1 vote equals 1 token </>;
};

// Commit Vote callouts
export const CommitVoteCalloutHeaderText: React.SFC = props => {
  return <>You're Invited to Vote!</>;
};

export const CommitVoteCalloutCopyText: React.SFC = props => {
  return (
    <>
      Evaluate the Newsroom based on the Civil Constitution and vote accordingly. You will never lose tokens for
      participating in a vote.
    </>
  );
};

export const AppealChallengeCommitVoteCalloutCopyText: React.SFC = props => {
  return (
    <>
      Evaluate whether the Granted Appeal should be upheld or overturned and cast your vote accordingly. Voters will
      never lose tokens for participating in a vote.
    </>
  );
};

export const CommitVoteAlreadyVotedHeaderText: React.SFC = props => {
  return <>You have already submitted your vote. Thank you.</>;
};

// TODO(jon): Pass in and render commit vote expiry
export const CommitVoteAlreadyVotedCopyText: React.SFC = props => {
  return <>You may revise your vote until the deadline.</>;
};

export const CommitVoteCalloutButtonText: React.SFC = props => <>Submit My Vote</>;

// Reveal Vote
export const RevealVoteButtonText: React.SFC = props => <>Reveal My Vote</>;

// Phase Card Display Names
export const UnderChallengePhaseDisplayNameText: React.SFC = props => <>Under Challenge</>;

export const ReadyToCompletePhaseDisplayNameText: React.SFC = props => <>Ready to Complete</>;

export const NewApplicationDisplayNameText: React.SFC = props => <>New Application</>;

export const RejectedNewroomDisplayNameText: React.SFC = props => <>Rejected Newsroom</>;

export const WhitelistedNewroomsDisplayNameText: React.SFC = props => <>Approved Newsroom</>;

// Tooltips
export interface ToolTipTextProps {
  phaseLength?: number;
}

export const DurationToolTipText: React.SFC<ToolTipTextProps> = props => {
  const days = props.phaseLength! / 86400;
  const duration = days <= 1 ? days + " day" : days + " days";
  return <>Time duration: {duration}</>;
};

export const NewApplicationToolTipText: React.SFC<ToolTipTextProps> = props => {
  return (
    <>
      <ToolTipHdr>Under review by the community</ToolTipHdr>
      <ToolTipItalic>
        <DurationToolTipText phaseLength={props.phaseLength} />
      </ToolTipItalic>
      <p>
        CVL token holders may challenge a Newsroom if their mission, charter, or roster is perceived to misalign with
        the Civil Constitution. Newsroom will be approved if there are no challenges.
      </p>
    </>
  );
};

export const UnderChallengeToolTipText: React.SFC<ToolTipTextProps> = props => {
  return (
    <>
      <ToolTipHdr>A CVL token holder is challenging this newsroom</ToolTipHdr>
      <p>
        This Newsroom is being challenged by a CVL token holder who believes it violates one of principles outlined in
        the Civil Constitution. Read the challenger's statement in the Discussion section.
      </p>
      <p>The challenge phase consists of 3 subphases: Commit vote, Confirm vote, and Request an Appeal.</p>
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

export const CommitVoteToolTipText: React.SFC<ToolTipTextProps> = props => {
  return (
    <>
      <ToolTipHdr>Commit tokens to cast a secret vote</ToolTipHdr>
      <ToolTipItalic>
        <DurationToolTipText phaseLength={props.phaseLength} />
      </ToolTipItalic>
      <p>
        Decide how many tokens you would like to put towards this vote. Note that the more tokens you include, the more
        power your vote carries. You can never lose your vote, but you will not be able to withdraw them until the end
        of the voting process. All votes will be hidden, using a secret phrase, until the end of the voting period. You
        have to come back and confirm your vote for it to count.
      </p>
    </>
  );
};

export const ConfirmVoteToolTipText: React.SFC<ToolTipTextProps> = props => {
  return (
    <>
      <ToolTipHdr>Finalize vote using secret ph rase</ToolTipHdr>
      <ToolTipItalic>
        <DurationToolTipText phaseLength={props.phaseLength} />
      </ToolTipItalic>
      <p>
        Voters must enter the secret phrase they received during the commit vote stage of the process in order to
        confirm their vote. Votes can not be counted and rewards can not be claimed unless voters confirm their earlier
        vote.
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

export const RequestAppealToolTipText: React.SFC<ToolTipTextProps> = props => {
  return (
    <>
      <ToolTipItalic>
        <DurationToolTipText phaseLength={props.phaseLength} />
      </ToolTipItalic>
      <p>
        CVL token holders, (including newsrooms or challengers) can appeal a vote outcome if they believe it is not in
        keeping with the Civil Constitution. This system of checks and balances ensures that all voices and perspectives
        have an opportunity to be heard in the Civil community.
      </p>
    </>
  );
};

export const WaitingCouncilDecisionToolTipText: React.SFC<ToolTipTextProps> = props => {
  return (
    <>
      <ToolTipItalic>
        <DurationToolTipText phaseLength={props.phaseLength} />
      </ToolTipItalic>
      <p>
        After The Civil Council reaches a decision on the appeal, they will publish a document explaining their choice
        and citing the section of the Civil Constitution they used to reach their decision. This system of checks and
        balances ensures that all voices and views have an opportunity to be heard in the Civil community.
      </p>
    </>
  );
};

export const ChallangeCouncilToolTipText: React.SFC<ToolTipTextProps> = props => {
  return (
    <>
      <ToolTipItalic>
        <DurationToolTipText phaseLength={props.phaseLength} />
      </ToolTipItalic>
      <p>
        The challenger must submit a statement with evidence to make their case, and deposit CVL tokens equal to the
        amount of the Newsroom's deposit. The CVL token deposit for the challenge is set aside for the duration of the
        challenge process, like an escrow account.
      </p>
    </>
  );
};

// Num tokens for Commit Vote text
export const VotingTokenBalanceText: React.SFC = props => {
  return <>Voting Token Balance</>;
};

export const AvailableTokenBalanceText: React.SFC = props => {
  return <>Available Token Balance</>;
};

export const VotingTokenBalanceTooltipText: React.SFC = props => {
  return (
    <>
      Voting tokens are tokens locked in voting contracts until the challenge is completed. If a token is locked in a
      vote, it can be used for other votes, but can NOT be used for applications, challenges, appeals, or exchanged for
      currency. If you’re planning on taking other actions, we recommend reserving some CVL in your available balance.
    </>
  );
};

export const AvailableTokenBalanceTooltipText: React.SFC = props => {
  return (
    <>
      CVL tokens you can use to tip journalists, use for deposits to challenge, request appeal, and challenge appeal, or
      cash out for fiat currency. To vote, you will need to approve and transfer them to your Voting Token Balance.
      Committing CVL tokens from your Available Balance with any vote will automatically transfer those tokens into your
      Voting Token Balance. If you’re planning on taking other actions, we recommend reserving some CVL in your
      Available Balance
    </>
  );
};

export const SelectNumTokensText: React.SFC = props => {
  return <>Select amount of CVL tokens to commit to your vote.</>;
};

export const OneTokenOneVoteText: React.SFC = props => {
  return <>1 token equals 1 vote.</>;
};

export const OneTokenOneVoteTooltipText: React.SFC = props => {
  return (
    <>
      Your vote is weighted based on the amount of CVL tokens you put towards your vote. If you have 1 CVL, you have 1
      vote; 10 CVL gives you the power of 10 votes. This ensures that those who have the most tokens are incentivized to
      vote for the side that abides by the Civil Constitution. Note that you can not lose any CVL as a result of voting.
    </>
  );
};

export const CommitVoteInsufficientTokensText: React.SFC = props => {
  return <>You don't have enough CVL tokens in your available balance</>;
};

export const CommitVoteMaxTokensWarningText: React.SFC = props => {
  return (
    <>
      You are commiting all of your CVL tokens to this vote. If you’re planning on taking other actions - tipping
      journalists, challenging listings, requesting appeals, challenging granted appeals, or cashing out for fiat
      currency - we recommend reserving some CVL in your Available Balance.
    </>
  );
};
