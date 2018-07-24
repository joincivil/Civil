import * as React from "react";
import { connect } from "react-redux";
import * as sanitizeHtml from "sanitize-html";
import styled from "styled-components";
import { State } from "../../reducers";
import { ListingTabHeading } from "./styledComponents";

const StyledChallengeStatementComponent = styled.div`
  margin: 0 0 56px;
`;

export interface ListingChallengeStatementProps {
  listing: string;
}

export interface ListingChallengeStatementReduxProps {
  challengeStatement: any;
}

class ListingChallengeStatement extends React.Component<
  ListingChallengeStatementProps & ListingChallengeStatementReduxProps
> {
  constructor(props: ListingChallengeStatementProps & ListingChallengeStatementReduxProps) {
    super(props);
  }

  public render(): JSX.Element {
    if (this.props.challengeStatement) {
      const parsed = JSON.parse(this.props.challengeStatement);
      const cleanStatement = sanitizeHtml(parsed.statement, {
        allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(["bzz"]),
      });
      return (
        <StyledChallengeStatementComponent>
          <ListingTabHeading>Newsroom listing is under challenge</ListingTabHeading>
          <p>
            Should this newsroom stay on the Civil Registry? Read the challenger’s statement below and vote with your
            CVL tokens.
          </p>
          <ListingTabHeading>Challenge Statement</ListingTabHeading>
          <div dangerouslySetInnerHTML={{ __html: cleanStatement }} />
        </StyledChallengeStatementComponent>
      );
    } else {
      return <div />;
    }
  }
}

const mapToStateToProps = (
  state: State,
  ownProps: ListingChallengeStatementProps,
): ListingChallengeStatementProps & ListingChallengeStatementReduxProps => {
  const { listings, challenges } = state.networkDependent;
  let challengeStatement: any = "";
  if (listings.has(ownProps.listing)) {
    const challengeID = listings.get(ownProps.listing)!.listing.data.challengeID;
    if (!challengeID.isZero()) {
      challengeStatement = challenges.get(challengeID.toString()).challenge.statement;
    }
  }
  return {
    ...ownProps,
    challengeStatement,
  };
};

export default connect(mapToStateToProps)(ListingChallengeStatement);
