import * as React from "react";
import { State } from "../../reducers";
import { connect } from "react-redux";
import * as sanitizeHtml from "sanitize-html";

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
      return <div dangerouslySetInnerHTML={{ __html: cleanStatement }} />;
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
