import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import { BigNumber } from "@joincivil/typescript-types";
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
import { getFormattedParameterValue, Parameters, GovernmentParameters, urlConstants as links } from "@joincivil/utils";

import { routes } from "../../constants";
import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";
import { State } from "../../redux/reducers";
import {
  InjectedTransactionStatusModalProps,
  hasTransactionStatusModals,
  TransactionStatusModalContentMap,
} from "../utility/TransactionStatusModalsHOC";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { connectParameters, ParametersProps } from "../utility/HigherOrderComponents";

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
  appealFee: BigNumber;
  appealVotePercentage: BigNumber;
  balance: BigNumber;
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
  SubmitAppealChallengeProps & SubmitAppealChallengeReduxProps & InjectedTransactionStatusModalProps & ParametersProps,
  SubmitAppealChallengeState
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  public async componentWillMount(): Promise<void> {
    const transactionSuccessContent = this.getTransactionSuccessContent();
    this.props.setTransactions(this.getTransactions());
    this.props.setTransactionStatusModalConfig({
      transactionSuccessContent,
    });
    this.props.setHandleTransactionSuccessButtonClick(this.redirectToListingPage);

    const { civil } = this.context;
    if (civil && civil.currentProvider) {
      await civil.currentProviderEnable();
    }
  }

  public render(): JSX.Element {
    const {
      listingURI,
      newsroomName,
      governanceGuideURI,
      appealFee,
      appealVotePercentage,
      balance: balanceBN,
    } = this.props;

    const { civil } = this.context;
    const displayChallengeAppealCommitLen = getFormattedParameterValue(
      Parameters.challengeAppealCommitLen,
      civil.toBigNumber(this.props.parameters.get(Parameters.challengeAppealCommitLen)),
    );
    const displayChallengeAppealRevealLen = getFormattedParameterValue(
      Parameters.challengeAppealRevealLen,
      civil.toBigNumber(this.props.parameters.get(Parameters.challengeAppealRevealLen)),
    );

    const displayAppealFee = getFormattedParameterValue(GovernmentParameters.appealFee, civil.toBigNumber(appealFee));
    const displayAppealVotePercentage = getFormattedParameterValue(
      GovernmentParameters.appealVotePercentage,
      civil.toBigNumber(appealVotePercentage),
    );

    const balance = civil.toBigNumber(balanceBN);
    const isInsufficientBalance = balance.lt(civil.toBigNumber(appealFee));

    const props: SubmitAppealChallengeStatementProps = {
      listingURI,
      newsroomName,
      governanceGuideURI,
      appealFee: displayAppealFee,
      challengeAppealCommitLen: displayChallengeAppealCommitLen,
      challengeAppealRevealLen: displayChallengeAppealRevealLen,
      appealVotePercentage: displayAppealVotePercentage,
      updateStatementValue: this.updateStatement,
      transactions: this.getTransactions(),
      postExecuteTransactions: this.onSubmitAppealChallengeSuccess,
    };

    return (
      <>
        <ScrollToTopOnMount />
        {isInsufficientBalance && appealFee && (
          <InsufficientBalanceSnackBar appealFee={displayAppealFee!} buyCVLURL="/tokens" />
        )}
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
          return this.context.approveForChallengeGrantedAppeal();
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
            {getFormattedParameterValue(
              Parameters.challengeAppealCommitLen,
              this.props.parameters.get(Parameters.challengeAppealCommitLen),
            )}{" "}
            to commit their secret votes, and{" "}
            {getFormattedParameterValue(
              Parameters.challengeAppealRevealLen,
              this.props.parameters.get(Parameters.challengeAppealRevealLen),
            )}{" "}
            to confirm their vote. To prevent decision bias, all votes will be hidden using a secret phrase, until the
            end of the voting. Only a supermajority (
            {getFormattedParameterValue(GovernmentParameters.appealVotePercentage, this.props.appealVotePercentage)})
            from the community can overturn the Civil Council's decision.
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
    const listingURI = formatRoute(routes.LISTING, { listingAddress: this.props.listingAddress });
    this.props.closeAllModals();
    this.props.history.push(listingURI);
  };

  // Transactions

  private postAppealChallengeStatement = async (): Promise<any> => {
    const { challengeStatementSummaryValue, challengeStatementDetailsValue } = this.state;
    const jsonToSave = {
      summary: challengeStatementSummaryValue,
      details: challengeStatementDetailsValue.toString("html"),
    };
    return this.context.publishContent(JSON.stringify(jsonToSave));
  };

  private challengeGrantedAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return this.context.challengeGrantedAppealWithUri(
      this.props.listingAddress,
      this.state.appealChallengeStatementUri!,
    );
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

  const { govtParameters, user } = state.networkDependent;

  let appealFee = new BigNumber(0);
  let appealVotePercentage = new BigNumber(0);

  if (govtParameters && Object.keys(govtParameters).length) {
    appealFee = govtParameters[GovernmentParameters.appealFee];
    appealVotePercentage = govtParameters[GovernmentParameters.appealVotePercentage];
  }
  let balance = new BigNumber(0);
  if (user && user.account && user.account.balance) {
    balance = user.account.balance;
  }

  return {
    newsroomName,
    appealFee,
    appealVotePercentage,
    balance,
    ...ownProps,
  };
};

interface InsufficientBalanceSnackBarProps {
  buyCVLURL: string;
  appealFee: string;
}

const InsufficientBalanceSnackBar: React.FunctionComponent<InsufficientBalanceSnackBarProps> = props => {
  return (
    <SnackBar>
      <InsufficientCVLForAppealChallenge appealFee={props.appealFee} buyCVLURL={props.buyCVLURL} />
    </SnackBar>
  );
};

const SubmitAppealChallenge = compose(
  connect(mapStateToProps),
  hasTransactionStatusModals(transactionStatusModalConfig),
  connectParameters,
)(SubmitAppealChallengeComponent) as React.ComponentClass<SubmitAppealChallengeProps>;

const SubmitAppealChallengePage = (props: SubmitAppealChallengePageProps) => {
  const listingAddress = props.match.params.listingAddress;
  const listingURI = formatRoute(routes.LISTING, { listingAddress });
  const governanceGuideURI = links.FAQ_REGISTRY;
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
