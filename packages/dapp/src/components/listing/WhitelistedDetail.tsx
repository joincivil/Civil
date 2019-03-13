import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import { EthAddress } from "@joincivil/core";
import { FAQ_BASE_URL, urlConstants as links } from "@joincivil/utils";
import { ListingDetailPhaseCardComponentProps, WhitelistedCard, WhitelistedCardProps } from "@joincivil/components";

import { routes } from "../../constants";
import { State } from "../../redux/reducers";
import { setupListingWhitelistedSubscription } from "../../redux/actionCreators/listings";
import { makeGetLatestWhitelistedTimestamp } from "../../selectors";
import { ListingContainerProps } from "../utility/HigherOrderComponents";
import BigNumber from "@joincivil/ethapi/node_modules/bignumber.js";

export interface WhitelistedCardSubmitChallengeProps {
  listingAddress: EthAddress;
  constitutionURI?: string;
  approvalDate?: BigNumber;
  onMobileTransactionClick(): any;
}

export interface WhitelistedCardReduxProps {
  useGraphQL?: boolean;
}

class WhitelistedDetail extends React.Component<
  ListingDetailPhaseCardComponentProps &
    WhitelistedCardProps &
    WhitelistedCardSubmitChallengeProps &
    WhitelistedCardReduxProps &
    DispatchProp<any>
> {
  public async componentDidMount(): Promise<void> {
    if (!this.props.useGraphQL) {
      this.props.dispatch!(await setupListingWhitelistedSubscription(this.props.listingAddress));
    }
  }

  public render(): JSX.Element {
    const submitChallengeURI = formatRoute(routes.SUBMIT_CHALLENGE, { listingAddress: this.props.listingAddress });

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
  ): WhitelistedCardSubmitChallengeProps & WhitelistedCardProps & WhitelistedCardReduxProps => {
    let whitelistedTimestamp;
    if (ownProps.approvalDate) {
      whitelistedTimestamp = ownProps.approvalDate.toNumber();
    } else {
      whitelistedTimestamp = getLatestWhitelistedTimestamp(state, ownProps);
    }
    return { ...ownProps, whitelistedTimestamp, useGraphQL: state.useGraphQL };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(WhitelistedDetail);
