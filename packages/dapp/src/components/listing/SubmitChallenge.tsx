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
  SubmitChallengeStatement as SubmitChallengeStatementComponent,
  SubmitChallengeStatementProps,
} from "@joincivil/components";
import { getFormattedParameterValue, Parameters } from "@joincivil/utils";
import { getCivil } from "../../helpers/civilInstance";
import { approveForChallenge, challengeListing } from "../../apis/civilTCR";
import { State } from "../../reducers";

export interface SubmitChallengePageProps {
  match: any;
}

interface SubmitChallengeProps {
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
  isApproveMetaMaskModalOpen?: boolean;
  isChallengeMetaMaskModalOpen?: boolean;
  isChallengeSuccessModalOpen?: boolean;
  isWaitingTransactionModalOpen?: boolean;
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
      isApproveMetaMaskModalOpen: false,
      isChallengeMetaMaskModalOpen: false,
      isChallengeSuccessModalOpen: false,
      isWaitingTransactionModalOpen: false,
    };
  }

  public render(): JSX.Element {
    const transactions = [
      {
        transaction: async () => {
          this.setState({
            isApproveMetaMaskModalOpen: false,
            isChallengeMetaMaskModalOpen: false,
            isWaitingTransactionModalOpen: true,
          });
          return approveForChallenge();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.setState({
            isApproveMetaMaskModalOpen: true,
            isWaitingTransactionModalOpen: false,
          });
        }
      },
      {
        transaction: async () => {
          this.setState({
            isApproveMetaMaskModalOpen: false,
            isChallengeMetaMaskModalOpen: false,
            isWaitingTransactionModalOpen: true,
          });
          return this.challenge();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.setState({
            isChallengeMetaMaskModalOpen: true,
            isWaitingTransactionModalOpen: false,
          });
        }
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
    };

    const { isApproveMetaMaskModalOpen, isChallengeMetaMaskModalOpen, isWaitingTransactionModalOpen, isChallengeSuccessModalOpen } = this.state;

    const modalProps = {
      isApproveMetaMaskModalOpen, isChallengeMetaMaskModalOpen, isWaitingTransactionModalOpen, isChallengeSuccessModalOpen
    };

    return (
      <>
        <SubmitChallengeStatementComponent {...props} />
        <ApproveForChallengeProgressModal {...modalProps} />
        <SubmitChallengeProgressModal {...modalProps} />
        <SubmitChallengeSuccessModal {...modalProps} handleSuccessClose={this.closeAllModals} commitStageLen={commitStageLen} revealStageLen={revealStageLen} />
      </>
    );
  }

  private closeAllModals = (): void => {
    this.setState({
      isApproveMetaMaskModalOpen: false,
      isChallengeMetaMaskModalOpen: false,
      isChallengeSuccessModalOpen: false,
      isWaitingTransactionModalOpen: false,
    });
  }

  private updateStatement = (key: string, value: any): void => {
    const stateKey = `challengeStatement${key.charAt(0).toUpperCase()}${key.substring(1)}`;
<<<<<<< Updated upstream
=======
    console.log(stateKey);
>>>>>>> Stashed changes
    this.setState(() => ({ [stateKey]: value }));
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
    console.log(this.props.listingAddress, JSON.stringify(jsonToSave));
    return challengeListing(this.props.listingAddress, JSON.stringify(jsonToSave));
  };
}

const ApproveForChallengeProgressModal: React.SFC<ProgressModalPropsState> = props => {
  if (!props.isApproveMetaMaskModalOpen) {
    return null;
  }
  return (
    <MetaMaskModal waiting={false}>
      <ModalHeading>Approving For Challenge</ModalHeading>
    </MetaMaskModal>
  );
};

const SubmitChallengeProgressModal: React.SFC<ProgressModalPropsState> = props => {
  if (!props.isChallengeMetaMaskModalOpen) {
    return null;
  }
  return (
    <MetaMaskModal waiting={false}>
      <ModalHeading>Submitting Challenge</ModalHeading>
    </MetaMaskModal>
  );
};

const SubmitChallengeSuccessModal: React.SFC<ProgressModalPropsState & ProgressModalActionProps & VotingParamsDisplayProps> = props => {
  if (!props.isChallengeSuccessModalOpen) {
    return null;
  }
  return (
    <Modal>
      <ModalHeading>
        <strong>Success!</strong><br />
        This Newsroom is now under challenge
      </ModalHeading>
      <ModalContent>
        <p>This challenge is now accepting votes. The CVL token-holding community will have the next {props.commitStageLen} to commit their secret votes, and {props.revealStageLen} to confirm their vote. To prevent decision bias, all votes will be hidden using a secret phrase, until the end of the voting period.</p>
        <p>You may vote on your own challenge using your CVL voting tokens, which is separate from your challenge deposit.</p>
        <Button size={buttonSizes.MEDIUM} onClick={props.handleSuccessClose}>Ok, got it</Button>
      </ModalContent>
    </Modal>
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
    <SubmitChallenge listingAddress={listingAddress} listingURI={listingURI} governanceGuideURI={governanceGuideURI} />
  );
};

export default SubmitChallengePage;
