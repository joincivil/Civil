import * as React from "react";
import { formatRoute } from "react-router-named-routes";
import { urlConstants as links } from "@joincivil/utils";

import { routes } from "../../../constants";
import SubmitChallengeGraphQLApolloContainer from "./SubmitChallengeGraphQLApolloContainer";

export interface SubmitChallengePageProps {
  match: any;
  history?: any;
}

const SubmitChallengePage = (props: SubmitChallengePageProps) => {
  const { match, history } = props;
  const listingAddress = match.params.listingAddress;
  const listingURI = formatRoute(routes.LISTING, { listingAddress });
  const governanceGuideURI = links.FAQ_REGISTRY;

  return (
    <SubmitChallengeGraphQLApolloContainer
      listingAddress={listingAddress}
      listingURI={listingURI}
      governanceGuideURI={governanceGuideURI}
      history={history}
    />
  );
};

export default SubmitChallengePage;
