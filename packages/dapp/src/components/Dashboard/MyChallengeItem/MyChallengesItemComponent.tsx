import * as React from "react";
import { formatRoute } from "react-router-named-routes";
import { DashboardActivityItemTask } from "@joincivil/components";

import { routes } from "../../../constants";
import { MyChallengesItemOwnProps, MyChallengesItemReduxProps } from "./MyChallengesItemTypes";
import MyTasksItemPhaseCountdown from "../MyTasksItemPhaseCountdown";
import DashboardItemChallengeResults from "../ChallengeSummary";

const MyChallengesItemComponent: React.FunctionComponent<
  MyChallengesItemOwnProps & MyChallengesItemReduxProps
> = props => {
  const { listingAddress: address, listing, newsroom, charter, challenge, userChallengeData, challengeState } = props;

  if (!challengeState) {
    return <></>;
  }

  let canUserCollect = false;
  let canUserRescue = false;
  if (userChallengeData) {
    canUserCollect = userChallengeData.canUserCollect!;
    canUserRescue = userChallengeData.canUserRescue!;
  }
  const { inCommitPhase, inRevealPhase } = challengeState;

  if (listing && listing.data && newsroom) {
    const newsroomData = newsroom.wrapper.data;
    const listingDetailURL = formatRoute(routes.LISTING, { listingAddress: address });
    let viewDetailURL = listingDetailURL;
    const title = `${newsroomData.name} Challenge #${challenge.challengeID}`;
    const logoUrl = charter && charter.logoUrl;

    if (canUserCollect || canUserRescue) {
      viewDetailURL = formatRoute(routes.CHALLENGE, { listingAddress: address, challengeID: challenge.challengeID });
    }

    const viewProps = {
      title,
      logoUrl,
      viewDetailURL,
    };

    return (
      <DashboardActivityItemTask {...viewProps}>
        <MyTasksItemPhaseCountdown {...props} />
        {!inCommitPhase && !inRevealPhase && (
          <DashboardItemChallengeResults listingDetailURL={listingDetailURL} viewDetailURL={viewDetailURL} {...props} />
        )}
      </DashboardActivityItemTask>
    );
  }

  return <></>;
};

export default MyChallengesItemComponent;
