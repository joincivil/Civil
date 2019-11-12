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

import MyChallengesItemComponent from "./MyChallengesItemComponent";
import { MyChallengesItemOwnProps, MyChallengesItemWrapperReduxProps } from "./MyChallengesItemTypes";
import MyTasksProposalItemComponent from "../MyTasksProposalItem/MyTasksProposalItemComponent";

const MyChallengesItemWrapper: React.FunctionComponent<
  MyChallengesItemOwnProps & MyChallengesItemWrapperReduxProps
> = props => {
  const {
    queryUserChallengeData,
    queryUserAppealChallengeData,
    content,
    getCharterContent,
    showClaimRewardsTab,
    showRescueTokensTab,
  } = props;

  let challenge = props.challenge;
  let challengeType;
  if (!challenge) {
    if (!queryUserChallengeData) {
      console.error("MyChallengesItemWrapper: no data found");
      return <></>;
    }
    challenge = queryUserChallengeData.challenge;
    if (!challenge) {
      console.error("MyChallengesItemWrapper: no challenge data found on queryUserChallengedata");
      return <></>;
    }
    challengeType = challenge.pollType;
  } else {
    challengeType = challenge.challengeType;
  }

  console.log("challengeType: ", challengeType);
  if (challengeType !== "CHALLENGE" && challengeType !== "PARAMETER_PROPOSAL_CHALLENGE") {
    console.error(
      "MyChallengesItemWrapper: challengeType not supported. challengeType: " +
        challengeType +
        " - challengeID: " +
        challenge.challengeID,
    );
    return <></>;
  }

  const challengeData = transformGraphQLDataIntoChallenge(challenge);

  const userChallengeData = queryUserChallengeData
    ? transfromGraphQLDataIntoUserChallengeData(queryUserChallengeData, challenge)
    : undefined;

  if (challengeData) {
    const listingAddress = challenge!.listingAddress;
    let newsroom;
    let charter;
    let listing;
    let appealUserChallengeData;
    if (listingAddress && challenge.listing) {
      listing = transformGraphQLDataIntoListing(challenge.listing, listingAddress);
      if (listing) {
        newsroom = {
          wrapper: transformGraphQLDataIntoNewsroom(challenge.listing, listingAddress),
          address: listingAddress,
        };
        if (queryUserAppealChallengeData) {
          appealUserChallengeData = transfromGraphQLDataIntoUserChallengeData(
            queryUserAppealChallengeData,
            challenge.appeal.appealChallenge,
          );
        }

        if (newsroom.wrapper && newsroom.wrapper.data.charterHeader) {
          charter = content.get(newsroom.wrapper.data.charterHeader.uri) as CharterData;
          if (!charter) {
            void getCharterContent(newsroom.wrapper.data.charterHeader);
          }
        }
      }
    }

    const wrappedChallenge = {
      listingAddress,
      challengeID: new BigNumber(challenge.challengeID!),
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
    if (listing) {
      const viewProps = {
        challengeID: challenge.challengeID,
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

      return <MyChallengesItemComponent {...viewProps} />;
    } else {
      const viewProps = {
        challengeID: challenge.challengeID,
        challenge: challengeData,
        userChallengeData,
        showClaimRewardsTab,
        showRescueTokensTab,
      };
      return <MyTasksProposalItemComponent {...viewProps} />;
    }
  }
  console.error("uknown error.");
  return <></>;
};

export default MyChallengesItemWrapper;
