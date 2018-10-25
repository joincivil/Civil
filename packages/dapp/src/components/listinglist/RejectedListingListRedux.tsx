import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";

import { ListingSummaryApprovedComponent } from "@joincivil/components";

import ListingList from "./ListingList";
import { EmptyRegistryTabContentComponent, REGISTRY_PHASE_TAB_TYPES } from "./EmptyRegistryTabContent";
import { State } from "../../redux/reducers";

export interface RejectedListingsListReduxReduxProps {
  rejectedListings: Set<string>;
}

class RejectedListingListRedux extends React.Component<RejectedListingsListReduxReduxProps> {
  public render(): JSX.Element {
    if (this.props.rejectedListings.count()) {
      return (
        <ListingList ListingItemComponent={ListingSummaryApprovedComponent} listings={this.props.rejectedListings} />
      );
    }

    return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.REJECTED} />;
  }
}

const mapStateToProps = (state: State): RejectedListingsListReduxReduxProps => {
  const { rejectedListings } = state.networkDependent;

  return {
    rejectedListings,
  };
};

export default connect(mapStateToProps)(RejectedListingListRedux);
