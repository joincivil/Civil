import * as React from "react";
import { formatRoute } from "react-router-named-routes";
import { DashboardActivityItemTask } from "@joincivil/components";

import { routes } from "../../../constants";
import { MyTasksItemOwnProps, MyTasksItemReduxProps } from "./MyTasksItemTypes";
import MyTasksItemPhaseCountdown from "../MyTasksItemPhaseCountdown";
import DashboardItemChallengeResults from "../ChallengeSummary";

const MyTasksItemComponent: React.FunctionComponent<MyTasksItemOwnProps & MyTasksItemReduxProps> = props => {
  const { listingAddress: address, listing, newsroom, charter, challengeID, userChallengeData, challengeState } = props;

  if (!userChallengeData || !challengeState) {
    return <></>;
  }

  const { canUserCollect, canUserRescue, didUserCommit } = userChallengeData;
  const { inCommitPhase, inRevealPhase } = challengeState;

  if (listing && listing.data && newsroom) {
    const newsroomData = newsroom.wrapper.data;
    const listingDetailURL = formatRoute(routes.LISTING, { listingAddress: address });
    let viewDetailURL = listingDetailURL;
    const title = `${newsroomData.name} Challenge #${challengeID}`;
    const logoUrl = charter && charter.logoUrl;

    if (canUserCollect || canUserRescue) {
      viewDetailURL = formatRoute(routes.CHALLENGE, { listingAddress: address, challengeID });
    }

    const viewProps = {
      title,
      logoUrl,
      viewDetailURL,
    };

    if (canUserCollect || canUserRescue || didUserCommit) {
      return (
        <DashboardActivityItemTask {...viewProps}>
          <MyTasksItemPhaseCountdown {...props} />
          {!inCommitPhase &&
            !inRevealPhase && (
              <DashboardItemChallengeResults
                listingDetailURL={listingDetailURL}
                viewDetailURL={viewDetailURL}
                {...props}
              />
            )}
        </DashboardActivityItemTask>
      );
    }
  }

  return <></>;
};

export default MyTasksItemComponent;
