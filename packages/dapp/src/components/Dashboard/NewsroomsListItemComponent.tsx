import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import { Link } from "react-router-dom";
import { ListingWrapper, WrappedChallengeData, EthContentHeader, CharterData } from "@joincivil/core";
import { NewsroomState, getNewsroom, getNewsroomMultisigBalance } from "@joincivil/newsroom-signup";
import { DashboardNewsroom, LoadingMessage } from "@joincivil/components";
import { getFormattedTokenBalance, getEtherscanBaseURL, getLocalDateTimeStrings } from "@joincivil/utils";
import { NewsroomWithdraw } from "@joincivil/sdk";

import { routes } from "../../constants";
import { State } from "../../redux/reducers";
import { getListingPhaseState } from "../../selectors";

import { getContent } from "../../redux/actionCreators/newsrooms";

import PhaseCountdown from "./MyTasksItemPhaseCountdown";
import { CivilHelperContext, CivilHelper } from "../../apis/CivilHelper";

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

export interface NewsroomsListItemListingReduxState {
  loading?: boolean;
}

class NewsroomsListItemListingRedux extends React.Component<
  NewsroomsListItemOwnProps & NewsroomsListItemReduxProps & DispatchProp<any>,
  NewsroomsListItemListingReduxState
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  constructor(props: NewsroomsListItemOwnProps & NewsroomsListItemReduxProps & DispatchProp<any>) {
    super(props);
    this.state = {};
  }

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
      let inProgressPhaseDetails;

      switch (true) {
        case isInApplication:
          inProgressPhaseDisplayName = "New Application";
          break;

        case canBeWhitelisted ||
          canResolveChallenge ||
          canListingAppealBeResolved ||
          canListingAppealChallengeBeResolved:
          inProgressPhaseDisplayName = "Ready To Update";
          inProgressPhaseDetails = (
            <Link to={formatRoute(routes.LISTING, { listingAddress })}>
              Please update your newsroom on the Registry
            </Link>
          );
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
      const manageNewsroomURL = formatRoute(routes.MANAGE_NEWSROOM, { newsroomAddress: listingAddress });

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
        manageNewsroomURL,
        newsroomDeposit: getFormattedTokenBalance(listing.data.unstakedDeposit, true),
        etherscanBaseURL,
        boostProceeds: <NewsroomWithdraw newsroomAddress={listingAddress} />,
      };

      return <DashboardNewsroom {...displayProps} {...newsroomStatusOnRegistry} />;
    }

    if (this.state.loading) {
      return <LoadingMessage />;
    }

    return <></>;
  }

  private hydrateData = async (): Promise<void> => {
    const { listing, listingDataRequestStatus, listingAddress, newsroom, charter, newsroomCharterHeader } = this.props;
    const { civil } = this.context;

    if (!listing && !listingDataRequestStatus) {
      console.error("hydrate data hit without listing. listingAddress: ", listingAddress);
      if (!this.state.loading) {
        this.setState({ loading: true });
      }
    }
    if (newsroom) {
      if (newsroom.multisigAddress) {
        this.props.dispatch!(await getNewsroomMultisigBalance(listingAddress!, newsroom.multisigAddress, civil));
      }
    } else if (charter) {
      if (!this.state.loading) {
        this.setState({ loading: true });
      }
      this.props.dispatch!(await getNewsroom(listingAddress!, civil, charter));
    }
    if (newsroomCharterHeader && !charter) {
      if (!this.state.loading) {
        this.setState({ loading: true });
      }
      this.props.dispatch!(await getContent(this.context, newsroomCharterHeader!));
    }
  };
}

const makeMapStateToProps = () => {
  const mapStateToProps = (
    state: State,
    ownProps: NewsroomsListItemOwnProps,
  ): NewsroomsListItemReduxProps & NewsroomsListItemOwnProps => {
    const { listingAddress, listing } = ownProps;
    const { network, newsrooms } = state;
    const { content } = state.networkDependent;
    const newsroom = listingAddress ? newsrooms.get(listingAddress) : undefined;

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
      listing,
      network,
      newsroom,
      newsroomCharterHeader,
      charter,
      listingPhaseState: getListingPhaseState(listing),
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(NewsroomsListItemListingRedux);
