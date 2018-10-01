import * as React from "react";
import { ListingDetailHeader, ListingDetailHeaderProps } from "@joincivil/components";
import { EthAddress, ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import { getFormattedTokenBalance } from "@joincivil/utils";

export interface ListingHeaderProps {
  newsroom: NewsroomWrapper;
  listing: ListingWrapper;
  userAccount?: EthAddress;
  listingPhaseState: any;
}

function getRegistryURLData(listingPhaseState: any): [string, string] {
  let urlArg = "";
  let label = "Registry";

  if (listingPhaseState.isWhitelisted) {
    urlArg = "whitelisted";
    label = "Whitelisted Newsrooms";
  } else if (listingPhaseState.isInApplication) {
    urlArg = "in-progress/in-application";
    label = "Whitelisted Newsrooms";
  } else if (
    listingPhaseState.inChallengeCommitVotePhase ||
    listingPhaseState.inChallengeRevealPhase ||
    listingPhaseState.isAwaitingAppealRequest
  ) {
    urlArg = "in-progress/under-challenge";
    label = "Newsrooms Under Challenge";
  } else if (listingPhaseState.isAwaitingAppealJudgment || listingPhaseState.isAwaitingAppealChallenge) {
    urlArg = "in-progress/under-appeal";
    label = "Newsrooms Under Appeal";
  } else if (listingPhaseState.isInAppealChallengeRevealPhase || listingPhaseState.isInAppealChallengeCommitPhase) {
    urlArg = "in-progress/under-appeal-challenge";
    label = "Newsrooms Under Challenge";
  } else if (
    listingPhaseState.canBeWhitelisted ||
    listingPhaseState.canResolveChallenge ||
    listingPhaseState.canListingAppealBeResolved ||
    listingPhaseState.canListingAppealChallengeBeResolved
  ) {
    urlArg = "in-progress/ready-to-update";
    label = "Newsrooms Ready To Update";
  } else if (listingPhaseState.isRejected) {
    urlArg = "rejected";
    label = "Rejected Newsrooms";
  }

  return [urlArg, label];
}

const ListingHeader: React.SFC<ListingHeaderProps> = props => {
  let newsroomDescription = "";
  if (props.newsroom.data.charter) {
    newsroomDescription = JSON.parse(props.newsroom.data.charter.content.toString()).desc;
  }

  const registryURLData = getRegistryURLData(props.listingPhaseState);
  const registryURLParameter = registryURLData[0];
  const registryLinkText = registryURLData[1];

  const headerProps: ListingDetailHeaderProps = {
    newsroomName: props.newsroom.data.name,
    newsroomDescription,
    owner: props.listing.data.owner,
    registryURL: `/registry/${registryURLParameter}`,
    registryLinkText,
    unstakedDeposit: getFormattedTokenBalance(props.listing.data.unstakedDeposit),
    ...props.listingPhaseState,
  };

  return <>{props.listing.data && <ListingDetailHeader {...headerProps} />}</>;
};

export default ListingHeader;
