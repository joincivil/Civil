import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import { EthAddress } from "@joincivil/core";
import { urlConstants as links } from "@joincivil/utils";
import { ListingDetailPhaseCardComponentProps, WhitelistedCard, WhitelistedCardProps } from "@joincivil/components";

import { routes } from "../../constants";
import { State } from "../../redux/reducers";
import { makeGetLatestWhitelistedTimestamp } from "../../selectors";
import { ListingContainerProps } from "../utility/HigherOrderComponents";
import { BigNumber } from "@joincivil/typescript-types";
import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";

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
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  public render(): JSX.Element {
    const submitChallengeURI = formatRoute(routes.SUBMIT_CHALLENGE, { listingAddress: this.props.listingAddress });

    return (
      <>
        <WhitelistedCard
          whitelistedTimestamp={this.props.whitelistedTimestamp}
          submitChallengeURI={submitChallengeURI}
          constitutionURI={this.props.constitutionURI}
          learnMoreURL={links.FAQ_REGISTRY}
          faqURL={links.FAQ_CHALLENGE_SECTION}
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
