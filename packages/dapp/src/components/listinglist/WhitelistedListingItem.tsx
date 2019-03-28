import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../redux/reducers";
import { makeGetLatestWhitelistedTimestamp } from "../../selectors";
import { ListingListItemOwnProps, ListingListItemReduxProps, ListingItemBaseComponent } from "./ListingListItem";
import BigNumber from "bignumber.js";
import { history } from "../../redux/store";

export interface WhitelistedCardProps {
  approvalDate?: BigNumber;
}
export interface WhitelistedCardReduxProps {
  whitelistedTimestamp?: number;
}

const WhitelistedListingItem: React.SFC<
  ListingListItemOwnProps & ListingListItemReduxProps & WhitelistedCardProps & WhitelistedCardReduxProps
> = props => {
  return <ListingItemBaseComponent {...props} whitelistedTimestamp={props.whitelistedTimestamp} history={history} />;
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
