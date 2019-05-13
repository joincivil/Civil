import * as React from "react";
import { compose } from "redux";
import { formatRoute } from "react-router-named-routes";
import styled from "styled-components";
import { ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import {
  InApplicationCard,
  RejectedCard as RejectedCardComponent,
  Modal,
  ProgressModalContentMobileUnsupported,
  ChallengeResultsProps,
  AppealChallengePhaseProps,
  AppealDecisionProps,
  ChallengePhaseProps,
} from "@joincivil/components";
import { urlConstants as links } from "@joincivil/utils";

import { getChallengeResultsProps, getAppealChallengeResultsProps } from "../../helpers/transforms";
import ChallengeDetailContainer from "./ChallengeDetail";
import ChallengeResolve from "./ChallengeResolve";
import { routes } from "../../constants";
import { ListingContainerProps, connectLatestChallengeSucceededResults } from "../utility/HigherOrderComponents";
import ApplicationUpdateStatus from "./ApplicationUpdateStatus";
import WhitelistedDetail from "./WhitelistedDetail";

const StyledContainer = styled.div`
  margin: 0 0 80px;
`;

export interface ListingPhaseActionsProps {
  listing: ListingWrapper;
  newsroom: NewsroomWrapper;
  expiry?: number;
  parameters: any;
  govtParameters: any;
  constitutionURI?: string;
  listingPhaseState: any;
}

export interface ListingPhaseActionsState {
  isNoMobileTransactionVisible: boolean;
}

class ListingPhaseActions extends React.Component<ListingPhaseActionsProps, ListingPhaseActionsState> {
  constructor(props: ListingPhaseActionsProps) {
    super(props);
    this.state = { isNoMobileTransactionVisible: false };
  }

  public render(): JSX.Element {
    const listing = this.props.listing;
    const {
      isInApplication,
      isWhitelisted,
      isRejected,
      canBeWhitelisted,
      canResolveChallenge,
    } = this.props.listingPhaseState;
    const challenge = this.props.listing.data.challenge;
    console.log(challenge);
    return (
      <>
        {isWhitelisted && (!challenge || challenge.resolved) && this.renderApplicationWhitelisted()}
        {isRejected && (!challenge || challenge.resolved) && this.renderRejected()}
        {isInApplication && this.renderApplicationPhase()}
        {listing.data && (
          <StyledContainer>
            {canBeWhitelisted && this.renderCanWhitelist()}
            {canResolveChallenge && this.renderCanResolve()}

            {listing.data.challenge &&
              !listing.data.challenge.resolved &&
              !canResolveChallenge && (
                <ChallengeDetailContainer
                  challengeID={this.props.listing.data.challengeID}
                  listingAddress={this.props.listing.address}
                  newsroom={this.props.newsroom}
                  challengeData={{
                    listingAddress: this.props.listing.address,
                    challengeID: this.props.listing.data.challengeID,
                    challenge: this.props.listing.data.challenge!,
                  }}
                  onMobileTransactionClick={this.showNoMobileTransactionsModal}
                />
              )}
          </StyledContainer>
        )}

        {this.renderNoMobileTransactions()}
      </>
    );
  }

  private renderCanWhitelist = (): JSX.Element => {
    return (
      <ApplicationUpdateStatus
        listingAddress={this.props.listing!.address}
        onMobileTransactionClick={this.showNoMobileTransactionsModal}
      />
    );
  };

  private renderCanResolve(): JSX.Element {
    return (
      <ChallengeResolve
        listingAddress={this.props.listing.address}
        challengeID={this.props.listing.data.challengeID}
        onMobileTransactionClick={this.showNoMobileTransactionsModal}
      />
    );
  }

  private renderApplicationWhitelisted(): JSX.Element {
    let approvalDate;
    if (this.props.listing.data.approvalDate) {
      approvalDate = this.props.listing.data.approvalDate;
    }
    return (
      <>
        <WhitelistedDetail
          listingAddress={this.props.listing.address}
          constitutionURI={this.props.constitutionURI}
          faqURL={links.FAQ_REGISTRY}
          onMobileTransactionClick={this.showNoMobileTransactionsModal}
          approvalDate={approvalDate}
        />
      </>
    );
  }

  private renderRejected(): JSX.Element {
    const data = this.props.listing!.data!;
    if (!data.prevChallenge) {
      const RejectedCard = compose<React.ComponentClass<ListingContainerProps & {}>>(
        connectLatestChallengeSucceededResults,
      )(RejectedCardComponent);

      return <RejectedCard listingAddress={this.props.listing.address} />;
    } else {
      const challengeResultsProps = getChallengeResultsProps(data.prevChallenge!) as ChallengeResultsProps;
      let appealChallengeResultsProps;
      const challengeProps: ChallengePhaseProps = {
        challengeID: data.prevChallengeID!.toString(),
      };
      let appealProps: AppealDecisionProps = {};
      if (data.prevChallenge && data.prevChallenge.appeal && data.prevChallenge.appeal.appealFeePaid) {
        appealProps = {
          appealRequested: !data.prevChallenge!.appeal!.appealFeePaid!.isZero(),
          appealGranted: data.prevChallenge!.appeal!.appealGranted,
          appealGrantedStatementURI: data.prevChallenge!.appeal!.appealGrantedStatementURI,
        };
      }
      let appealChallengePhaseProps: AppealChallengePhaseProps = {};
      if (data.prevChallenge!.appeal) {
        appealChallengePhaseProps = { appealChallengeID: data.prevChallenge!.appeal!.appealChallengeID.toString() };
      }
      if (data.prevChallenge.appeal && data.prevChallenge.appeal.appealChallenge) {
        appealChallengeResultsProps = getAppealChallengeResultsProps(data.prevChallenge.appeal.appealChallenge!);
      }
      return (
        <RejectedCardComponent
          faqURL={links.FAQ_REGISTRY}
          {...challengeProps}
          {...challengeResultsProps}
          {...appealProps}
          {...appealChallengeResultsProps}
          {...appealChallengePhaseProps}
        />
      );
    }
  }

  private renderApplicationPhase(): JSX.Element | null {
    const endTime = this.props.listing!.data.appExpiry.toNumber();
    const phaseLength = this.props.parameters.applyStageLen;
    if (!endTime || !phaseLength) {
      return null;
    }
    const submitChallengeURI = formatRoute(routes.SUBMIT_CHALLENGE, { listingAddress: this.props.listing.address });

    return (
      <>
        <InApplicationCard
          endTime={endTime}
          phaseLength={phaseLength}
          submitChallengeURI={submitChallengeURI}
          constitutionURI={this.props.constitutionURI}
          faqURL={links.FAQ_CHALLENGE_SECTION}
          learnMoreURL={links.FAQ_REGISTRY}
          onMobileTransactionClick={this.showNoMobileTransactionsModal}
        />
      </>
    );
  }

  private showNoMobileTransactionsModal = (): void => {
    this.setState({ isNoMobileTransactionVisible: true });
  };

  private hideNoMobileTransactionsModal = (): void => {
    this.setState({ isNoMobileTransactionVisible: false });
  };

  private renderNoMobileTransactions(): JSX.Element {
    if (this.state.isNoMobileTransactionVisible) {
      return (
        <Modal textAlign="center">
          <ProgressModalContentMobileUnsupported hideModal={this.hideNoMobileTransactionsModal} />
        </Modal>
      );
    }

    return <></>;
  }
}

export default ListingPhaseActions;
