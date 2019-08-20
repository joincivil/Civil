import * as React from "react";
import { compose } from "redux";
import { BigNumber } from "@joincivil/typescript-types";

import { TwoStepEthTransaction, TxHash } from "@joincivil/core";

import {
  Tabs,
  Tab,
  StyledDashboardSubTab,
  RescueTokensDescriptionText,
  ModalContent,
  StyledDashboardActivityDescription,
  TransactionButtonNoModal,
} from "@joincivil/components";

import { rescueTokensInMultiplePolls } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";

import {
  ChallengesToProcess,
  StyledBatchButtonContainer,
  getChallengesToProcess,
  StyledTabsComponent,
} from "./DashboardActivity";
import RescueTokensItem from "./RescueTokensItem";

enum TransactionTypes {
  MULTI_RESCUE_TOKENS = "MULTI_RESCUE_TOKENS",
}

const transactionLabels = {
  [TransactionTypes.MULTI_RESCUE_TOKENS]: "Rescue Tokens",
};

const transactionSuccessContent = {
  [TransactionTypes.MULTI_RESCUE_TOKENS]: [
    "You have successfully rescued your unrevealed tokens",
    <ModalContent>
      We're sorry you were not able to reveal your vote, and hope that you will continue to participate and help curate
      high-quality, trustworthy journalism
    </ModalContent>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.MULTI_RESCUE_TOKENS]: [
    "Your tokens were not rescued",
    "To rescue your tokens, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.MULTI_RESCUE_TOKENS]: [
    "The was an problem with rescuing your tokens",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

export interface ChallengesWithTokensToRescueProps {
  challenges: any;
  appealChallenges: any;
  proposalChallenges: any;
  userChallengeData?: any;
  refetchUserChallengeData?(): void;
  onMobileTransactionClick?(): any;
}

interface ChallengesWithTokensToRescueState {
  challengesToRescue: ChallengesToProcess;
}

class ChallengesWithTokensToRescue extends React.Component<
  ChallengesWithTokensToRescueProps & InjectedTransactionStatusModalProps,
  ChallengesWithTokensToRescueState
> {
  public state = {
    challengesToRescue: {},
  };

  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
  }

  public componentWillUnmount(): void {
    this.resetChallengesToMultiRescue();
  }

  public render(): JSX.Element {
    const isRescueTokensButtonDisabled = this.isEmpty(this.state.challengesToRescue);
    const transactions = this.getTransactions();
    const { resetChallengesToMultiRescue } = this;
    const { userChallengeData: allUserChallengeData } = this.props;

    return (
      <>
        <StyledDashboardActivityDescription>
          <RescueTokensDescriptionText />
        </StyledDashboardActivityDescription>

        <Tabs
          TabComponent={StyledDashboardSubTab}
          TabsNavComponent={StyledTabsComponent}
          onActiveTabChange={resetChallengesToMultiRescue}
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
                    <RescueTokensItem
                      key={c}
                      challengeID={c!}
                      queryUserChallengeData={userChallengeData}
                      toggleSelect={this.setChallengesToMultiRescue}
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
                    <RescueTokensItem
                      key={c}
                      appealChallengeID={c!}
                      queryUserChallengeData={userChallengeData}
                      toggleSelect={this.setChallengesToMultiRescue}
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
                    <RescueTokensItem
                      key={c}
                      isProposalChallenge={true}
                      challengeID={c!}
                      queryUserChallengeData={userChallengeData}
                      toggleSelect={this.setChallengesToMultiRescue}
                    />
                  );
                })}
            </>
          </Tab>
        </Tabs>

        <StyledBatchButtonContainer>
          <TransactionButtonNoModal disabled={isRescueTokensButtonDisabled} transactions={transactions}>
            Rescue Tokens
          </TransactionButtonNoModal>
        </StyledBatchButtonContainer>
      </>
    );
  }

  private isEmpty(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.MULTI_RESCUE_TOKENS,
          });
          return this.multiRescue();
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

  private setChallengesToMultiRescue = (challengeID: string, isSelected: boolean, salt: BigNumber): void => {
    if (isSelected) {
      this.setState(() => ({
        challengesToRescue: { ...this.state.challengesToRescue, [challengeID]: [isSelected, salt] },
      }));
    } else {
      const newChallengesToRescue = this.state.challengesToRescue;
      delete newChallengesToRescue[challengeID];
      this.setState(() => ({
        challengesToRescue: { ...newChallengesToRescue },
      }));
    }
  };

  private resetChallengesToMultiRescue = (): void => {
    this.setState(() => ({ challengesToRescue: {} }));
  };

  private multiRescue = async (): Promise<TwoStepEthTransaction | void> => {
    const challengeIDs = getChallengesToProcess(this.state.challengesToRescue);
    return rescueTokensInMultiplePolls(challengeIDs);
  };
}

export default compose<React.ComponentClass<ChallengesWithTokensToRescueProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ChallengesWithTokensToRescue);
