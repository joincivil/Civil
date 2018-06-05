import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { State } from "../../reducers";
import { ListingWrapper, NewsroomWrapper, WrappedChallengeData, UserChallengeData } from "@joincivil/core";
import { NewsroomState } from "../../reducers/newsrooms";
import ListingListItemDescription from "./ListingListItemDescription";
import ListingListItemOwner from "./ListingListItemOwner";
import ListingListItemStatus from "./ListingListItemStatus";
import ListingListItemAction from "./ListingListItemAction";

export interface ListingListItemDivProps {
  even: boolean;
}

const StyledDiv = styled.div`
  display: flex;
  height: 184px;
  width: 100%;
  padding: 15px;
  background-color: ${(props: ListingListItemDivProps): string => (props.even ? "#F4F6FF" : "#FFFFFF")};
`;

export interface ListingListItemOwnProps {
  listingAddress?: string;
  challengeID?: string;
  even: boolean;
  user?: string;
}

export interface ListingListItemReduxProps {
  newsroom: NewsroomState | undefined;
  listing: ListingWrapper | undefined;
  challenge?: WrappedChallengeData;
  userChallengeData?: UserChallengeData;
}

class ListingListItem extends React.Component<ListingListItemOwnProps & ListingListItemReduxProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <StyledDiv even={this.props.even}>
        <ListingListItemDescription listing={this.props.listing!} newsroom={this.props.newsroom!.wrapper} />
        <ListingListItemOwner newsroom={this.props.newsroom!.wrapper} />
        <ListingListItemStatus
          listing={this.props.listing!}
          challenge={this.props.challenge}
          userChallengeData={this.props.userChallengeData}
        />
        <ListingListItemAction listing={this.props.listing!} challenge={this.props.challenge} />
      </StyledDiv>
    );
  }
}

const mapStateToProps = (
  state: State,
  ownProps: ListingListItemOwnProps,
): ListingListItemReduxProps & ListingListItemOwnProps => {
  const { newsrooms, listings, challenges, challengeUserData, user } = state;

  let listingAddress = ownProps.listingAddress;
  let challenge;
  if (!listingAddress && ownProps.challengeID) {
    challenge = challenges.get(ownProps.challengeID);
    listingAddress = challenges.get(ownProps.challengeID)!.listingAddress;
  }

  const newsroom = newsrooms.get(listingAddress!);
  const listing = listings.get(listingAddress!) ? listings.get(listingAddress!).listing : undefined;

  let challengeID = ownProps.challengeID;
  if (!challengeID && listing) {
    challengeID = listing.data.challengeID!.toString();
  }

  let userAcct = ownProps.user;
  if (!userAcct) {
    userAcct = user.account.account;
  }

  let userChallengeData;
  if (challengeID && userAcct) {
    const challengeUserDataMap = challengeUserData.get(challengeID!);
    if (challengeUserDataMap) {
      userChallengeData = challengeUserDataMap.get(userAcct);
    }
  }

  return {
    newsroom,
    listing,
    challenge,
    userChallengeData,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ListingListItem);
