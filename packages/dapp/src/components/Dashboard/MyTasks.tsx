import * as React from "react";
import { Map, Set } from "immutable";
import { colors, DropdownArrow, buttonSizes, NewPrimaryButton } from "@joincivil/elements";
import MyTasksList from "./MyTasksList";
import styled from "styled-components";

import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  InputBase,
  InputIcon,
  NoTasks,
  NoVotesToReveal,
} from "@joincivil/components";

import ChallengesWithRewardsToClaim from "./ChallengesWithRewardsToClaim";
import ChallengesWithTokensToRescue from "./ChallengesWithTokensToRescue";
import TransferCivilTokens from "./TransferCivilTokens";

export interface MyTasksProps {
  allChallengesWithAvailableActions: Set<string>;
  allCompletedChallengesVotedOn: Set<string>;
  currentUserChallengesStarted: Set<string>;
  allChallengesWithUnrevealedVotes: Set<string>;
  userChallengesWithUnclaimedRewards?: Set<string>;
  userChallengesWithRescueTokens?: Set<string>;
  userAppealChallengesWithUnclaimedRewards?: Set<string>;
  userAppealChallengesWithRescueTokens?: Set<string>;
  proposalChallengesWithAvailableActions?: Set<string>;
  proposalChallengesWithUnrevealedVotes?: Set<string>;
  proposalChallengesWithUnclaimedRewards?: Set<string>;
  proposalChallengesWithRescueTokens?: Set<string>;
  userChallengeData?: Map<string, any>;
  challengeToAppealChallengeMap?: Map<string, string>;
  activeSubTabIndex: number;
  setActiveSubTabIndex(activeSubIndex: number): void;
  showClaimRewardsTab(): void;
  showRescueTokensTab(): void;
  showNoMobileTransactionsModal(): void;
  refetchUserChallengeData?(): void;
}

const StyledTasksFormGroup = styled.div`
  flex-grow: 3;
  margin-left: 16px;
  height: 40px;
  ${Dropdown} {
    border: 1px solid ${colors.accent.CIVIL_GRAY_3};
    border-radius: 3px;
    font-size: 15px;

    & > div:nth-child(2) > div {
      border-top: none;
      box-shadow: none;
      left: -1px;
      top: -1px;
      width: calc(100% + 2px);
      max-width: unset;

      :before,
      :after {
        display: none;
      }
    }

    ${DropdownGroup} {
      li {
        border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
        display: flex;
        justify-content: space-between;
      }
    }

    ${DropdownItem} {
      padding: 0;

      button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        padding: 17px 50px 17px 15px;
        width: 100%;
      }
    }
  }

  ${InputBase} {
    margin-bottom: 3px;
    position: relative;

    > input,
    > textarea {
      border: 1px solid ${colors.accent.CIVIL_GRAY_3};
      border-radius: 3px;
      padding: 15px;
    }

    > input:focus,
    > textarea:focus {
      border: 1px solid ${colors.accent.CIVIL_BLUE};
    }
  }

  label {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 14px;
  }

  ${InputIcon} {
    background-color: ${colors.basic.WHITE};
    left: calc(100% - 50px);
    position: absolute;
    top: 22px;
    z-index: 2;
  }
`;

const StyledTasksDropdown = styled.div`
  height: 40px;
  position: relative;
  padding-left: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledDropdownArrow = styled.div`
  align-items: center;
  border-left: 1px solid ${colors.accent.CIVIL_GRAY_3}
  display: flex;
  justify-content: center;
  padding-right: 12px;
  position: absolute;
  right: 0;
`;

const SelectionContainer = styled.div`
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TokenTransferButton = styled(NewPrimaryButton)`
  margin-right: 16px;
  margin-left: 12px;
  height: 40px;
`;

const Spacer = styled.div`
  flex-grow: 3;
  margin-left: 16px;
  height: 40px;
`;

interface TasksDropdownSelectedProps {
  label: string | JSX.Element;
}

const TasksDropdownSelected: React.FunctionComponent<TasksDropdownSelectedProps> = props => {
  return (
    <StyledTasksDropdown>
      {props.label}
      <StyledDropdownArrow>
        <DropdownArrow />
      </StyledDropdownArrow>
    </StyledTasksDropdown>
  );
};

