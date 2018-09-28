import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { EthAddress } from "@joincivil/core";
import { ListingDetailPhaseCardComponentProps, WhitelistedCard, WhitelistedCardProps } from "@joincivil/components";
import { State } from "../../reducers";
import { setupListingWhitelistedSubscription } from "../../actionCreators/listings";
import { makeGetLatestWhitelistedTimestamp } from "../../selectors";
import { ListingContainerProps } from "../utility/HigherOrderComponents";

export interface WhitelistedCardSubmitChallengeProps {
  listingAddress: EthAddress;
  constitutionURI?: string;
}

class WhitelistedDetail extends React.Component<
  ListingDetailPhaseCardComponentProps & WhitelistedCardProps & WhitelistedCardSubmitChallengeProps & DispatchProp<any>
> {
  public async componentDidMount(): Promise<void> {
    this.props.dispatch!(await setupListingWhitelistedSubscription(this.props.listingAddress));
  }

  public render(): JSX.Element {
    const submitChallengeURI = `/listing/${this.props.listingAddress}/submit-challenge`;
    return (
      <>
        <WhitelistedCard
          whitelistedTimestamp={this.props.whitelistedTimestamp}
          submitChallengeURI={submitChallengeURI}
          constitutionURI={this.props.constitutionURI}
        />
      </>
    );
  }
}

const makeMapStateToProps = () => {
  const getLatestWhitelistedTimestamp = makeGetLatestWhitelistedTimestamp();

  const mapStateToProps = (
    state: State,
    ownProps: WhitelistedCardSubmitChallengeProps & ListingContainerProps,
  ): WhitelistedCardSubmitChallengeProps & WhitelistedCardProps => {
    const whitelistedTimestamp = getLatestWhitelistedTimestamp(state, ownProps);
    return { ...ownProps, whitelistedTimestamp };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(WhitelistedDetail);
