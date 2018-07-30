import * as React from "react";
import { Link } from "react-router-dom";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import ChallengeDetailContainer from "./ChallengeDetail";

const StyledPageOuter = styled.div`
  margin: 0 auto;
  width: 1200px;
`;

const StyledBackLink = styled.div`
  margin: 20px 0;
`;

const StyledChallengeContainer = styled.div`
  display: flex;

  & > div ~ div {
    margin-left: 60px;
  }
`;

export interface ChallengePageProps {
  match: any;
}

class ChallengePage extends React.Component<ChallengePageProps> {
  public render(): JSX.Element {
    const listingAddress = this.props.match.params.listing;
    const listingURL = `/listing/${listingAddress}`;
    const challengeID = new BigNumber(this.props.match.params.challengeID);
    return (
      <StyledPageOuter>
        <StyledBackLink>
          <Link to={listingURL}>&laquo; Back to Listing</Link>
        </StyledBackLink>

        <StyledChallengeContainer>
          <ChallengeDetailContainer
            listingAddress={listingAddress}
            challengeID={challengeID}
            showNotFoundMessage={true}
          />
        </StyledChallengeContainer>
      </StyledPageOuter>
    );
  }
}

export default ChallengePage;
