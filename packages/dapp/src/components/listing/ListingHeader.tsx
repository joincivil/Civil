import * as React from "react";
import { formatRoute } from "react-router-named-routes";
import { ListingDetailHeader, ListingDetailHeaderProps } from "@joincivil/components";
import { EthAddress, ListingWrapper, NewsroomWrapper, CharterData } from "@joincivil/core";
import {
  getFormattedTokenBalance,
  getFormattedEthAddress,
  getEtherscanBaseURL,
  urlConstants as links,
} from "@joincivil/utils";

import {
  routes,
  TRegistryListingType,
  TRegistrySubListingType,
  registryListingTypes,
  registrySubListingTypes,
} from "../../constants";
export interface ListingHeaderProps {
  newsroom: NewsroomWrapper;
  listing: ListingWrapper;
  network: string;
  userAccount?: EthAddress;
  listingPhaseState: any;
  charter?: CharterData;
}

interface TRegistryURLDataParameters {
  listingType?: TRegistryListingType;
  subListingType?: TRegistrySubListingType;
}

function getRegistryURLData(listingPhaseState: any): [TRegistryURLDataParameters, string] {
  let urlArg: TRegistryURLDataParameters = {};
  let label = "Registry";

  if (listingPhaseState.isWhitelisted) {
    urlArg = { listingType: registryListingTypes.APPROVED };
    label = "Approved Newsrooms";
  } else if (listingPhaseState.isInApplication) {
    urlArg = { listingType: registryListingTypes.IN_PROGRESS, subListingType: registrySubListingTypes.IN_APPLICATION };
    label = "Newsroom Applications";
  } else if (
    listingPhaseState.inChallengeCommitVotePhase ||
    listingPhaseState.inChallengeRevealPhase ||
    listingPhaseState.isAwaitingAppealRequest
  ) {
    urlArg = { listingType: registryListingTypes.IN_PROGRESS, subListingType: registrySubListingTypes.UNDER_CHALLENGE };
    label = "Newsrooms Under Challenge";
  } else if (listingPhaseState.isAwaitingAppealJudgement || listingPhaseState.isAwaitingAppealChallenge) {
    urlArg = { listingType: registryListingTypes.IN_PROGRESS, subListingType: registrySubListingTypes.UNDER_APPEAL };
    label = "Newsrooms Under Appeal";
  } else if (listingPhaseState.isInAppealChallengeRevealPhase || listingPhaseState.isInAppealChallengeCommitPhase) {
    urlArg = {
      listingType: registryListingTypes.IN_PROGRESS,
      subListingType: registrySubListingTypes.UNDER_APPEAL_CHALLENGE,
    };
    label = "Newsrooms Under Challenge";
  } else if (
    listingPhaseState.canBeWhitelisted ||
    listingPhaseState.canResolveChallenge ||
    listingPhaseState.canListingAppealBeResolved ||
    listingPhaseState.canListingAppealChallengeBeResolved
  ) {
    urlArg = { listingType: registryListingTypes.IN_PROGRESS, subListingType: registrySubListingTypes.READY_TO_UPDATE };
    label = "Newsrooms Ready To Update";
  } else if (listingPhaseState.isRejected) {
    urlArg = { listingType: registryListingTypes.REJECTED };
    label = "Rejected Newsrooms";
  }

  return [urlArg, label];
}

const ListingHeader: React.SFC<ListingHeaderProps> = props => {
  const registryURLData = getRegistryURLData(props.listingPhaseState);
  const registryLinkText = registryURLData[1];
  const etherscanBaseURL = getEtherscanBaseURL(props.network);

  const headerProps: ListingDetailHeaderProps = {
    listingAddress: getFormattedEthAddress(props.listing.address),
    newsroomName: props.newsroom.data.name,
    charter: props.charter,
    owner: getFormattedEthAddress(props.listing.data.owner),
    etherscanBaseURL,
    registryURL: formatRoute(routes.REGISTRY_HOME, registryURLData[0]),

    ethInfoModalLearnMoreURL: links.FAQ_WHAT_IS_SMART_CONTRACT,
    registryLinkText,
    unstakedDeposit: getFormattedTokenBalance(props.listing.data.unstakedDeposit),
    ...props.listingPhaseState,
  };
  return <>{props.listing.data && <ListingDetailHeader {...headerProps} />}</>;
};

export default ListingHeader;
