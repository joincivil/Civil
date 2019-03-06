import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { EthAddress, TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  InsufficientCVLForAppealChallenge,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
  SnackBar,
  SubmitAppealChallengeStatement as SubmitAppealChallengeStatementComponent,
  SubmitAppealChallengeStatementProps,
  SubmitChallengeSuccessIcon,
} from "@joincivil/components";
import { getFormattedParameterValue, Parameters, GovernmentParameters } from "@joincivil/utils";
import { getCivil } from "../../helpers/civilInstance";
import { approveForChallengeGrantedAppeal, publishContent, challengeGrantedAppealWithUri } from "../../apis/civilTCR";
import { State } from "../../redux/reducers";
import {
  InjectedTransactionStatusModalProps,
  hasTransactionStatusModals,
  TransactionStatusModalContentMap,
} from "../utility/TransactionStatusModalsHOC";
import ScrollToTopOnMount from "../utility/ScrollToTop";

export interface SubmitAppealChallengePageProps {
  match: any;
  history?: any;
}

interface SubmitAppealChallengeProps {
  history?: any;
  listingAddress: EthAddress;
  listingURI: string;
  governanceGuideURI: string;
}

interface SubmitAppealChallengeReduxProps {
  newsroomName: string;
  constitutionURI: string;
  appealFee: string;
  challengeAppealCommitLen: string;
  challengeAppealRevealLen: string;
  appealVotePercentage: string;
  isInsufficientBalance: boolean;
}

interface SubmitAppealChallengeState {
  challengeStatementSummaryValue?: string;
  challengeStatementDetailsValue?: any;
  appealChallengeStatementUri?: string;
}

enum TransactionTypes {
  APPROVE_CHALLENGE_APPEAL = "APPROVE_CHALLENGE_APPEAL",
  CHALLENGE_APPEAL = "CHALLENGE_APPEAL",
  PUBLISH_CONTENT = "PUBLISH_CONTENT",
}

const transactionLabels = {
  [TransactionTypes.APPROVE_CHALLENGE_APPEAL]: "Approve Challenge Appeal",
  [TransactionTypes.PUBLISH_CONTENT]: "Publish Statement",
  [TransactionTypes.CHALLENGE_APPEAL]: "Challenge Appeal",
};

const multiStepTransactionLabels = {
  [TransactionTypes.APPROVE_CHALLENGE_APPEAL]: "1 of 3",
  [TransactionTypes.PUBLISH_CONTENT]: "2 of 3",
  [TransactionTypes.CHALLENGE_APPEAL]: "3 of 3",
};

const denialSuffix = ", you need to confirm the transaction in your MetaMask wallet.";

const transactionRejectionContent = {
  [TransactionTypes.APPROVE_CHALLENGE_APPEAL]: [
    "Your appeal challenge was not submitted",
    "Before submitting an appeal challenge, you need to confirm that you approve the appeal fee deposit",
  ],
  [TransactionTypes.CHALLENGE_APPEAL]: [
    "Your appeal challenge was not submitted",
    `To submit an appeal challenge${denialSuffix}`,
  ],
};

const transactionErrorContent = {
  [TransactionTypes.APPROVE_CHALLENGE_APPEAL]: [
    "There was a problem approving your appeal challenge",
    <>
      <ModalContent>Please check the following and retry your transaction</ModalContent>
      <ModalUnorderedList>
        <ModalListItem>You have sufficient CVL in your account for the challenge fee</ModalListItem>
      </ModalUnorderedList>
    </>,
  ],
  [TransactionTypes.CHALLENGE_APPEAL]: [
    "There was a problem submitting your appeal challenge",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  multiStepTransactionLabels,
  transactionRejectionContent,
  transactionErrorContent,
};

class SubmitAppealChallengeComponent extends React.Component<
  SubmitAppealChallengeProps & SubmitAppealChallengeReduxProps & InjectedTransactionStatusModalProps,
  SubmitAppealChallengeState
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
      constitutionURI,
      governanceGuideURI,
      appealFee,
      challengeAppealCommitLen,
      challengeAppealRevealLen,
      appealVotePercentage,
      isInsufficientBalance,
    } = this.props;

    const props: SubmitAppealChallengeStatementProps = {
      listingURI,
      newsroomName,
      constitutionURI,
      governanceGuideURI,
      appealFee,
      challengeAppealCommitLen,
      challengeAppealRevealLen,
      appealVotePercentage,
      updateStatementValue: this.updateStatement,
      transactions: this.getTransactions(),
      postExecuteTransactions: this.onSubmitAppealChallengeSuccess,
    };

    return (
      <>
        <ScrollToTopOnMount />
        {isInsufficientBalance &&
          appealFee && <InsufficientBalanceSnackBar appealFee={appealFee!} buyCVLURL="/tokens" />}
        <SubmitAppealChallengeStatementComponent {...props} />
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
            transactionType: TransactionTypes.APPROVE_CHALLENGE_APPEAL,
          });
          return approveForChallengeGrantedAppeal();
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
          return this.postAppealChallengeStatement();
        },
        postTransaction: async (receipt: any) => {
          this.setState({ appealChallengeStatementUri: receipt.uri });
        },
      },
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.CHALLENGE_APPEAL,
          });
          return this.challengeGrantedAppeal();
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
        },
        handleTransactionError: this.props.handleTransactionError,
      },
    ];
  };

  private getTransactionSuccessContent = (): TransactionStatusModalContentMap => {
    return {
      [TransactionTypes.APPROVE_CHALLENGE_APPEAL]: [undefined, undefined],
      [TransactionTypes.CHALLENGE_APPEAL]: [
        <>
          <SubmitChallengeSuccessIcon />
          <div>This granted appeal has now been challenged</div>
        </>,
        <>
          <ModalContent>
            This challenge is now accepting votes. The CVL token-holding community will have the next{" "}
            {this.props.challengeAppealCommitLen} to commit their secret votes, and{" "}
            {this.props.challengeAppealRevealLen} to confirm their vote. To prevent decision bias, all votes will be
            hidden using a secret phrase, until the end of the voting. Only a supermajority ({
              this.props.appealVotePercentage
            }) from the community can overturn the Civil Council's decision.
          </ModalContent>
          <ModalContent>
            You may vote on your own challenge using your CVL voting tokens, which is separate from your challenge
            deposit.
          </ModalContent>
        </>,
      ],
    };
  };

  private updateStatement = (key: string, value: any): void => {
    const stateKey = `challengeStatement${key.charAt(0).toUpperCase()}${key.substring(1)}Value`;
    this.setState(() => ({ [stateKey]: value }));
  };

  private onSubmitAppealChallengeSuccess = (): void => {
    this.props.updateTransactionStatusModalsState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: true,
    });
  };

  private redirectToListingPage = (): void => {
    this.props.closeAllModals();
    this.props.history.push("/listing/" + this.props.listingAddress);
  };

  // Transactions

  private postAppealChallengeStatement = async (): Promise<any> => {
    const { challengeStatementSummaryValue, challengeStatementDetailsValue } = this.state;
    const jsonToSave = {
      summary: challengeStatementSummaryValue,
      details: challengeStatementDetailsValue.toString("html"),
    };
    return publishContent(JSON.stringify(jsonToSave));
  };

  private challengeGrantedAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return challengeGrantedAppealWithUri(this.props.listingAddress, this.state.appealChallengeStatementUri!);
  };
}

