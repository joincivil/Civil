import * as React from "react";
import { connect } from "react-redux";
import { EthAddress, TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  Button,
  buttonSizes,
  MetaMaskModal,
  Modal,
  ModalHeading,
  ModalContent,
  ModalStepLabel,
  ProgressModalContentInProgress,
  SubmitChallengeStatement as SubmitChallengeStatementComponent,
  SubmitChallengeStatementProps,
} from "@joincivil/components";
import { getFormattedParameterValue, Parameters } from "@joincivil/utils";
import { getCivil } from "../../helpers/civilInstance";
import { approveForChallenge, challengeListing } from "../../apis/civilTCR";
import { State } from "../../reducers";

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
  constitutionURI: string;
  minDeposit: string;
  commitStageLen: string;
  revealStageLen: string;
}

interface SubmitChallengeState {
  challengeStatementSummaryValue?: string;
  challengeStatementCiteConstitutionValue?: any;
  challengeStatementDetailsValue?: any;
}

interface ProgressModalPropsState {
  isWaitingTransactionModalOpen?: boolean;
  isTransactionProgressModalOpen?: boolean;
  isTransactionSuccessModalOpen?: boolean;
  isTransactionRejectionModalOpen?: boolean;
  transactionIndex?: number;
  transactions?: any[];
  cancelTransaction?(): void;
}

interface ProgressModalActionProps {
  handleSuccessClose(): void;
}

interface VotingParamsDisplayProps {
  commitStageLen: string;
  revealStageLen: string;
}

class SubmitChallengeComponent extends React.Component<
  SubmitChallengeProps & SubmitChallengeReduxProps,
  SubmitChallengeState & ProgressModalPropsState
> {
  constructor(props: SubmitChallengeProps & SubmitChallengeReduxProps) {
    super(props);

    this.state = {
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: false,
      transactionIndex: -1,
    };
  }

  public render(): JSX.Element {
    const transactions = [
      {
        transaction: async () => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            isTransactionRejectionModalOpen: false,
            transactionIndex: 0,
          });
          return approveForChallenge();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.setState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        handleTransactionError: this.handleTransactionError,
      },
      {
        transaction: async () => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionIndex: 1,
          });
          return this.challenge();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
          });
        },
        handleTransactionError: this.handleTransactionError,
      },
    ];

    const {
      listingURI,
      newsroomName,
      constitutionURI,
      governanceGuideURI,
      minDeposit,
      commitStageLen,
      revealStageLen,
    } = this.props;

    const props: SubmitChallengeStatementProps = {
      listingURI,
      newsroomName,
      constitutionURI,
      governanceGuideURI,
      minDeposit,
      commitStageLen,
      revealStageLen,
      updateStatementValue: this.updateStatement,
      transactions,
<<<<<<< HEAD
=======
      modalContentComponents,
>>>>>>> origin/master
      postExecuteTransactions: this.onSubmitChallengeSuccess,
    };

    const {
      isWaitingTransactionModalOpen,
      isTransactionProgressModalOpen,
      isTransactionSuccessModalOpen,
      transactionIndex,
    } = this.state;

    const modalProps = {
      isWaitingTransactionModalOpen,
      isTransactionProgressModalOpen,
      isTransactionSuccessModalOpen,
      transactionIndex,
    };

    return (
      <>
        <SubmitChallengeStatementComponent {...props} />
        <AwaitingTransactionModal {...modalProps} />
        <TransactionProgressModal {...modalProps} />
        <TransactionSuccessModal
          {...modalProps}
          handleSuccessClose={this.redirectToListingPage}
          commitStageLen={commitStageLen}
          revealStageLen={revealStageLen}
        />
        <TransactionRejectionModal
          transactions={transactions}
          cancelTransaction={this.closeAllModals}
          {...modalProps}
        />
      </>
    );
  }

  private closeAllModals = (): void => {
    this.setState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: false,
      transactionIndex: -1,
    });
  };

  private handleTransactionError = (err: Error) => {
    const isErrorUserRejection = err.message === "Error: MetaMask Tx Signature: User denied transaction signature.";
    this.setState(() => ({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: isErrorUserRejection,
    }));
  };

  private updateStatement = (key: string, value: any): void => {
    const stateKey = `challengeStatement${key.charAt(0).toUpperCase()}${key.substring(1)}Value`;
    this.setState(() => ({ [stateKey]: value }));
  };

  private onSubmitChallengeSuccess = (): void => {
<<<<<<< HEAD
    this.setState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: true,
    });
  };

  private redirectToListingPage = (): void => {
    this.closeAllModals();
=======
>>>>>>> origin/master
    this.props.history.push("/listing/" + this.props.listingAddress);
  };

  // Transactions
  private challenge = async (): Promise<TwoStepEthTransaction<any>> => {
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
    return challengeListing(this.props.listingAddress, JSON.stringify(jsonToSave));
  };
}

