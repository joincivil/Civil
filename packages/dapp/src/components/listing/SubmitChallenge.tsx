import * as React from "react";
import { connect } from "react-redux";
import { EthAddress, TwoStepEthTransaction } from "@joincivil/core";
import {
  LoadingIndicator,
  ModalHeading,
  ModalContent,
  ModalOrderedList,
  ModalListItem,
  ModalListItemTypes,
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

enum ModalContentEventNames {
  IN_PROGRESS_APPROVE_FOR_CHALLENGE = "IN_PROGRESS:APPROVE_FOR_CHALLENGE",
  IN_PROGRESS_SUBMIT_CHALLENGE = "IN_PROGRESS:SUBMIT_CHALLENGE",
}

class SubmitChallengeComponent extends React.Component<
  SubmitChallengeProps & SubmitChallengeReduxProps,
  SubmitChallengeState
> {
  public render(): JSX.Element {
    const approveForChallengeProgressModal = <ApproveForChallengeProgressModal />;
    const submitChallengeProgressModal = <SubmitChallengeProgressModal />;
    const modalContentComponents = {
      [ModalContentEventNames.IN_PROGRESS_APPROVE_FOR_CHALLENGE]: approveForChallengeProgressModal,
      [ModalContentEventNames.IN_PROGRESS_SUBMIT_CHALLENGE]: submitChallengeProgressModal,
    };
    const transactions = [
      {
        transaction: approveForChallenge,
        progressEventName: ModalContentEventNames.IN_PROGRESS_APPROVE_FOR_CHALLENGE,
      },
      {
        transaction: this.challenge,
        progressEventName: ModalContentEventNames.IN_PROGRESS_SUBMIT_CHALLENGE,
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
      modalContentComponents,
      postExecuteTransactions: this.onSubmitChallengeSuccess,
    };

    return <SubmitChallengeStatementComponent {...props} />;
  }

  private updateStatement = (key: string, value: any): void => {
    const stateKey = `challengeStatement${key.charAt(0).toUpperCase()}${key.substring(1)}Value`;
    this.setState(() => ({ [stateKey]: value }));
  };

  private onSubmitChallengeSuccess = (): void => {
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
    console.log(jsonToSave);
    return challengeListing(this.props.listingAddress, JSON.stringify(jsonToSave));
  };
}

const ApproveForChallengeProgressModal: React.SFC = props => {
  return (
    <>
      <LoadingIndicator height={100} />
      <ModalHeading>Transactions in progress</ModalHeading>
      <ModalOrderedList>
        <ModalListItem type={ModalListItemTypes.STRONG}>Approving For Challenge</ModalListItem>
        <ModalListItem type={ModalListItemTypes.FADED}>Submitting Challenge</ModalListItem>
      </ModalOrderedList>
      <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
      <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
    </>
  );
};

const SubmitChallengeProgressModal: React.SFC = props => {
  return (
    <>
      <LoadingIndicator height={100} />
      <ModalHeading>Transactions in progress</ModalHeading>
      <ModalOrderedList>
        <ModalListItem>Approving For Challenge</ModalListItem>
        <ModalListItem type={ModalListItemTypes.STRONG}>Submitting Challenge</ModalListItem>
      </ModalOrderedList>
      <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
      <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
    </>
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
