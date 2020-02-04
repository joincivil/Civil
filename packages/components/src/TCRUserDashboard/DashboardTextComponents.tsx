import * as React from "react";
import { StyledTransferTokenTitle, StyledTransferTokenTip } from "./DashboardStyledComponents";

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

export const NoTasks: React.FunctionComponent = props => (
  <StyledTransferTokenTitle>
    <h3>No Tasks</h3>
    <p>
      You don't have any tasks right now. Tasks represent actions you need to take (or have taken) related to Civil's
      governance. Action items will appear here if you participate in a Newsroom Challenge.
    </p>
  </StyledTransferTokenTitle>
);

export const NoVotesToReveal: React.FunctionComponent = props => (
  <StyledTransferTokenTitle>
    <h3>No Votes to Reveal</h3>
    <p>You don't have any votes to reveal right now.</p>
  </StyledTransferTokenTitle>
);

export const NoRewardsToClaim: React.FunctionComponent = props => (
  <StyledTransferTokenTitle>
    <h3>No Rewards to Claim</h3>
    <p>You don't have any rewards to claim right now.</p>
  </StyledTransferTokenTitle>
);

export const NoTokensToRescue: React.FunctionComponent = props => (
  <StyledTransferTokenTitle>
    <h3>No Tokens to Rescue</h3>
    <p>You don't have any tokens to rescue right now.</p>
  </StyledTransferTokenTitle>
);

export const NoChallenges: React.FunctionComponent = props => (
  <StyledTransferTokenTitle>
    <h3>No Challenges</h3>
    <p>You haven't participated in any challenges yet.</p>
  </StyledTransferTokenTitle>
);

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
