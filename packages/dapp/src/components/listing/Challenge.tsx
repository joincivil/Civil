import * as React from "react";
import { Link } from "react-router-dom";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import ChallengeDetailContainer from "./ChallengeDetail";
import { State } from "../../redux/reducers";
import { connect } from "react-redux";
import { Query } from "react-apollo";
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
  useGraphQL: boolean;
}

class ChallengePage extends React.Component<ChallengePageProps> {
  public render(): JSX.Element {
    const listingAddress = this.props.match.params.listing;
    const listingURL = `/listing/${listingAddress}`;
    const challengeID = new BigNumber(this.props.match.params.challengeID);
    if (!this.props.useGraphQL) {
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
    } else {
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
}

const mapStateToProps = (state: State, ownProps: ChallengePageProps): ChallengePageProps => {
  const { useGraphQL } = state;
  return {
    ...ownProps,
    useGraphQL,
  };
};

export default connect(mapStateToProps)(ChallengePage);
