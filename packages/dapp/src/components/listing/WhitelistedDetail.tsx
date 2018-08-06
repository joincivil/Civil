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
  handleSubmitChallenge?(): void;
}

class WhitelistedDetail extends React.Component<
  ListingDetailPhaseCardComponentProps & WhitelistedCardProps & WhitelistedCardSubmitChallengeProps & DispatchProp<any>
> {
  public async componentDidMount(): Promise<void> {
    this.props.dispatch!(await setupListingWhitelistedSubscription(this.props.listingAddress));
  }

  public render(): JSX.Element {
    return (
      <>
        <WhitelistedCard
          whitelistedTimestamp={this.props.whitelistedTimestamp}
          handleSubmitChallenge={this.props.handleSubmitChallenge}
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
