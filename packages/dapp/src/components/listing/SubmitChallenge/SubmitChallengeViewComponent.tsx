import * as React from "react";
import { compose } from "redux";
import { connect, DispatchProp } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import styled from "styled-components";

import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  colors,
  Modal,
  ModalHeading,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
  SubmitChallengeStatement as SubmitChallengeStatementComponent,
  SubmitChallengeStatementProps,
  SubmitChallengeSuccessIcon,
  Button,
  InvertedButton,
  buttonSizes,
} from "@joincivil/components";
import { getFormattedParameterValue, Parameters, urlConstants as links } from "@joincivil/utils";

import { State } from "../../../redux/reducers";
import { getCivil } from "../../../helpers/civilInstance";
import { routes } from "../../../constants";
import ScrollToTopOnMount from "../../utility/ScrollToTop";
import { approveForChallenge, publishContent, challengeListingWithUri } from "../../../apis/civilTCR";
import {
  InjectedTransactionStatusModalProps,
  hasTransactionStatusModals,
  TransactionStatusModalContentMap,
} from "../../utility/TransactionStatusModalsHOC";
import {
  SubmitChallengeProps,
  SubmitChallengeReduxProps,
  SubmitChallengeReduxParametersProps,
} from "./SubmitChallengeTypes";
import InsufficientBalanceSnackBar from "./InsufficientBalanceSnackBar";

const StyledConfirmModalContent = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 16px;
  line-height: 26px;
  margin: 0 0 10px;
`;

const StyledConfirmModalButtons = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0 0;

  ${InvertedButton}, ${Button} {
    border-width: 1px;
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 0.2px;
    line-height: 14px;
    margin: 0 15px;
    padding: 14px 0 15px;
    text-align: center;
    text-transform: none;
    width: 203px;
  }
`;

enum TransactionTypes {
  APPROVE_FOR_CHALLENGE = "APPROVE_FOR_CHALLENGE",
  CHALLENGE_LISTING = "CHALLENGE_LISTING",
  PUBLISH_CONTENT = "PUBLISH_CONTENT",
}

const transactionLabels = {
  [TransactionTypes.APPROVE_FOR_CHALLENGE]: "Approve for Challenge",
  [TransactionTypes.PUBLISH_CONTENT]: "Publish Statement",
  [TransactionTypes.CHALLENGE_LISTING]: "Challenge Listing",
};

const multiStepTransactionLabels = {
  [TransactionTypes.APPROVE_FOR_CHALLENGE]: "1 of 3",
  [TransactionTypes.PUBLISH_CONTENT]: "2 of 3",
  [TransactionTypes.CHALLENGE_LISTING]: "3 of 3",
};

