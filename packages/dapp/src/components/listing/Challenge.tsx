import * as React from "react";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import styled from "styled-components/macro";
import { formatRoute } from "react-router-named-routes";

import { routes } from "../../constants";
import ChallengeDetailContainer from "./ChallengeDetail";
import { CHALLENGE_QUERY, transformGraphQLDataIntoChallenge } from "../../helpers/queryTransformations";

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
    const listingAddress = this.props.match.params.listingAddress;
    const listingURL = formatRoute(routes.LISTING, { listingAddress });
    const challengeID = this.props.match.params.challengeID;

    return (
      <Query query={CHALLENGE_QUERY} variables={{ challengeID }}>
        {({ loading, error, data }: any): JSX.Element => {
          if (loading) {
            return <p />;
          }
          if (error) {
            return <p>Error :</p>;
          }
          const challenge = {
            listingAddress,
            challengeID,
            challenge: transformGraphQLDataIntoChallenge(data.challenge)!,
          };
          return (
            <StyledPageOuter>
              <StyledBackLink>
                <Link to={listingURL}>&laquo; Back to Listing</Link>
              </StyledBackLink>

              <StyledChallengeContainer>
                <ChallengeDetailContainer
                  challengeData={challenge}
                  listingAddress={listingAddress}
                  challengeID={challengeID}
                  showNotFoundMessage={true}
                />
              </StyledChallengeContainer>
            </StyledPageOuter>
          );
        }}
      </Query>
    );
  }
}

export default ChallengePage;