const AwaitingTransactionModal: React.SFC<ProgressModalPropsState> = props => {
  if (!props.isWaitingTransactionModalOpen) {
    return null;
  }
  const { transactionIndex } = props;
  let transactionLabel = "";
  let stepLabelText = "";
  if (transactionIndex === 0) {
    transactionLabel = "Approve For Challenge";
    stepLabelText = `Step 1 of 2 - ${transactionLabel}`;
  } else if (transactionIndex === 1) {
    transactionLabel = "Submit Challenge";
    stepLabelText = `Step 2 of 2 - ${transactionLabel}`;
  }
  return (
    <MetaMaskModal waiting={true}>
      <ModalStepLabel>{stepLabelText}</ModalStepLabel>
      <ModalHeading>Waiting for you to confirm in MetaMask</ModalHeading>
    </MetaMaskModal>
  );
};

const TransactionProgressModal: React.SFC<ProgressModalPropsState> = props => {
  if (!props.isTransactionProgressModalOpen) {
    return null;
  }
  const { transactionIndex } = props;
  let transactionLabel = "";
  let stepLabelText = "";
  if (transactionIndex === 0) {
    transactionLabel = "Approve For Challenge";
    stepLabelText = `Step 1 of 2 - ${transactionLabel}`;
  } else if (transactionIndex === 1) {
    transactionLabel = "Submit Challenge";
    stepLabelText = `Step 2 of 2 - ${transactionLabel}`;
  }
  return (
    <Modal>
      <ProgressModalContentInProgress>
        <>
          <ModalStepLabel>{stepLabelText}</ModalStepLabel>
          <ModalHeading>{transactionLabel}</ModalHeading>
        </>
      </ProgressModalContentInProgress>
    </Modal>
  );
};

const TransactionSuccessModal: React.SFC<
  ProgressModalPropsState & ProgressModalActionProps & VotingParamsDisplayProps
> = props => {
  if (!props.isTransactionSuccessModalOpen) {
    return null;
  }
  return (
    <Modal>
      <ModalHeading>
        <strong>Success!</strong>
        <br />
        This Newsroom is now under challenge
      </ModalHeading>
      <ModalContent>
        This challenge is now accepting votes. The CVL token-holding community will have the next {props.commitStageLen}{" "}
        to commit their secret votes, and {props.revealStageLen} to confirm their vote. To prevent decision bias, all
        votes will be hidden using a secret phrase, until the end of the voting period.
      </ModalContent>
      <ModalContent>
        You may vote on your own challenge using your CVL voting tokens, which is separate from your challenge deposit.
      </ModalContent>
      <Button size={buttonSizes.MEDIUM} onClick={props.handleSuccessClose}>
        Ok, got it
      </Button>
    </Modal>
  );
};

const TransactionRejectionModal: React.SFC<ProgressModalPropsState> = props => {
  if (!props.isTransactionRejectionModalOpen) {
    return null;
  }

  const { transactionIndex } = props;
  const message = "Your challenge was not submitted";
  let denialMessage = "";

  if (transactionIndex === 0) {
    denialMessage =
      "Before submitting a challenge, you need to confirm the approval of your challenge deposit in your MetaMask wallet.";
  } else if (transactionIndex === 1) {
    denialMessage = "To submit a challenge, you need to confirm the transaction in your MetaMask wallet.";
  }

  return (
    <MetaMaskModal
      waiting={false}
      denied={true}
      denialText={denialMessage}
      cancelTransaction={() => props.cancelTransaction!()}
      denialRestartTransactions={props.transactions}
    >
      <ModalHeading>{message}</ModalHeading>
    </MetaMaskModal>
  );
};

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

  const { parameters, constitution } = state.networkDependent;
  const constitutionURI = constitution.get("uri") || "#";

  let minDeposit = "";
  let commitStageLen = "";
  let revealStageLen = "";
  if (parameters && Object.keys(parameters).length) {
    const civil = getCivil();
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

  return {
    newsroomName,
    constitutionURI,
    minDeposit,
    commitStageLen,
    revealStageLen,
    ...ownProps,
  };
};

const SubmitChallenge = connect(mapStateToProps)(SubmitChallengeComponent);

const SubmitChallengePage: React.SFC<SubmitChallengePageProps> = props => {
  const listingAddress = props.match.params.listing;
  const listingURI = `/listing/${listingAddress}`;
  const governanceGuideURI = "https://civil.co";
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
