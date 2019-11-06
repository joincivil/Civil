import * as React from "react";
import { Query } from "react-apollo";
import { BigNumber } from "@joincivil/typescript-types";
import { CharterData, WrappedChallengeData } from "@joincivil/core";

import {
  CHALLENGE_QUERY,
  LISTING_QUERY,
  transformGraphQLDataIntoListing,
  transformGraphQLDataIntoNewsroom,
  transformGraphQLDataIntoChallenge,
  transfromGraphQLDataIntoUserChallengeData,
} from "../../../helpers/queryTransformations";
import { getChallengeState, getAppealChallengeState } from "../../../selectors";

import MyTasksItemComponent from "./MyTasksItemComponent";
import { MyTasksItemOwnProps, MyTasksItemWrapperReduxProps } from "./MyTasksItemTypes";

const MyTasksItemApolloQueryWrapper: React.FunctionComponent<
  MyTasksItemOwnProps & MyTasksItemWrapperReduxProps
> = props => {
  const {
    challengeID,
    queryUserChallengeData,
    queryUserAppealChallengeData,
    content,
    getCharterContent,
    showClaimRewardsTab,
    showRescueTokensTab,
  } = props;
  // return (
    // <Query query={CHALLENGE_QUERY} variables={{ challengeID }}>
    //   {({ loading, error, data: graphQLChallengeData }: any) => {
    //     if (error || loading || !graphQLChallengeData) {
    //       return <></>;f
    //     }
    //     const listingAddress = graphQLChallengeData.challenge.listingAddress;

    //     return (
    //       <Query query={LISTING_QUERY} variables={{ addr: listingAddress }}>
    //         {({ loading: listingLoading, error: listingError, data: listingData }: any): JSX.Element => {
    //           if (listingLoading || listingError || !listingData || !listingData.listing) {
    //             return <></>;
    //           }

  if (!queryUserChallengeData)  {
    return <></>;
  }
  const userChallengeData = transfromGraphQLDataIntoUserChallengeData(
    queryUserChallengeData,
    queryUserChallengeData!.challenge,
  );
  const challenge = transformGraphQLDataIntoChallenge(queryUserChallengeData!.challenge);
  if (!queryUserChallengeData!.challenge!.listing) {
    return  <></>;
  }

  const listingAddress = queryUserChallengeData!.challenge!.listing!.listingAddress;
  // const listing = transformGraphQLDataIntoListing(queryUserChallengeData!.challenge!.listing, listingAddress);
  // const newsroom = { wrapper: transformGraphQLDataIntoNewsroom(queryUserChallengeData!.challenge!.listing, listingAddress) };
  const graphqlListing = queryUserChallengeData!.challenge!.listing
  const newsroomName = graphqlListing!.name;

  let appealUserChallengeData;
  if (queryUserAppealChallengeData) {
    appealUserChallengeData = transfromGraphQLDataIntoUserChallengeData(
      queryUserAppealChallengeData,
      queryUserChallengeData!.challenge!.appeal!.appealChallenge,
    );
  }

  const charter = undefined;
  // if (newsroom.wrapper && newsroom.wrapper.data.charterHeader) {
  //   charter = content.get(newsroom.wrapper.data.charterHeader.uri) as CharterData;
  //   if (!charter) {
  //     void getCharterContent(newsroom.wrapper.data.charterHeader);
  //   }
  // }

  const wrappedChallenge = {
    listingAddress,
    challengeID: new BigNumber(props.challengeID!),
    challenge,
  };

  let appeal;
  let appealChallenge;
  let appealChallengeState;
  let appealChallengeID;

  if (challenge) {
    appeal = challenge.appeal;

    if (appeal) {
      appealChallenge = appeal.appealChallenge;
      if (appealChallenge) {
        appealChallengeID = appeal.appealChallengeID.toString();
        appealChallengeState = getAppealChallengeState(appealChallenge);
      }
    }
  }

  const challengeState = getChallengeState(wrappedChallenge as WrappedChallengeData);
  const viewProps = {
      challengeID,
      listingAddress,
      // listing,
      newsroomName,
      charter,
      challenge: wrappedChallenge!,
      challengeState,
      userChallengeData,
      appeal,
      appealChallengeID,
      appealChallenge,
      appealChallengeState,
      appealUserChallengeData,
      showClaimRewardsTab,
      showRescueTokensTab,
    };

  return <MyTasksItemComponent {...viewProps} />;
    //         }}
    //       </Query>
    //     );
    //   }}
    // </Query>
  // );
};

export default MyTasksItemApolloQueryWrapper;
