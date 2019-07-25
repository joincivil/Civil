import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import { ListingWrapper, WrappedChallengeData, EthContentHeader, CharterData } from "@joincivil/core";
import { NewsroomState, getNewsroom, getNewsroomMultisigBalance } from "@joincivil/newsroom-signup";
import { CivilContext, DashboardNewsroom } from "@joincivil/components";
import { getFormattedTokenBalance, getEtherscanBaseURL, getLocalDateTimeStrings } from "@joincivil/utils";

import { routes } from "../../constants";
import { State } from "../../redux/reducers";
import { getChallengeByListingAddress, getListingPhaseState, makeGetListing, getChallengeState } from "../../selectors";

import { fetchAndAddListingData } from "../../redux/actionCreators/listings";
import { getContent } from "../../redux/actionCreators/newsrooms";

import PhaseCountdown from "./MyTasksItemPhaseCountdown";

export interface NewsroomsListItemOwnProps {
  listingAddress: string;
  listing?: ListingWrapper | undefined;
  newsroomCharterHeader?: EthContentHeader;
}

export interface NewsroomsListItemReduxProps {
  network: string;
  listingDataRequestStatus?: any;
  newsroom?: NewsroomState;
  charter?: Partial<CharterData>;
  challenge?: WrappedChallengeData;
  challengeState?: any;
  listingPhaseState?: any;
}

class NewsroomsListItemListingRedux extends React.Component<
  NewsroomsListItemOwnProps & NewsroomsListItemReduxProps & DispatchProp<any>
