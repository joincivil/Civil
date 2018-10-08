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
  RequestAppealStatement as RequestAppealStatementComponent,
  RequestAppealStatementProps,
} from "@joincivil/components";
import { getFormattedParameterValue, GovernmentParameters } from "@joincivil/utils";
import { getCivil } from "../../helpers/civilInstance";
import { approveForAppeal, appealChallenge } from "../../apis/civilTCR";
import { State } from "../../reducers";

export interface RequestAppealPageProps {
  match: any;
}

interface RequestAppealProps {
  listingAddress: EthAddress;
  listingURI: string;
  governanceGuideURI: string;
}

interface RequestAppealReduxProps {
  newsroomName: string;
  constitutionURI: string;
  appealFee: string;
  judgeAppealLen: string;
}

interface RequestAppealState {
  appealStatementSummaryValue?: string;
  appealStatementCiteConstitutionValue?: any;
  appealStatementDetailsValue?: any;
}

enum ModalContentEventNames {
  IN_PROGRESS_APPROVE_FOR_APPEAL = "IN_PROGRESS:APPROVE_FOR_APPEAL",
  IN_PROGRESS_REQUEST_APPEAL = "IN_PROGRESS:REQUEST_APPEAL",
}

class RequestAppealComponent extends React.Component<RequestAppealProps & RequestAppealReduxProps, RequestAppealState> {
  public render(): JSX.Element {
    const approveForAppealProgressModal = <ApproveForAppealProgressModal />;
    const requestAppealProgressModal = <RequestAppealProgressModal />;
    const modalContentComponents = {
      [ModalContentEventNames.IN_PROGRESS_APPROVE_FOR_APPEAL]: approveForAppealProgressModal,
      [ModalContentEventNames.IN_PROGRESS_REQUEST_APPEAL]: requestAppealProgressModal,
    };
    const transactions = [
      {
        transaction: approveForAppeal,
        progressEventName: ModalContentEventNames.IN_PROGRESS_APPROVE_FOR_APPEAL,
      },
      {
        transaction: this.appeal,
        progressEventName: ModalContentEventNames.IN_PROGRESS_REQUEST_APPEAL,
      },
    ];

    const { listingURI, newsroomName, constitutionURI, governanceGuideURI, appealFee, judgeAppealLen } = this.props;

    const props: RequestAppealStatementProps = {
      listingURI,
      newsroomName,
      constitutionURI,
      governanceGuideURI,
      appealFee,
      judgeAppealLen,
      updateStatementValue: this.updateStatement,
      transactions,
      modalContentComponents,
    };

    return <RequestAppealStatementComponent {...props} />;
  }

  private updateStatement = (key: string, value: any): void => {
    const stateKey = `appealStatement${key.charAt(0).toUpperCase()}${key.substring(1)}`;
    this.setState(() => ({ [stateKey]: value }));
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

const ApproveForAppealProgressModal: React.SFC = props => {
  return (
    <>
      <LoadingIndicator height={100} />
      <ModalHeading>Transaction in progress</ModalHeading>
      <ModalOrderedList>
        <ModalListItem type={ModalListItemTypes.STRONG}>Approving for Request Appeal</ModalListItem>
        <ModalListItem type={ModalListItemTypes.FADED}>Requesting Appeal</ModalListItem>
      </ModalOrderedList>
      <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
      <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
    </>
  );
};

const RequestAppealProgressModal: React.SFC = props => {
  return (
    <>
      <LoadingIndicator height={100} />
      <ModalHeading>Transactions in progress</ModalHeading>
      <ModalOrderedList>
        <ModalListItem>Approving for Request Appeal</ModalListItem>
        <ModalListItem type={ModalListItemTypes.STRONG}>Requesting Appeal</ModalListItem>
      </ModalOrderedList>
      <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
      <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
    </>
  );
};

const mapStateToProps = (state: State, ownProps: RequestAppealProps): RequestAppealProps & RequestAppealReduxProps => {
  const { newsrooms } = state;
  const newsroom = newsrooms.get(ownProps.listingAddress);

  let newsroomName = "";
  if (newsroom) {
    newsroomName = newsroom.wrapper.data.name;
  }

  const { govtParameters, constitution } = state.networkDependent;
  const constitutionURI = constitution.get("uri") || "#";

  let appealFee = "";
  let judgeAppealLen = "";
  if (govtParameters && Object.keys(govtParameters).length) {
    const civil = getCivil();
    appealFee = getFormattedParameterValue(
      GovernmentParameters.appealFee,
      civil.toBigNumber(govtParameters[GovernmentParameters.appealFee]),
    );
    judgeAppealLen = getFormattedParameterValue(
      GovernmentParameters.judgeAppealLen,
      civil.toBigNumber(govtParameters[GovernmentParameters.judgeAppealLen]),
    );
  }

  return {
    newsroomName,
    constitutionURI,
    appealFee,
    judgeAppealLen,
    ...ownProps,
  };
};

const RequestAppeal = connect(mapStateToProps)(RequestAppealComponent);

const RequestAppealPage: React.SFC<RequestAppealPageProps> = props => {
  const listingAddress = props.match.params.listing;
  const listingURI = `/listing/${listingAddress}`;
  const governanceGuideURI = "https://civil.co";
  return (
    <RequestAppeal listingAddress={listingAddress} listingURI={listingURI} governanceGuideURI={governanceGuideURI} />
  );
};

export default RequestAppealPage;
