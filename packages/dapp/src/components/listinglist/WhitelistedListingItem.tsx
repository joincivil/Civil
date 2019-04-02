import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../redux/reducers";
import { makeGetLatestWhitelistedTimestamp } from "../../selectors";
import { ListingListItemOwnProps, ListingListItemReduxProps, ListingItemBaseComponent } from "./ListingListItem";
import BigNumber from "bignumber.js";

export interface WhitelistedCardProps {
  approvalDate?: BigNumber;
}
export interface WhitelistedCardReduxProps {
  whitelistedTimestamp?: number;
}

const WhitelistedListingItem = (
  props: ListingListItemOwnProps & ListingListItemReduxProps & WhitelistedCardProps & WhitelistedCardReduxProps,
) => {
  return <ListingItemBaseComponent {...props} whitelistedTimestamp={props.whitelistedTimestamp} />;
};

const makeMapStateToProps = () => {
  const getLatestWhitelistedTimestamp = makeGetLatestWhitelistedTimestamp();

  const mapStateToProps = (
    state: State,
    ownProps: ListingListItemOwnProps & WhitelistedCardProps,
  ): ListingListItemOwnProps & WhitelistedCardProps & WhitelistedCardReduxProps => {
    let whitelistedTimestamp;
    if (ownProps.approvalDate) {
      whitelistedTimestamp = ownProps.approvalDate.toNumber();
    } else {
      whitelistedTimestamp = getLatestWhitelistedTimestamp(state, ownProps);
    }
    return {
      whitelistedTimestamp,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(WhitelistedListingItem);