const mapStateToProps = (
  state: State,
  ownProps: SubmitAppealChallengeProps,
): SubmitAppealChallengeProps & SubmitAppealChallengeReduxProps => {
  const { newsrooms } = state;
  const newsroom = newsrooms.get(ownProps.listingAddress);

  let newsroomName = "";
  if (newsroom) {
    newsroomName = newsroom.wrapper.data.name;
  }

  const { parameters, govtParameters, constitution, user } = state.networkDependent;
  const constitutionURI = constitution.get("uri") || "#";

  let appealFee = "";
  let challengeAppealCommitLen = "";
  let challengeAppealRevealLen = "";
  let appealVotePercentage = "";
  const civil = getCivil();
  if (parameters && Object.keys(parameters).length) {
    challengeAppealCommitLen = getFormattedParameterValue(
      Parameters.challengeAppealCommitLen,
      civil.toBigNumber(parameters[Parameters.challengeAppealCommitLen]),
    );
    challengeAppealRevealLen = getFormattedParameterValue(
      Parameters.challengeAppealRevealLen,
      civil.toBigNumber(parameters[Parameters.challengeAppealRevealLen]),
    );
  }
  if (govtParameters && Object.keys(govtParameters).length) {
    appealFee = getFormattedParameterValue(
      GovernmentParameters.appealFee,
      civil.toBigNumber(govtParameters[GovernmentParameters.appealFee]),
    );
    appealVotePercentage = getFormattedParameterValue(
      GovernmentParameters.appealVotePercentage,
      civil.toBigNumber(govtParameters[GovernmentParameters.appealVotePercentage]),
    );
  }
  let balance;
  let isInsufficientBalance = false;
  if (user) {
    balance = civil.toBigNumber(user.account.balance);
    isInsufficientBalance = balance.lt(civil.toBigNumber(govtParameters[GovernmentParameters.appealFee]));
  }

  return {
    newsroomName,
    constitutionURI,
    appealFee,
    challengeAppealCommitLen,
    challengeAppealRevealLen,
    appealVotePercentage,
    isInsufficientBalance,
    ...ownProps,
  };
};

interface InsufficientBalanceSnackBarProps {
  buyCVLURL: string;
  appealFee: string;
}

const InsufficientBalanceSnackBar: React.SFC<InsufficientBalanceSnackBarProps> = props => {
  return (
    <SnackBar>
      <InsufficientCVLForAppealChallenge appealFee={props.appealFee} buyCVLURL={props.buyCVLURL} />
    </SnackBar>
  );
};

const SubmitAppealChallenge = compose(
  connect(mapStateToProps),
  hasTransactionStatusModals(transactionStatusModalConfig),
)(SubmitAppealChallengeComponent) as React.ComponentClass<SubmitAppealChallengeProps>;

const SubmitAppealChallengePage: React.SFC<SubmitAppealChallengePageProps> = props => {
  const listingAddress = props.match.params.listing;
  const listingURI = `/listing/${listingAddress}`;
  const governanceGuideURI = "https://civil.co";
  return (
    <SubmitAppealChallenge
      listingAddress={listingAddress}
      listingURI={listingURI}
      governanceGuideURI={governanceGuideURI}
      history={props.history}
    />
  );
};

export default SubmitAppealChallengePage;
