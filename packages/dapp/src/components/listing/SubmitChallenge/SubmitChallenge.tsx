import * as React from "react";
import { connect } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import { urlConstants as links } from "@joincivil/utils";

import { routes } from "../../../constants";
import { State } from "../../../redux/reducers";
import SubmitChallengeReduxContainer from "./SubmitChallengeReduxContainer";
import SubmitChallengeGraphQLApolloContainer from "./SubmitChallengeGraphQLApolloContainer";

export interface SubmitChallengePageProps {
  match: any;
  history?: any;
}

export interface SubmitChallengePageReduxProps {
  useGraphQL?: boolean;
}

const SubmitChallengePage = (props: SubmitChallengePageProps & SubmitChallengePageReduxProps) => {
  const { match, history, useGraphQL } = props;
  const listingAddress = match.params.listingAddress;
  const listingURI = formatRoute(routes.LISTING, { listingAddress });
  const governanceGuideURI = links.FAQ_REGISTRY;

  if (useGraphQL) {
    return (
      <SubmitChallengeGraphQLApolloContainer
        listingAddress={listingAddress}
        listingURI={listingURI}
        governanceGuideURI={governanceGuideURI}
        history={history}
      />
    );
  }
  return (
    <SubmitChallengeReduxContainer
      listingAddress={listingAddress}
      listingURI={listingURI}
      governanceGuideURI={governanceGuideURI}
      history={history}
    />
  );
};

const mapStateToProps = (
  state: State,
  ownProps: SubmitChallengePageProps,
): SubmitChallengePageProps & SubmitChallengePageReduxProps => {
  const { useGraphQL } = state;

  return {
    useGraphQL,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(SubmitChallengePage);
