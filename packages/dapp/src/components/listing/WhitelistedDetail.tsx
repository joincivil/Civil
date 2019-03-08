import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import { EthAddress } from "@joincivil/core";
import { ListingDetailPhaseCardComponentProps, WhitelistedCard, WhitelistedCardProps } from "@joincivil/components";
import { FAQ_BASE_URL, routes, links } from "../../constants";
import { State } from "../../redux/reducers";
import { setupListingWhitelistedSubscription } from "../../redux/actionCreators/listings";
import { makeGetLatestWhitelistedTimestamp } from "../../selectors";
import { ListingContainerProps } from "../utility/HigherOrderComponents";

export interface WhitelistedCardSubmitChallengeProps {
  listingAddress: EthAddress;
  constitutionURI?: string;
  onMobileTransactionClick(): any;
}

class WhitelistedDetail extends React.Component<
  ListingDetailPhaseCardComponentProps & WhitelistedCardProps & WhitelistedCardSubmitChallengeProps & DispatchProp<any>
> {
  public async componentDidMount(): Promise<void> {
    this.props.dispatch!(await setupListingWhitelistedSubscription(this.props.listingAddress));
  }

  public render(): JSX.Element {
    const submitChallengeURI = formatRoute(routes.SUBMIT_CHALLENGE, { listingAddress: this.props.listing.address });

    return (
      <>
        <WhitelistedCard
          whitelistedTimestamp={this.props.whitelistedTimestamp}
          submitChallengeURI={submitChallengeURI}
          constitutionURI={this.props.constitutionURI}
          learnMoreURL={`${FAQ_BASE_URL}${links.FAQ_REGISTRY}`}
          faqURL={`${FAQ_BASE_URL}${links.FAQ_REGISTRY}`}
          onMobileTransactionClick={this.props.onMobileTransactionClick}
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
