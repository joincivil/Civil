import * as React from "react";
import { formatRoute } from "react-router-named-routes";
import { urlConstants as links } from "@joincivil/utils";
import { ListingDetailPhaseCardComponentProps, WhitelistedCard, WhitelistedCardProps } from "@joincivil/components";

import { routes } from "../../constants";
import { BigNumber } from "@joincivil/typescript-types";
import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";

export interface WhitelistedCardSubmitChallengeProps {
  listingId: string;
  constitutionURI?: string;
  approvalDate?: BigNumber;
  onMobileTransactionClick(): any;
}

class WhitelistedDetail extends React.Component<
  ListingDetailPhaseCardComponentProps & WhitelistedCardProps & WhitelistedCardSubmitChallengeProps
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  public render(): JSX.Element {
    const submitChallengeURI = formatRoute(routes.SUBMIT_CHALLENGE, { listingAddress: this.props.listingId });
    return (
      <>
        <WhitelistedCard
          whitelistedTimestamp={this.props.approvalDate!.toNumber()}
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

export default WhitelistedDetail;
