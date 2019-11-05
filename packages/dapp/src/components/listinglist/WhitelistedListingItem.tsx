import * as React from "react";
import { ListingListItemOwnProps, ListingListItemReduxProps, ListingItemBaseComponent } from "./ListingListItem";
import { BigNumber } from "@joincivil/typescript-types";

export interface WhitelistedCardProps {
  approvalDate?: BigNumber;
}

const WhitelistedListingItem = (props: ListingListItemOwnProps & ListingListItemReduxProps & WhitelistedCardProps) => {
  return <ListingItemBaseComponent {...props} whitelistedTimestamp={props.approvalDate!.toNumber()} />;
};

export default WhitelistedListingItem;
