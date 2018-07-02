import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../reducers";
import { makeGetListingPhaseState, makeGetListing, makeGetListingAddressByChallengeID } from "../../selectors/listings";
import {
  canListingBeChallenged,
  // canBeWhitelisted,
  // canResolveChallenge,
  // isAwaitingAppealJudgment,
  isInApplicationPhase,
  isChallengeInCommitStage,
  isChallengeInRevealStage,
  ListingWrapper,
} from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-manager";
import { ListingSummaryComponent } from "@joincivil/components";

export interface ListingListItemOwnProps {
  listingAddress?: string;
  even: boolean;
  user?: string;
}

export interface ChallengeListingListItemOwnProps {
  challengeID: string;
  even: boolean;
  user?: string;
}

export interface ListingListItemReduxProps {
  newsroom?: NewsroomState;
  listing?: ListingWrapper;
  listingPhaseState?: any;
}

class ListingListItemComponent extends React.Component<ListingListItemOwnProps & ListingListItemReduxProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const { listingAddress: address, listing, newsroom } = this.props;
    if (listing && listing.data && newsroom) {
      const newsroomData = newsroom.wrapper.data;
      const listingData = listing.data;
      let description =
        "This will be a great description someday, but until then The Dude Abides. um i to you you call duder or so thats the dude thats what i am brevity thing um i let me duder or";
      if (newsroom.wrapper.data.charter) {
        description = JSON.parse(newsroom.wrapper.data.charter.content.toString()).desc;
      }
      const listingDetailURL = `/listing/${address}`;
      const isInApplication = isInApplicationPhase(listingData);
      const canBeChallenged = canListingBeChallenged(listingData);
      const inChallengePhase = listingData.challenge && isChallengeInCommitStage(listingData.challenge);
      const inRevealPhase = listingData.challenge && isChallengeInRevealStage(listingData.challenge);
      const appExpiry = listingData.appExpiry && listingData.appExpiry.toNumber();

      const pollData = listingData.challenge && listingData.challenge.poll;
      const commitEndDate = pollData && pollData.commitEndDate.toNumber();
      const revealEndDate = pollData && pollData.revealEndDate.toNumber();

      const listingViewProps = {
        ...newsroomData,
        address,
        description,
        listingDetailURL,
        isInApplication,
        canBeChallenged,
        inChallengePhase,
        inRevealPhase,
        appExpiry,
        commitEndDate,
        revealEndDate,
      };

      return <ListingSummaryComponent {...listingViewProps} />;
    } else {
      return <></>;
    }
  }
}

const makeMapStateToProps = () => {
  const getListingPhaseState = makeGetListingPhaseState();
  const getListing = makeGetListing();

  const mapStateToProps = (
    state: State,
    ownProps: ListingListItemOwnProps,
  ): ListingListItemReduxProps & ListingListItemOwnProps => {
    const { newsrooms } = state;
    const { user } = state.networkDependent;
    const newsroom = ownProps.listingAddress ? newsrooms.get(ownProps.listingAddress) : undefined;
    const listing = getListing(state, ownProps);

    let userAcct = ownProps.user;
    if (!userAcct) {
      userAcct = user.account.account;
    }

    return {
      newsroom,
      listing,
      listingPhaseState: getListingPhaseState(state, ownProps),
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export const ListingListItem = connect(makeMapStateToProps)(ListingListItemComponent);

const makeChallengeMapStateToProps = () => {
  const getListingAddressByChallengeID = makeGetListingAddressByChallengeID();

  const mapStateToProps = (state: State, ownProps: ChallengeListingListItemOwnProps): ListingListItemOwnProps => {
    const listingAddress = getListingAddressByChallengeID(state, ownProps);
    const { even, user } = ownProps;

    return {
      listingAddress,
      even,
      user,
    };
  };

  return mapStateToProps;
};

export class ChallengeListingItemComponent extends React.Component<
  ChallengeListingListItemOwnProps & ListingListItemOwnProps
> {
  public render(): JSX.Element {
    return <ListingListItem {...this.props} />;
  }
}

export const ChallengeListingListItem = connect(makeChallengeMapStateToProps)(ChallengeListingItemComponent);
