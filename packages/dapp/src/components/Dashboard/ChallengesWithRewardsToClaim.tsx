import * as React from "react";
import { compose } from "redux";
import { BigNumber } from "@joincivil/typescript-types";

import { TwoStepEthTransaction, TxHash } from "@joincivil/core";

import {
  Tabs,
  Tab,
  StyledDashboardSubTab,
  ClaimRewardsDescriptionText,
  ModalContent,
  StyledDashboardActivityDescription,
  TransactionButtonNoModal,
  NoRewardsToClaim,
} from "@joincivil/components";

import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";

import {
  ChallengesToProcess,
  StyledBatchButtonContainer,
  getChallengesToProcess,
  getSalts,
  StyledTabsComponent,
} from "./DashboardActivity";
import ClaimRewardsItem from "./ClaimRewardsItem";

enum TransactionTypes {
  MULTI_CLAIM_REWARDS = "MULTI_CLAIM_REWARDS",
}

const transactionLabels = {
  [TransactionTypes.MULTI_CLAIM_REWARDS]: "Claim Rewards",
};

const transactionSuccessContent = {
  [TransactionTypes.MULTI_CLAIM_REWARDS]: [
    "You have successfully claimed your rewards",
    <ModalContent>Thank you for participating and helping curate high-quality, trustworthy journalism.</ModalContent>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.MULTI_CLAIM_REWARDS]: [
    "Your rewards were not claimed",
    "To claim your rewards, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.MULTI_CLAIM_REWARDS]: [
    "The was an problem with claiming your rewards",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

export interface ChallengesWithRewardsToClaimProps {
  challenges: any;
  appealChallenges: any;
  proposalChallenges: any;
  userChallengeData?: any;
  refetchUserChallengeData?(): void;
  onMobileTransactionClick?(): any;
}

interface ChallengesWithRewardsToClaimState {
  challengesToClaim: ChallengesToProcess;
}

class ChallengesWithRewardsToClaim extends React.Component<
  ChallengesWithRewardsToClaimProps & InjectedTransactionStatusModalProps,
  ChallengesWithRewardsToClaimState
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;
  public state = {
    challengesToClaim: {},
  };

  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
  }

  public componentWillUnmount(): void {
    this.resetChallengesToMultiClaim();
  }

  public render(): JSX.Element {
    const isClaimRewardsButtonDisabled = this.isEmpty(this.state.challengesToClaim);
    const transactions = this.getTransactions();
    const { resetChallengesToMultiClaim } = this;
    const { userChallengeData: allUserChallengeData, challenges, appealChallenges, proposalChallenges } = this.props;
    const hasNoChallenges = !challenges || challenges.count() === 0;
    const hasNoAppealChallenges = !appealChallenges || appealChallenges.count() === 0;
    const hasNoProposalChallenges = !proposalChallenges || proposalChallenges.count() === 0;
    const displayNoTasks = hasNoChallenges && hasNoAppealChallenges && hasNoProposalChallenges;

    return (
      <>
        {displayNoTasks && <NoRewardsToClaim />}
        {!displayNoTasks && (
          <>
            <StyledDashboardActivityDescription>
              <ClaimRewardsDescriptionText />
            </StyledDashboardActivityDescription>

            <Tabs
              TabComponent={StyledDashboardSubTab}
              TabsNavComponent={StyledTabsComponent}
              onActiveTabChange={resetChallengesToMultiClaim}
            >
              <Tab title="Listing Challenges">
                <>
                  {this.props.challenges
                    .sort((a: string, b: string) => parseInt(a, 10) - parseInt(b, 10))
                    .map((c: string) => {
                      let userChallengeData;
                      if (allUserChallengeData) {
                        userChallengeData = allUserChallengeData.get(c!);
                      }
                      return (
                        <ClaimRewardsItem
                          key={c}
                          challengeID={c!}
                          queryUserChallengeData={userChallengeData}
                          toggleSelect={this.setChallengesToMultiClaim}
                        />
                      );
                    })}

                  {this.props.appealChallenges
                    .sort((a: string, b: string) => parseInt(a, 10) - parseInt(b, 10))
                    .map((c: string) => {
                      let userChallengeData;
                      if (allUserChallengeData) {
                        userChallengeData = allUserChallengeData.get(c!);
                      }
                      return (
                        <ClaimRewardsItem
                          key={c}
                          appealChallengeID={c!}
                          queryUserChallengeData={userChallengeData}
                          toggleSelect={this.setChallengesToMultiClaim}
                        />
                      );
                    })}
                </>
              </Tab>
              <Tab title="Parameter Proposal Challenges">
                <>
                  {this.props.proposalChallenges
                    .sort((a: string, b: string) => parseInt(a, 10) - parseInt(b, 10))
                    .map((c: string) => {
                      let userChallengeData;
                      if (allUserChallengeData) {
                        userChallengeData = allUserChallengeData.get(c!);
                      }
                      return (
                        <ClaimRewardsItem
                          key={c}
                          isProposalChallenge={true}
                          challengeID={c!}
                          queryUserChallengeData={userChallengeData}
                          toggleSelect={this.setChallengesToMultiClaim}
                        />
                      );
                    })}
                </>
              </Tab>
            </Tabs>

            <StyledBatchButtonContainer>
              <TransactionButtonNoModal disabled={isClaimRewardsButtonDisabled} transactions={transactions}>
                Claim Rewards
              </TransactionButtonNoModal>
            </StyledBatchButtonContainer>
          </>
        )}
      </>
    );
  }

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.MULTI_CLAIM_REWARDS,
          });
          return this.multiClaim();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        postTransaction: () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: true,
          });

          if (this.props.refetchUserChallengeData) {
            this.props.refetchUserChallengeData();
          }
        },
        handleTransactionError: this.props.handleTransactionError,
      },
    ];
  };

  private isEmpty(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  private setChallengesToMultiClaim = (challengeID: string, isSelected: boolean, salt: BigNumber): void => {
    if (isSelected) {
      this.setState(() => ({
        challengesToClaim: { ...this.state.challengesToClaim, [challengeID]: [isSelected, salt] },
      }));
    } else {
      const newChallengesToClaim = this.state.challengesToClaim;
      delete newChallengesToClaim[challengeID];
      this.setState(() => ({
        challengesToClaim: { ...newChallengesToClaim },
      }));
    }
  };

  private resetChallengesToMultiClaim = (): void => {
    this.setState(() => ({ challengesToClaim: {} }));
  };

  private multiClaim = async (): Promise<TwoStepEthTransaction | void> => {
    const challengeIDs = getChallengesToProcess(this.state.challengesToClaim);
    const salts = getSalts(this.state.challengesToClaim);
    return this.context.multiClaimRewards(challengeIDs, salts);
  };
}

export default compose<React.ComponentClass<ChallengesWithRewardsToClaimProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ChallengesWithRewardsToClaim);
