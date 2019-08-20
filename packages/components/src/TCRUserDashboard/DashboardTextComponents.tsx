import * as React from "react";
import { StyledTransferTokenTitle, StyledTransferTokenTip } from "./DashboardStyledComponents";
import { WarningIcon } from "../icons";

export const SubTabAllChallengesVotedText: React.FunctionComponent = props => <>All</>;

export const SubTabRevealVoteText: React.FunctionComponent = props => <>Reveal Vote</>;

export const SubTabClaimRewardsText: React.FunctionComponent = props => <>Claim Rewards</>;

export const SubTabRescueTokensText: React.FunctionComponent = props => <>Rescue Tokens</>;

export const SubTabReclaimTokensText: React.FunctionComponent = props => <>Transfer Voting Tokens</>;

export const SubTabChallengesCompletedText: React.FunctionComponent = props => <>Completed</>;

export const SubTabChallengesStakedText: React.FunctionComponent = props => <>Staked</>;

export const MyVotingTabText: React.FunctionComponent = props => <>Tasks</>;

export const MyNewsroomsTabText: React.FunctionComponent = props => <>Newsrooms</>;

export const MyChallengesTabText: React.FunctionComponent = props => <>Challenges</>;

export const ClaimRewardsDescriptionText: React.FunctionComponent = props => <>Claim rewards from your winning votes</>;

export const RescueTokensDescriptionText: React.FunctionComponent = props => (
  <>Reclaim your voting tokens from votes that you did not reveal</>
);

export const YourPublicAddressLabelText: React.FunctionComponent = props => <>Your Public Address</>;

export const BalanceLabelText: React.FunctionComponent = props => <>Available Balance</>;

export const VotingBalanceLabelText: React.FunctionComponent = props => <>Voting Tokens</>;

export const ChallengesWonLabelText: React.FunctionComponent = props => <>Challenges Won</>;

export const RewardsClaimedLabelText: React.FunctionComponent = props => <>Rewards Claimed</>;

export const TransferTokenText: React.FunctionComponent = props => (
  <StyledTransferTokenTitle>
    <h3>Transfer Tokens</h3>
    <p>
      Transfer tokens between your Available Balance and Voting Balance. Use tokens in your Available Balance to apply,
      challenge, send or sell. Use tokens in your Voting Balance to vote in challenges. You may transfer any inactive
      voting tokens to your Available Balance.
    </p>
  </StyledTransferTokenTitle>
);

export const TransferTokenTipsText: React.FunctionComponent = props => (
  <StyledTransferTokenTip>
    <b>Tip:</b> We recommend reserving some tokens in your available balance if you plan on applying, challenging, or
    tipping newsrooms.
  </StyledTransferTokenTip>
);

export const MetaMaskPopUpText: React.FunctionComponent = props => (
  <StyledTransferTokenTip>This will pop-up MetaMask window to confirm your transactions</StyledTransferTokenTip>
);

export const TransferTokenTutorialWarnText: React.FunctionComponent = props => (
  <>
    <h2>
      <WarningIcon width={25} height={25} /> Take the Civil Tutorial
    </h2>
    <p>
      Before you can transfer Civil tokens, you must complete a tutorial to ensure you understand how to use Civil
      tokens and how the Civil Registry works.
    </p>
  </>
);

export const TransferTokenTakeTutorialText: React.FunctionComponent = props => (
  <>
    <h3>Civil Tutorial</h3>
    <p>
      You’ll be completing a series of questions about Civil and how to use Civil tokens (CVL). This is a standard
      procedure to help inform you of best practices with purchasing and using tokens.
    </p>
    <p>
      It will take about 30 minutes or less to complete. If at any point you answer incorrectly, don’t worry. You will
      be able to answer the questions again.
    </p>
  </>
);
