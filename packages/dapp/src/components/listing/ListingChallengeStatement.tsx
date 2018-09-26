import * as React from "react";
import { connect } from "react-redux";
import * as sanitizeHtml from "sanitize-html";
import styled from "styled-components";
import { State } from "../../reducers";
import { ListingTabHeading } from "./styledComponents";
import { getChallengeByListingAddress } from "../../selectors";

const StyledChallengeStatementComponent = styled.div`
  margin: 0 0 56px;
`;

const StyledChallengeStatementSection = styled.div`
  margin: 0 0 24px;
`;

export interface ListingChallengeStatementProps {
  listing: string;
}

export interface ListingChallengeStatementReduxProps {
  appealStatement: any;
  challengeStatement: any;
}

class ListingChallengeStatement extends React.Component<
  ListingChallengeStatementProps & ListingChallengeStatementReduxProps
> {
  constructor(props: ListingChallengeStatementProps & ListingChallengeStatementReduxProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <>
        {this.renderChallengeStatement()}
        {this.renderAppealStatement()}
      </>
    );
  }

  private renderAppealStatement = (): JSX.Element => {
    if (!this.props.appealStatement) {
      return <></>;
    }
    const parsed = JSON.parse(this.props.appealStatement);
    const summary = parsed.summary;
    const cleanCiteConstitution = sanitizeHtml(parsed.citeConstitution, {
      allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(["bzz"]),
    });
    const cleanDetails = sanitizeHtml(parsed.citeConstitution, {
      allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(["bzz"]),
    });
    return (
      <StyledChallengeStatementComponent>
        <ListingTabHeading>The Civil Council is reviewing a requested appeal.</ListingTabHeading>
        <p>Should the Civil Council overturn this challenge result?</p>
        <ListingTabHeading>Appeal Statement</ListingTabHeading>
        <StyledChallengeStatementSection>{summary}</StyledChallengeStatementSection>
        <StyledChallengeStatementSection>
          <div dangerouslySetInnerHTML={{ __html: cleanCiteConstitution }} />
        </StyledChallengeStatementSection>
        <StyledChallengeStatementSection>
          <div dangerouslySetInnerHTML={{ __html: cleanDetails }} />
        </StyledChallengeStatementSection>
      </StyledChallengeStatementComponent>
    );
  };

  private renderChallengeStatement = (): JSX.Element => {
    if (!this.props.challengeStatement) {
      return <></>;
    }
    const parsed = JSON.parse(this.props.challengeStatement);
    const cleanStatement = sanitizeHtml(parsed.statement, {
      allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(["bzz"]),
    });
    return (
      <StyledChallengeStatementComponent>
        <ListingTabHeading>Newsroom listing is under challenge</ListingTabHeading>
        <p>
          Should this newsroom stay on the Civil Registry? Read the challenger’s statement below and vote with your CVL
          tokens.
        </p>
        <ListingTabHeading>Challenge Statement</ListingTabHeading>
        <div dangerouslySetInnerHTML={{ __html: cleanStatement }} />
      </StyledChallengeStatementComponent>
    );
  };
}

const mapToStateToProps = (
  state: State,
  ownProps: ListingChallengeStatementProps,
): ListingChallengeStatementProps & ListingChallengeStatementReduxProps => {
  const challenge = getChallengeByListingAddress(state, ownProps);
  let challengeStatement: any = "";
  let appealStatement: any = "";
  if (challenge) {
    challengeStatement = challenge.challenge.statement;

    if (challenge.challenge.appeal && challenge.challenge.appeal.statement) {
      appealStatement = challenge.challenge.appeal.statement;
    }
  }
  return {
    ...ownProps,
    challengeStatement,
    appealStatement,
  };
};

export default connect(mapToStateToProps)(ListingChallengeStatement);