const transactionRejectionContent = {
  [TransactionTypes.APPROVE_FOR_CHALLENGE]: [
    "Your challenge was not submitted",
    "Before submitting a challenge, you need to confirm the approval of your challenge deposit in your MetaMask wallet.",
  ],
  [TransactionTypes.CHALLENGE_LISTING]: [
    "Your challenge was not submitted",
    "To submit a challenge, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.APPROVE_FOR_CHALLENGE]: [
    "There was an problem with submitting your challenge",
    <>
      <ModalContent>Please check the following and retry your transaction</ModalContent>
      <ModalUnorderedList>
        <ModalListItem>You have sufficient CVL in your account for the challenge fee</ModalListItem>
      </ModalUnorderedList>
    </>,
  ],
  [TransactionTypes.CHALLENGE_LISTING]: [
    "The was an problem with submitting your challenge",
    <>
      <ModalContent>Please check the following and retry your transaction</ModalContent>
      <ModalUnorderedList>
        <ModalListItem>
          Your Challenge Statement has a Summary, Cites the Civil Constitution, and Details on your challenge
        </ModalListItem>
      </ModalUnorderedList>
    </>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  multiStepTransactionLabels,
  transactionRejectionContent,
  transactionErrorContent,
};

interface SubmitChallengeState {
  challengeStatementSummaryValue?: string;
  challengeStatementCiteConstitutionValue?: any;
  challengeStatementDetailsValue?: any;
  challengeStatementUri?: string;
  isConfirmModalVisible: boolean;
}

class SubmitChallengeComponent extends React.Component<
  SubmitChallengeProps &
    SubmitChallengeReduxProps &
    SubmitChallengeReduxParametersProps &
    InjectedTransactionStatusModalProps &
    DispatchProp<any>,
  SubmitChallengeState
> {
  public state = {
    challengeStatementSummaryValue: undefined,
    challengeStatementCiteConstitutionValue: undefined,
    challengeStatementDetailsValue: undefined,
    challengeStatementUri: undefined,
    isConfirmModalVisible: true,
  };

  public componentWillMount(): void {
    const transactionSuccessContent = this.getTransactionSuccessContent();
    this.props.setTransactions(this.getTransactions());
    this.props.setTransactionStatusModalConfig({
      transactionSuccessContent,
    });
    this.props.setHandleTransactionSuccessButtonClick(this.redirectToListingPage);
  }

  public render(): JSX.Element {
    const {
      listingURI,
      newsroomName,
      governanceGuideURI,
      minDeposit,
      commitStageLen,
      revealStageLen,
      isInsufficientBalance,
    } = this.props;

    const props: SubmitChallengeStatementProps = {
      listingURI,
      newsroomName,
      constitutionURI: links.CONSTITUTION,
      governanceGuideURI,
      minDeposit,
      commitStageLen,
      revealStageLen,
      updateStatementValue: this.updateStatement,
      transactions: this.getTransactions(),
      postExecuteTransactions: this.onSubmitChallengeSuccess,
    };

    return (
      <>
        <ScrollToTopOnMount />
        {isInsufficientBalance &&
          minDeposit && <InsufficientBalanceSnackBar minDeposit={minDeposit!} buyCVLURL="/tokens" />}
        <SubmitChallengeStatementComponent {...props} />
        {this.state.isConfirmModalVisible && this.renderConfirmationModal()}
      </>
    );
  }

  private renderConfirmationModal = (): JSX.Element => {
    return (
      <Modal width={558}>
        <ModalHeading>Something to keep in mind</ModalHeading>
        <StyledConfirmModalContent>Once a challenge is issued, it cannot be withdrawn.</StyledConfirmModalContent>
        <StyledConfirmModalContent>
          Before challenging a Newsroom, consider addressing your converns with the Newsroom directly in the Discussion
          section.
        </StyledConfirmModalContent>

        <StyledConfirmModalButtons>
          <InvertedButton size={buttonSizes.MEDIUM} onClick={this.closeConfirmationModalAndCancel}>
            Cancel
          </InvertedButton>
          <Button size={buttonSizes.MEDIUM} onClick={this.closeConfirmationModal}>
            I understand
          </Button>
        </StyledConfirmModalButtons>
      </Modal>
    );
  };

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            isTransactionErrorModalOpen: false,
            isTransactionRejectionModalOpen: false,
            transactionType: TransactionTypes.APPROVE_FOR_CHALLENGE,
          });
          return approveForChallenge();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        handleTransactionError: this.props.handleTransactionError,
      },
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isIPFSUploadModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.PUBLISH_CONTENT,
          });
          return this.postChallengeStatement();
        },
        postTransaction: async (receipt: any) => {
          this.setState({ challengeStatementUri: receipt.uri });
        },
      },
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            isIPFSUploadModalOpen: false,
            transactionType: TransactionTypes.CHALLENGE_LISTING,
          });
          return this.challenge();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
          });
        },
        handleTransactionError: this.props.handleTransactionError,
      },
    ];
  };

  private getTransactionSuccessContent = (): TransactionStatusModalContentMap => {
    return {
      [TransactionTypes.APPROVE_FOR_CHALLENGE]: [undefined, undefined],
      [TransactionTypes.CHALLENGE_LISTING]: [
        <>
          <SubmitChallengeSuccessIcon />
          <div>This Newsroom is now under challenge</div>
        </>,
        <>
          <ModalContent>
            vote. To prevent decision bias, all votes will be hidden using a secret phrase, until the end of the voting
            period.
          </ModalContent>
          <ModalContent>
            You may vote on your own challenge using your CVL voting tokens, which is separate from your challenge
            deposit.
          </ModalContent>
          <ModalContent>It may take a few minutes for the listing to appear as challenged.</ModalContent>
        </>,
      ],
    };
  };

  private updateStatement = (key: string, value: any): void => {
    const stateKey = `challengeStatement${key.charAt(0).toUpperCase()}${key.substring(1)}Value`;
    this.setState(() => ({ [stateKey]: value }));
  };

  private onSubmitChallengeSuccess = (): void => {
    this.props.updateTransactionStatusModalsState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: true,
    });
  };

  private redirectToListingPage = (): void => {
    const listingURI = formatRoute(routes.LISTING, { listingAddress: this.props.listingAddress });
    this.props.closeAllModals();
    this.props.history.push(listingURI);
  };

  private closeConfirmationModal = (): void => {
    this.setState({ isConfirmModalVisible: false });
  };

  private closeConfirmationModalAndCancel = (): void => {
    this.setState({ isConfirmModalVisible: false }, this.redirectToListingPage);
  };

  // Transactions
  private postChallengeStatement = async (): Promise<any> => {
    const {
      challengeStatementSummaryValue,
      challengeStatementCiteConstitutionValue,
      challengeStatementDetailsValue,
    } = this.state;
    const { charterRevisionId } = this.props;

    const jsonToSave = {
      summary: challengeStatementSummaryValue,
      citeConstitution: (challengeStatementCiteConstitutionValue as any).toString("html"),
      details: (challengeStatementDetailsValue as any).toString("html"),
      charterRevisionId,
    };
    return publishContent(JSON.stringify(jsonToSave));
  };

  private challenge = async (): Promise<TwoStepEthTransaction<any>> => {
    return challengeListingWithUri(this.props.listingAddress, this.state.challengeStatementUri!);
  };
}

