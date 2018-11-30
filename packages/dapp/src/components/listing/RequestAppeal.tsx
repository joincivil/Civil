import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { EthAddress, TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  InsufficientCVLForAppeal,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
  RequestAppealStatement as RequestAppealStatementComponent,
  RequestAppealStatementProps,
  SnackBar,
} from "@joincivil/components";
import { getFormattedParameterValue, GovernmentParameters } from "@joincivil/utils";
import { getCivil } from "../../helpers/civilInstance";
import { approveForAppeal, appealChallenge } from "../../apis/civilTCR";
import { State } from "../../redux/reducers";
import {
  InjectedTransactionStatusModalProps,
  hasTransactionStatusModals,
  TransactionStatusModalContentMap,
} from "../utility/TransactionStatusModalsHOC";
import ScrollToTopOnMount from "../utility/ScrollToTop";

export interface RequestAppealPageProps {
  match: any;
  history?: any;
}

interface RequestAppealProps {
  listingAddress: EthAddress;
  listingURI: string;
  governanceGuideURI: string;
  history?: any;
}

interface RequestAppealReduxProps {
  newsroomName: string;
  constitutionURI: string;
  appealFee: string;
  judgeAppealLen: string;
  isInsufficientBalance: boolean;
}

interface RequestAppealState {
  appealStatementSummaryValue?: string;
  appealStatementCiteConstitutionValue?: any;
  appealStatementDetailsValue?: any;
}

enum TransactionTypes {
  APPROVE_FOR_APPEAL_REQUEST = "APPROVE_FOR_APPEAL_REQUEST",
  REQUEST_APPEAL = "REQUEST_APPEAL",
}

const transactionLabels = {
  [TransactionTypes.APPROVE_FOR_APPEAL_REQUEST]: "Approve for Appeal Request",
  [TransactionTypes.REQUEST_APPEAL]: "Appeal Request",
};

const multiStepTransactionLabels = {
  [TransactionTypes.APPROVE_FOR_APPEAL_REQUEST]: "1 of 2",
  [TransactionTypes.REQUEST_APPEAL]: "2 of 2",
};

const transactionRejectionContent = {
  [TransactionTypes.APPROVE_FOR_APPEAL_REQUEST]: [
    "Your appeal request was not submitted",
    "Before requesting an appeal, you need to confirm the approval of your appeal deposit in your MetaMask wallet.",
  ],
  [TransactionTypes.REQUEST_APPEAL]: [
    "Your appeal request was not submitted",
    "To request an appeal, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.APPROVE_FOR_APPEAL_REQUEST]: [
    "The was an problem with requesting your appeal",
    <>
      <ModalContent>Please check the following and retry your transaction</ModalContent>
      <ModalUnorderedList>
        <ModalListItem>You have sufficient CVL in your account for the appeal fee</ModalListItem>
      </ModalUnorderedList>
    </>,
  ],
  [TransactionTypes.REQUEST_APPEAL]: [
    "The was an problem with requesting your appeal",
    <>
      <ModalContent>Please check the retry your transaction</ModalContent>
    </>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  multiStepTransactionLabels,
  transactionRejectionContent,
  transactionErrorContent,
};

class RequestAppealComponent extends React.Component<
  RequestAppealProps & RequestAppealReduxProps & InjectedTransactionStatusModalProps,
  RequestAppealState
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
    const transactions = this.getTransactions();

    const {
      listingURI,
      newsroomName,
      constitutionURI,
      governanceGuideURI,
      appealFee,
      judgeAppealLen,
      isInsufficientBalance,
    } = this.props;

    const props: RequestAppealStatementProps = {
      listingURI,
      newsroomName,
      constitutionURI,
      governanceGuideURI,
      appealFee,
      judgeAppealLen,
      updateStatementValue: this.updateStatement,
      transactions,
    };

    return (
      <>
        <ScrollToTopOnMount />
        {isInsufficientBalance &&
          appealFee && <InsufficientBalanceSnackBar minDeposit={appealFee} buyCVLURL="https://civil.co" />}
        <RequestAppealStatementComponent {...props} />
      </>
    );
  }

  private updateStatement = (key: string, value: any): void => {
    const stateKey = `appealStatement${key.charAt(0).toUpperCase()}${key.substring(1)}Value`;
    this.setState(() => ({ [stateKey]: value }));
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
            transactionType: TransactionTypes.APPROVE_FOR_APPEAL_REQUEST,
          });
          return approveForAppeal();
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
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.REQUEST_APPEAL,
          });
          return this.appeal();
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
      [TransactionTypes.APPROVE_FOR_APPEAL_REQUEST]: [undefined, undefined],
      [TransactionTypes.REQUEST_APPEAL]: [
        "Your Request for Appeal was Submitted",
        <>
          <ModalContent>
            The Civil Council has {this.props.judgeAppealLen} to review the vote. They will publish at least one public
            document outlining the Constitutional rationale for their decision. Please check back for their decision.
          </ModalContent>
        </>,
      ],
    };
  };

  private redirectToListingPage = (): void => {
    this.props.closeAllModals();
    this.props.history.push("/listing/" + this.props.listingAddress);
  };

  // Transactions
  private appeal = async (): Promise<TwoStepEthTransaction<any>> => {
    const {
      appealStatementSummaryValue,
      appealStatementCiteConstitutionValue,
      appealStatementDetailsValue,
    } = this.state;
    const jsonToSave = {
      summary: appealStatementSummaryValue,
      citeConstitution: appealStatementCiteConstitutionValue.toString("html"),
      details: appealStatementDetailsValue.toString("html"),
    };
    return appealChallenge(this.props.listingAddress, JSON.stringify(jsonToSave));
  };
}

