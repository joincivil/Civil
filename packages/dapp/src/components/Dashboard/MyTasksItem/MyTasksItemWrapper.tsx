import * as React from "react";
import { BigNumber } from "@joincivil/typescript-types";
import { CharterData, WrappedChallengeData } from "@joincivil/core";

import {
  transformGraphQLDataIntoListing,
  transformGraphQLDataIntoNewsroom,
  transformGraphQLDataIntoChallenge,
  transfromGraphQLDataIntoUserChallengeData,
} from "../../../helpers/queryTransformations";
import { getChallengeState, getAppealChallengeState } from "../../../selectors";

import MyTasksItemComponent from "./MyTasksItemComponent";
import { MyTasksItemOwnProps, MyTasksItemWrapperReduxProps } from "./MyTasksItemTypes";

const MyTasksItemWrapper: React.FunctionComponent<MyTasksItemOwnProps & MyTasksItemWrapperReduxProps> = props => {
  const {
    challengeID,
    queryUserChallengeData,
    queryUserAppealChallengeData,
    content,
    getCharterContent,
    showClaimRewardsTab,
    showRescueTokensTab,
  } = props;

  if (!queryUserChallengeData) {
    console.error("MyTasksItemWrapper: no queryUserChallengeData found");
    return <></>;
  }
  const { pollType, challenge } = queryUserChallengeData;
  if (!pollType) {
    console.error("MyTasksItemWrapper: no pollType found");
    return <></>;
  }

  if (pollType === "CHALLENGE") {
    if (challenge) {
      const challengeData = transformGraphQLDataIntoChallenge(challenge);
      const userChallengeData = transfromGraphQLDataIntoUserChallengeData(queryUserChallengeData, challenge);
      if (challengeData) {
        const listingAddress = challenge!.listingAddress;
        if (listingAddress && challenge.listing) {
          const listing = transformGraphQLDataIntoListing(challenge.listing, listingAddress);
          if (listing) {
            const newsroom = {
              wrapper: transformGraphQLDataIntoNewsroom(challenge.listing, listingAddress),
              address: listingAddress,
            };
            let appealUserChallengeData;
            if (queryUserAppealChallengeData) {
              appealUserChallengeData = transfromGraphQLDataIntoUserChallengeData(
                queryUserAppealChallengeData,
                challenge.appeal.appealChallenge,
              );
            }

            let charter;
            if (newsroom.wrapper && newsroom.wrapper.data.charterHeader) {
              charter = content.get(newsroom.wrapper.data.charterHeader.uri) as CharterData;
              if (!charter) {
                void getCharterContent(newsroom.wrapper.data.charterHeader);
              }
            }

            const wrappedChallenge = {
              listingAddress,
              challengeID: new BigNumber(props.challengeID!),
              challenge: challengeData,
            };

            let appeal;
            let appealChallenge;
            let appealChallengeState;
            let appealChallengeID;

            if (challengeData) {
              appeal = challengeData.appeal;

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
              listing,
              newsroom,
              charter,
              challenge: wrappedChallenge,
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
          }
        } else {
          console.log("no listing for challenge: ", challenge);
        }
      }
    }
  }
  console.error("MyTasksItemWrapper: pollType !== CHALLENGE");
  return <></>;
};

export default MyTasksItemWrapper;
