import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import { EthAddress, TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  InsufficientCVLForChallenge,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
  SnackBar,
  SubmitChallengeStatement as SubmitChallengeStatementComponent,
  SubmitChallengeStatementProps,
  SubmitChallengeSuccessIcon,
} from "@joincivil/components";
import { getFormattedParameterValue, Parameters } from "@joincivil/utils";

import { FAQ_BASE_URL, links, routes } from "../../constants";
import { getCivil } from "../../helpers/civilInstance";
import { approveForChallenge, publishContent, challengeListingWithUri } from "../../apis/civilTCR";
import { State } from "../../redux/reducers";
import {
  InjectedTransactionStatusModalProps,
  hasTransactionStatusModals,
  TransactionStatusModalContentMap,
} from "../utility/TransactionStatusModalsHOC";
import ScrollToTopOnMount from "../utility/ScrollToTop";

export interface SubmitChallengePageProps {
  match: any;
  history?: any;
}

interface SubmitChallengeProps {
  history?: any;
  listingAddress: EthAddress;
  listingURI: string;
  governanceGuideURI: string;
}

interface SubmitChallengeReduxProps {
  newsroomName: string;
  minDeposit: string;
  commitStageLen: string;
  revealStageLen: string;
  isInsufficientBalance: boolean;
}

interface SubmitChallengeState {
  challengeStatementSummaryValue?: string;
  challengeStatementCiteConstitutionValue?: any;
  challengeStatementDetailsValue?: any;
  challengeStatementUri?: string;
}

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

class SubmitChallengeComponent extends React.Component<
  SubmitChallengeProps & SubmitChallengeReduxProps & InjectedTransactionStatusModalProps,
  SubmitChallengeState
> {
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
            This challenge is now accepting votes. The CVL token-holding community will have the next{" "}
            {this.props.commitStageLen} to commit their secret votes, and {this.props.revealStageLen} to confirm their
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

  // Transactions
  private postChallengeStatement = async (): Promise<any> => {
    const {
      challengeStatementSummaryValue,
      challengeStatementCiteConstitutionValue,
      challengeStatementDetailsValue,
    } = this.state;
    const jsonToSave = {
      summary: challengeStatementSummaryValue,
      citeConstitution: challengeStatementCiteConstitutionValue.toString("html"),
      details: challengeStatementDetailsValue.toString("html"),
    };
    return publishContent(JSON.stringify(jsonToSave));
  };

  private challenge = async (): Promise<TwoStepEthTransaction<any>> => {
    return challengeListingWithUri(this.props.listingAddress, this.state.challengeStatementUri!);
  };
}

const mapStateToProps = (
  state: State,
  ownProps: SubmitChallengeProps,
): SubmitChallengeProps & SubmitChallengeReduxProps => {
  const { newsrooms } = state;
  const newsroom = newsrooms.get(ownProps.listingAddress);

  let newsroomName = "";
  if (newsroom) {
    newsroomName = newsroom.wrapper.data.name;
  }

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
    newsroomName,
    minDeposit,
    commitStageLen,
    revealStageLen,
    isInsufficientBalance,
    ...ownProps,
  };
};

interface InsufficientBalanceSnackBarProps {
  buyCVLURL: string;
  minDeposit: string;
}

const InsufficientBalanceSnackBar: React.SFC<InsufficientBalanceSnackBarProps> = props => {
  return (
    <SnackBar>
      <InsufficientCVLForChallenge minDeposit={props.minDeposit} buyCVLURL={props.buyCVLURL} />
    </SnackBar>
  );
};

const SubmitChallenge = compose(connect(mapStateToProps), hasTransactionStatusModals(transactionStatusModalConfig))(
  SubmitChallengeComponent,
) as React.ComponentClass<SubmitChallengeProps>;

const SubmitChallengePage: React.SFC<SubmitChallengePageProps> = props => {
  const listingAddress = props.match.params.listing;
  const listingURI = formatRoute(routes.LISTING, { listingAddress });
  const governanceGuideURI = `${FAQ_BASE_URL}${links.FAQ_REGISTRY}`;
  return (
    <SubmitChallenge
      listingAddress={listingAddress}
      listingURI={listingURI}
      governanceGuideURI={governanceGuideURI}
      history={props.history}
    />
  );
};

export default SubmitChallengePage;
