import * as React from "react";

import ChallengeDetailContainer from "./ChallengeDetail";
import { PageView } from "../utility/ViewModules";
import { BigNumber } from "bignumber.js";

export interface ChallengePageProps {
  match: any;
}

class ChallengePage extends React.Component<ChallengePageProps> {
  public render(): JSX.Element {
    const listingAddress = this.props.match.params.listing;
    const challengeID = new BigNumber(this.props.match.params.challengeID);
    return (
      <PageView>
        <ChallengeDetailContainer
          listingAddress={listingAddress}
          challengeID={challengeID}
          showNotFoundMessage={true}
        />
      </PageView>
    );
  }
}

export default ChallengePage;
