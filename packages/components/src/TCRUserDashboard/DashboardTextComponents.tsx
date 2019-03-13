import * as React from "react";
import { StyledTransferTokenTitle, StyledTransferTokenTip } from "./DashboardStyledComponents";
import { WarningIcon } from "../icons";

export const SubTabAllChallengesVotedText: React.SFC = props => <>All</>;

export const SubTabRevealVoteText: React.SFC = props => <>Reveal Vote</>;

export const SubTabClaimRewardsText: React.SFC = props => <>Claim Rewards</>;

export const SubTabRescueTokensText: React.SFC = props => <>Rescue Tokens</>;

export const SubTabReclaimTokensText: React.SFC = props => <>Transfer Voting Tokens</>;

export const SubTabChallengesCompletedText: React.SFC = props => <>Completed</>;

export const SubTabChallengesStakedText: React.SFC = props => <>Staked</>;

export const MyVotingTabText: React.SFC = props => <>Tasks</>;

export const MyNewsroomsTabText: React.SFC = props => <>Newsrooms</>;

export const MyChallengesTabText: React.SFC = props => <>Challenges</>;

export const ClaimRewardsDescriptionText: React.SFC = props => <>Claim rewards from your winning votes</>;

export const RescueTokensDescriptionText: React.SFC = props => (
  <>Reclaim your voting tokens from votes that you did not reveal</>
);

export const YourPublicAddressLabelText: React.SFC = props => <>Your Public Address</>;

export const BalanceLabelText: React.SFC = props => <>Available Balance</>;

export const VotingBalanceLabelText: React.SFC = props => <>Voting Tokens</>;

export const ChallengesWonLabelText: React.SFC = props => <>Challenges Won</>;

export const RewardsClaimedLabelText: React.SFC = props => <>Rewards Claimed</>;

export const TransferTokenText: React.SFC = props => (
  <StyledTransferTokenTitle>
    <h3>Transfer Tokens</h3>
    <p>
      Transfer tokens between your Available Balance and Voting Balance. Use tokens in your Available Balance to apply,
      challenge, send or sell. Use tokens in your Voting Balance to vote in challenges. You may transfer any inactive
      voting tokens to your Available Balance.
    </p>
  </StyledTransferTokenTitle>
);

export const TransferTokenTipsText: React.SFC = props => (
  <StyledTransferTokenTip>
    <b>Tip:</b> We recommend reserving some tokens in your available balance if you plan on applying, challenging, or
    tipping newsrooms.
  </StyledTransferTokenTip>
);

export const MetaMaskPopUpText: React.SFC = props => (
  <StyledTransferTokenTip>This will pop-up MetaMask window to confirm your transactions</StyledTransferTokenTip>
);

export const TransferTokenTutorialWarnText: React.SFC = props => (
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

export const TransferTokenTakeTutorialText: React.SFC = props => (
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
