import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { formatRoute } from "react-router-named-routes";
import { EthAddress, BigNumber, TxHash } from "@joincivil/typescript-types";
import { TwoStepEthTransaction } from "@joincivil/core";
import {
  InsufficientCVLForAppeal,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
  RequestAppealStatement as RequestAppealStatementComponent,
  RequestAppealStatementProps,
  RequestAppealSuccessIcon,
  SnackBar,
} from "@joincivil/components";
import { getFormattedParameterValue, GovernmentParameters, urlConstants as links } from "@joincivil/utils";

import { routes } from "../../constants";
import { CivilHelperContext, CivilHelper } from "../../apis/CivilHelper";
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
  appealFee: BigNumber;
  judgeAppealLen: BigNumber;
  balance: BigNumber;
}

interface RequestAppealState {
  appealStatementSummaryValue?: string;
  appealStatementDetailsValue?: any;
  appealStatementUri?: string;
}

enum TransactionTypes {
  APPROVE_FOR_APPEAL_REQUEST = "APPROVE_FOR_APPEAL_REQUEST",
  REQUEST_APPEAL = "REQUEST_APPEAL",
  PUBLISH_CONTENT = "PUBLISH_CONTENT",
}

const transactionLabels = {
  [TransactionTypes.APPROVE_FOR_APPEAL_REQUEST]: "Approve for Appeal Request",
  [TransactionTypes.PUBLISH_CONTENT]: "Publish Statement",
  [TransactionTypes.REQUEST_APPEAL]: "Appeal Request",
};

const multiStepTransactionLabels = {
  [TransactionTypes.APPROVE_FOR_APPEAL_REQUEST]: "1 of 3",
  [TransactionTypes.PUBLISH_CONTENT]: "2 of 3",
  [TransactionTypes.REQUEST_APPEAL]: "3 of 3",
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
    const transactions = this.getTransactions();

    const { listingURI, newsroomName, governanceGuideURI, appealFee, judgeAppealLen, balance: balanceBN } = this.props;

    const displayAppealFee = getFormattedParameterValue(GovernmentParameters.appealFee, appealFee);
    const displayJudgeAppealLen = getFormattedParameterValue(GovernmentParameters.judgeAppealLen, judgeAppealLen);
    const balance = balanceBN === undefined ? new BigNumber(0) : balanceBN;
    const isInsufficientBalance = balance.lt(appealFee);

    const props: RequestAppealStatementProps = {
      listingURI,
      newsroomName,
      constitutionURI: links.CONSTITUTION,
      governanceGuideURI,
      appealFee: displayAppealFee,
      judgeAppealLen: displayJudgeAppealLen,
      updateStatementValue: this.updateStatement,
      transactions,
      postExecuteTransactions: this.onSubmitAppealSuccess,
    };

    return (
      <>
        <ScrollToTopOnMount />
        {isInsufficientBalance && appealFee && (
          <InsufficientBalanceSnackBar minDeposit={displayAppealFee} buyCVLURL="/tokens" />
        )}
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
            isIPFSUploadModalOpen: false,
            transactionType: TransactionTypes.APPROVE_FOR_APPEAL_REQUEST,
          });
          return this.context.approveForAppeal();
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
          return this.postAppealStatement();
        },
        postTransaction: async (receipt: any) => {
          this.setState({ appealStatementUri: receipt.uri });
        },
      },
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            isTransactionErrorModalOpen: false,
            isTransactionRejectionModalOpen: false,
            isIPFSUploadModalOpen: false,
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

  private onSubmitAppealSuccess = (): void => {
    this.props.updateTransactionStatusModalsState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: true,
    });
  };

  private getTransactionSuccessContent = (): TransactionStatusModalContentMap => {
    return {
      [TransactionTypes.APPROVE_FOR_APPEAL_REQUEST]: [undefined, undefined],
      [TransactionTypes.REQUEST_APPEAL]: [
        <>
          <RequestAppealSuccessIcon />
          <div>Your Request for Appeal was Submitted</div>
        </>,
        <>
          <ModalContent>
            The Civil Council has{" "}
            {getFormattedParameterValue(GovernmentParameters.judgeAppealLen, this.props.judgeAppealLen)} to review the
            vote. They will publish at least one public document outlining the Constitutional rationale for their
            decision. Please check back for their decision.
          </ModalContent>
        </>,
      ],
    };
  };

  private redirectToListingPage = (): void => {
    const listingURI = formatRoute(routes.LISTING, { listingAddress: this.props.listingAddress });
    this.props.closeAllModals();
    this.props.history.push(listingURI);
  };

  // Transactions

  private postAppealStatement = async (): Promise<any> => {
    const { appealStatementSummaryValue, appealStatementDetailsValue } = this.state;
    const jsonToSave = {
      summary: appealStatementSummaryValue,
      details: appealStatementDetailsValue.toString("html"),
    };
    return this.context.publishContent(JSON.stringify(jsonToSave));
  };
  private appeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return this.context.requestAppealWithUri(this.props.listingAddress, this.state.appealStatementUri!);
  };
}

interface InsufficientBalanceSnackBarProps {
  buyCVLURL: string;
  minDeposit: string;
}

const InsufficientBalanceSnackBar: React.FunctionComponent<InsufficientBalanceSnackBarProps> = props => {
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

  const { govtParameters, user } = state.networkDependent;

  let appealFee = new BigNumber(0);
  let judgeAppealLen = new BigNumber(0);
  if (govtParameters && Object.keys(govtParameters).length) {
    appealFee = govtParameters[GovernmentParameters.appealFee];
    judgeAppealLen = govtParameters[GovernmentParameters.judgeAppealLen];
  }
  let balance = new BigNumber(0);
  if (user) {
    balance = user.account.balance;
  }

  return {
    newsroomName,
    appealFee,
    judgeAppealLen,
    balance,
    ...ownProps,
  };
};

const RequestAppeal = compose(
  connect(mapStateToProps),
  hasTransactionStatusModals(transactionStatusModalConfig),
)(RequestAppealComponent) as React.ComponentClass<RequestAppealProps>;

const RequestAppealPage = (props: RequestAppealPageProps) => {
  const listingAddress = props.match.params.listingAddress;
  const listingURI = formatRoute(routes.LISTING, { listingAddress });
  const governanceGuideURI = links.FAQ_REGISTRY;
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