> {
  public static contextType = CivilContext;

  public async componentDidUpdate(): Promise<void> {
    await this.hydrateData();
  }

  public async componentDidMount(): Promise<void> {
    await this.hydrateData();
  }

  public render(): JSX.Element {
    const { listingAddress, listing, newsroom, listingPhaseState, network, challenge, challengeState } = this.props;

    const getNewsroomStatusOnRegistry = () => {
      const {
        isWhitelisted,
        isRejected,
        isInApplication,
        canBeWhitelisted,
        isUnderChallenge,
        inChallengeCommitVotePhase,
        inChallengeRevealPhase,
        isAwaitingAppealRequest,
        canResolveChallenge,
        isAwaitingAppealJudgement,
        isAwaitingAppealChallenge,
        isInAppealChallengeCommitStage,
        isInAppealChallengeRevealStage,
        canListingAppealBeResolved,
        canListingAppealChallengeBeResolved,
      } = listingPhaseState;

      if (isWhitelisted && !isUnderChallenge) {
        let acceptedDate;

        if (listing && listing.data.approvalDate) {
          const dateParts = getLocalDateTimeStrings(listing.data.approvalDate.toNumber());
          acceptedDate = `${dateParts[0]} ${dateParts[1]}`;
        }

        return {
          isAccepted: true,
          acceptedDate,
        };
      } else if (isRejected && !isInApplication && !isUnderChallenge) {
        return {
          isRejected: true,
        };
      }

      const isInProgress = true;
      let inProgressPhaseDisplayName = "";

      switch (true) {
        case isInApplication:
          inProgressPhaseDisplayName = "New Application";
          break;

        case canBeWhitelisted ||
          canResolveChallenge ||
          canListingAppealBeResolved ||
          canListingAppealChallengeBeResolved:
          inProgressPhaseDisplayName = "Ready To Update";
          break;

        case inChallengeCommitVotePhase || inChallengeRevealPhase || isAwaitingAppealRequest:
          inProgressPhaseDisplayName = "Under Challenge";
          break;

        case isAwaitingAppealJudgement || isAwaitingAppealChallenge:
          inProgressPhaseDisplayName = "Under Appeal";
          break;

        case isInAppealChallengeCommitStage || isInAppealChallengeRevealStage:
          inProgressPhaseDisplayName = "Decision Challenged";
          break;
      }

      let inProgressPhaseDetails;
      if (
        inChallengeCommitVotePhase ||
        inChallengeRevealPhase ||
        isAwaitingAppealRequest ||
        isAwaitingAppealJudgement ||
        isAwaitingAppealChallenge ||
        isInAppealChallengeCommitStage ||
        isInAppealChallengeRevealStage
      ) {
        inProgressPhaseDetails = <PhaseCountdown challengeState={challengeState} challenge={challenge} />;
      }

      return {
        isUnderChallenge,
        isInProgress,
        inProgressPhaseDisplayName,
        inProgressPhaseDetails,
      };
    };

    if (listing && newsroom && newsroom.wrapper && listingPhaseState) {
      const newsroomData = newsroom.wrapper.data;

      const listingDetailURL = formatRoute(routes.LISTING, { listingAddress });
      const editNewsroomURL = formatRoute(routes.APPLY_TO_REGISTRY, { action: "manage" });

      let newsroomMultiSigBalance = "0.00";
      if (newsroom.multisigBalance) {
        newsroomMultiSigBalance = getFormattedTokenBalance(newsroom.multisigBalance, true);
      }
      const etherscanBaseURL = getEtherscanBaseURL(network);

      const newsroomStatusOnRegistry = getNewsroomStatusOnRegistry();

      const displayProps = {
        newsroomName: newsroomData.name,
        newsroomAddress: listingAddress,
        newsroomMultiSigAddress: newsroom.multisigAddress,
        newsroomMultiSigBalance,
        listingDetailURL,
        editNewsroomURL,
        newsroomDeposit: getFormattedTokenBalance(listing.data.unstakedDeposit, true),
        etherscanBaseURL,
      };

      return <DashboardNewsroom {...displayProps} {...newsroomStatusOnRegistry} />;
    }

    return <></>;
  }

  private hydrateData = async (): Promise<void> => {
    const { listing, listingDataRequestStatus, listingAddress, newsroom, charter, newsroomCharterHeader } = this.props;
    const { civil } = this.context;

    if (!listing && !listingDataRequestStatus) {
      this.props.dispatch!(fetchAndAddListingData(listingAddress!));
    }
    if (newsroom) {
      if (newsroom.multisigAddress) {
        this.props.dispatch!(await getNewsroomMultisigBalance(listingAddress!, newsroom.multisigAddress, civil));
      }
    } else if (charter) {
      this.props.dispatch!(await getNewsroom(listingAddress!, civil, charter));
    }
    if (newsroomCharterHeader && !charter) {
      this.props.dispatch!(await getContent(newsroomCharterHeader!));
    }
  };
}

const makeMapStateToProps = () => {
  const getListing = makeGetListing();

  const mapStateToProps = (
    state: State,
    ownProps: NewsroomsListItemOwnProps,
  ): NewsroomsListItemReduxProps & NewsroomsListItemOwnProps => {
    const { listingAddress, listing } = ownProps;
    const { network, newsrooms } = state;
    const { content } = state.networkDependent;
    const newsroom = listingAddress ? newsrooms.get(listingAddress) : undefined;

    let listingRedux;
    if (!listing) {
      listingRedux = getListing(state, ownProps);
    }

    const challenge = getChallengeByListingAddress(state, ownProps);
    let challengeState;

    if (challenge) {
      challengeState = getChallengeState(challenge);
    }

    let charter;
    let charterURI;
    let newsroomCharterHeader;
    if (ownProps.newsroomCharterHeader) {
      newsroomCharterHeader = ownProps.newsroomCharterHeader;
      charterURI = newsroomCharterHeader.uri;
    } else if (newsroom) {
      newsroomCharterHeader = newsroom.wrapper.data.charterHeader;
      charterURI = newsroom.wrapper.data.charterHeader!.uri;
    }
    if (charterURI) {
      charter = content.get(charterURI) as CharterData;
    }

    return {
      listing: listing || listingRedux,
      network,
      newsroom,
      newsroomCharterHeader,
      charter,
      listingPhaseState: getListingPhaseState(listing),
      challenge,
      challengeState,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(NewsroomsListItemListingRedux);
