import * as React from "react";
import { ListingDetailHeader, ListingDetailHeaderProps } from "@joincivil/components";
import { EthAddress, ListingWrapper, NewsroomWrapper, CharterData } from "@joincivil/core";
import { getFormattedTokenBalance, getFormattedEthAddress, getEtherscanBaseURL } from "@joincivil/utils";

export interface ListingHeaderProps {
  newsroom: NewsroomWrapper;
  listing: ListingWrapper;
  network: string;
  userAccount?: EthAddress;
  listingPhaseState: any;
  charter?: CharterData;
}

function getRegistryURLData(listingPhaseState: any): [string, string] {
  let urlArg = "";
  let label = "Registry";

  if (listingPhaseState.isWhitelisted) {
    urlArg = "approved";
    label = "Approved Newsrooms";
  } else if (listingPhaseState.isInApplication) {
    urlArg = "in-progress/in-application";
    label = "Newsroom Applications";
  } else if (
    listingPhaseState.inChallengeCommitVotePhase ||
    listingPhaseState.inChallengeRevealPhase ||
    listingPhaseState.isAwaitingAppealRequest
  ) {
    urlArg = "in-progress/under-challenge";
    label = "Newsrooms Under Challenge";
  } else if (listingPhaseState.isAwaitingAppealJudgement || listingPhaseState.isAwaitingAppealChallenge) {
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
  const registryURLData = getRegistryURLData(props.listingPhaseState);
  const registryURLParameter = registryURLData[0];
  const registryLinkText = registryURLData[1];
  const etherscanBaseURL = getEtherscanBaseURL(props.network);

  const headerProps: ListingDetailHeaderProps = {
    listingAddress: getFormattedEthAddress(props.listing.address),
    newsroomName: props.newsroom.data.name,
    charter: props.charter,
    owner: getFormattedEthAddress(props.listing.data.owner),
    etherscanBaseURL,
    registryURL: `/registry/${registryURLParameter}`,
    registryLinkText,
    unstakedDeposit: getFormattedTokenBalance(props.listing.data.unstakedDeposit),
    ...props.listingPhaseState,
  };
  return <>{props.listing.data && <ListingDetailHeader {...headerProps} />}</>;
};

export default ListingHeader;