// TODO(jon): Move `mapStateToProps` to `SubmitChallengeReduxContainer` and remove `connect` invocation once Parameters are queryable from GraphQL
const mapStateToProps = (
  state: State,
  ownProps: SubmitChallengeProps & SubmitChallengeReduxProps,
): SubmitChallengeProps & SubmitChallengeReduxParametersProps => {
  const { parameters, user } = state.networkDependent;

  let minDeposit = "";
  let commitStageLen = "";
  let revealStageLen = "";
  const civil = getCivil();
  if (parameters && Object.keys(parameters).length) {
    minDeposit = getFormattedParameterValue(
      Parameters.minDeposit,
      civil.toBigNumber(parameters[Parameters.minDeposit]),
    );
    commitStageLen = getFormattedParameterValue(
      Parameters.commitStageLen,
      civil.toBigNumber(parameters[Parameters.commitStageLen]),
    );
    revealStageLen = getFormattedParameterValue(
      Parameters.revealStageLen,
      civil.toBigNumber(parameters[Parameters.revealStageLen]),
    );
  }
  let balance;
  let isInsufficientBalance = false;
  if (user && user.account && user.account.balance) {
    balance = civil.toBigNumber(user.account.balance);
    isInsufficientBalance = balance.lt(civil.toBigNumber(parameters[Parameters.minDeposit]));
  }

  return {
    minDeposit,
    commitStageLen,
    revealStageLen,
    isInsufficientBalance,
    ...ownProps,
  };
};

export default compose(connect(mapStateToProps), hasTransactionStatusModals(transactionStatusModalConfig))(
  SubmitChallengeComponent,
) as React.ComponentClass<SubmitChallengeProps>;