const MyTasks: React.FunctionComponent<MyTasksProps> = props => {
  const {
    allChallengesWithAvailableActions,
    allChallengesWithUnrevealedVotes,
    userChallengesWithUnclaimedRewards,
    userChallengesWithRescueTokens,
    userAppealChallengesWithRescueTokens,
    userAppealChallengesWithUnclaimedRewards,
    proposalChallengesWithAvailableActions,
    proposalChallengesWithUnrevealedVotes,
    proposalChallengesWithUnclaimedRewards,
    proposalChallengesWithRescueTokens,
    activeSubTabIndex,
    setActiveSubTabIndex,
    showClaimRewardsTab,
    showRescueTokensTab,
    showNoMobileTransactionsModal,
    userChallengeData,
    challengeToAppealChallengeMap,
    refetchUserChallengeData,
  } = props;

  const allVotesCount1 = allChallengesWithAvailableActions ? allChallengesWithAvailableActions.count() : 0;
  const allVotesCount2 = proposalChallengesWithAvailableActions ? proposalChallengesWithAvailableActions.count() : 0;

  const revealVotesCount1 = allChallengesWithUnrevealedVotes ? allChallengesWithUnrevealedVotes.count() : 0;
  const revealVotesCount2 = proposalChallengesWithUnrevealedVotes ? proposalChallengesWithUnrevealedVotes.count() : 0;

  const claimRewardsCount1 = userChallengesWithUnclaimedRewards ? userChallengesWithUnclaimedRewards.count() : 0;
  const claimRewardsCount2 = userAppealChallengesWithUnclaimedRewards
    ? userAppealChallengesWithUnclaimedRewards.count()
    : 0;
  const claimRewardsCount3 = proposalChallengesWithUnclaimedRewards
    ? proposalChallengesWithUnclaimedRewards.count()
    : 0;

  const rescueTokensCount1 = userChallengesWithRescueTokens ? userChallengesWithRescueTokens.count() : 0;
  const rescueTokensCount2 = userAppealChallengesWithRescueTokens ? userAppealChallengesWithRescueTokens.count() : 0;
  const rescueTokensCount3 = proposalChallengesWithRescueTokens ? proposalChallengesWithRescueTokens.count() : 0;

  const allVotesTabTitle =
    "All (" + (allVotesCount1 + allVotesCount2) + ")";
  const revealVoteTabTitle =
    "Reveal Votes (" +
    (revealVotesCount1 + revealVotesCount2) +
    ")";
  const claimRewardsTabTitle =
    "Claim Rewards (" +
    (claimRewardsCount1 + claimRewardsCount2 + claimRewardsCount3) +
    ")";
  const rescueTokensTabTitle =
    "Reclaim Tokens (" +
    (rescueTokensCount1 + rescueTokensCount2 + rescueTokensCount3) +
    ")";

  const titles = [allVotesTabTitle, revealVoteTabTitle, claimRewardsTabTitle, rescueTokensTabTitle];

  const ActiveDisplay = () => {
    switch (props.activeSubTabIndex) {
      case 0:
        return (
          <MyTasksList
            challenges={allChallengesWithAvailableActions}
            proposalChallenges={proposalChallengesWithAvailableActions}
            userChallengeData={userChallengeData}
            challengeToAppealChallengeMap={challengeToAppealChallengeMap}
            refetchUserChallengeData={refetchUserChallengeData}
            showClaimRewardsTab={showClaimRewardsTab}
            showRescueTokensTab={showRescueTokensTab}
            noTasksComponent={<NoTasks />}
          />
        );
      case 1:
        return (
          <MyTasksList
            challenges={allChallengesWithUnrevealedVotes}
            proposalChallenges={proposalChallengesWithUnrevealedVotes}
            userChallengeData={userChallengeData}
            challengeToAppealChallengeMap={challengeToAppealChallengeMap}
            refetchUserChallengeData={refetchUserChallengeData}
            showClaimRewardsTab={showClaimRewardsTab}
            showRescueTokensTab={showRescueTokensTab}
            noTasksComponent={<NoVotesToReveal />}
          />
        );
      case 2:
        return (
          <ChallengesWithRewardsToClaim
            challenges={userChallengesWithUnclaimedRewards}
            appealChallenges={userAppealChallengesWithUnclaimedRewards}
            proposalChallenges={proposalChallengesWithUnclaimedRewards}
            userChallengeData={userChallengeData}
            refetchUserChallengeData={refetchUserChallengeData}
            onMobileTransactionClick={showNoMobileTransactionsModal}
          />
        );
      case 3:
        return (
          <ChallengesWithTokensToRescue
            challenges={userChallengesWithRescueTokens}
            appealChallenges={userAppealChallengesWithRescueTokens}
            proposalChallenges={proposalChallengesWithRescueTokens}
            userChallengeData={userChallengeData}
            refetchUserChallengeData={refetchUserChallengeData}
            onMobileTransactionClick={showNoMobileTransactionsModal}
          />
        );
      case 4:
        return <TransferCivilTokens showNoMobileTransactionsModal={showNoMobileTransactionsModal} />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <SelectionContainer>
        {activeSubTabIndex !== 4 && (
          <StyledTasksFormGroup>
            <Dropdown position="left" target={<TasksDropdownSelected label={titles[activeSubTabIndex]} />}>
              <DropdownGroup>
                <DropdownItem>
                  <button onClick={() => setActiveSubTabIndex(0)}>{titles[0]}</button>
                </DropdownItem>
                <DropdownItem>
                  <button onClick={() => setActiveSubTabIndex(1)}>{titles[1]}</button>
                </DropdownItem>
                <DropdownItem>
                  <button onClick={() => setActiveSubTabIndex(2)}>{titles[2]}</button>
                </DropdownItem>
                <DropdownItem>
                  <button onClick={() => setActiveSubTabIndex(3)}>{titles[3]}</button>
                </DropdownItem>
              </DropdownGroup>
            </Dropdown>
          </StyledTasksFormGroup>
        )}
        {activeSubTabIndex === 4 && <Spacer />}
        <TokenTransferButton
          size={buttonSizes.NEW_MEDIUM}
          onClick={() => {
            if (activeSubTabIndex === 4) {
              setActiveSubTabIndex(0);
            } else {
              setActiveSubTabIndex(4);
            }
          }}
        >
          {activeSubTabIndex === 4 && "Back to All tasks"}
          {activeSubTabIndex !== 4 && "Transfer Tokens"}
        </TokenTransferButton>
      </SelectionContainer>
      <ActiveDisplay />
    </>
  );
};

export default MyTasks;