interface InsufficientBalanceSnackBarProps {
  buyCVLURL: string;
  minDeposit: string;
}

const InsufficientBalanceSnackBar: React.SFC<InsufficientBalanceSnackBarProps> = props => {
  return (
    <SnackBar>
      <InsufficientCVLForAppeal minDeposit={props.minDeposit} buyCVLURL={props.buyCVLURL} />
    </SnackBar>
  );
};

const mapStateToProps = (state: State, ownProps: RequestAppealProps): RequestAppealProps & RequestAppealReduxProps => {
  const { newsrooms } = state;
  const newsroom = newsrooms.get(ownProps.listingAddress);

  let newsroomName = "";
  if (newsroom) {
    newsroomName = newsroom.wrapper.data.name;
  }

  const { govtParameters, constitution, user } = state.networkDependent;
  const constitutionURI = constitution.get("uri") || "#";

  let appealFee = "";
  let judgeAppealLen = "";
  const civil = getCivil();
  if (govtParameters && Object.keys(govtParameters).length) {
    appealFee = getFormattedParameterValue(
      GovernmentParameters.appealFee,
      civil.toBigNumber(govtParameters[GovernmentParameters.appealFee]),
    );
    judgeAppealLen = getFormattedParameterValue(
      GovernmentParameters.judgeAppealLen,
      civil.toBigNumber(govtParameters[GovernmentParameters.judgeAppealLen]),
    );
  }
  let isInsufficientBalance = false;
  let balance;
  if (user) {
    balance = civil.toBigNumber(user.account.balance);
    isInsufficientBalance = balance.lt(civil.toBigNumber(govtParameters[GovernmentParameters.appealFee]));
  }

  return {
    newsroomName,
    constitutionURI,
    appealFee,
    judgeAppealLen,
    isInsufficientBalance,
    ...ownProps,
  };
};

const RequestAppeal = compose(connect(mapStateToProps), hasTransactionStatusModals(transactionStatusModalConfig))(
  RequestAppealComponent,
) as React.ComponentClass<RequestAppealProps>;

const RequestAppealPage: React.SFC<RequestAppealPageProps> = props => {
  const listingAddress = props.match.params.listing;
  const listingURI = `/listing/${listingAddress}`;
  const governanceGuideURI = "https://civil.co";
  return (
    <RequestAppeal
      listingAddress={listingAddress}
      listingURI={listingURI}
      governanceGuideURI={governanceGuideURI}
      history={props.history}
    />
  );
};

export default RequestAppealPage;
