import * as React from "react";
import { TutorialWelcomeScreens } from "./TutorialWelcomeScreens";
import { TokenTutorialLanding } from "./TokenTutorialLanding";
import { getCurrentUserQuery } from "@joincivil/utils";
import { Query } from "react-apollo";

export interface TokenTutorialProps {
  handleClose(): void;
}

export interface TokenTutorialState {
  isQuizStarted: boolean;
}

export class TokenTutorial extends React.Component<TokenTutorialProps, TokenTutorialState> {
  public constructor(props: any) {
    super(props);
    this.state = { isQuizStarted: false };
  }

  public render(): JSX.Element {
    return (
      <Query query={getCurrentUserQuery}>
        {({ loading, error, data }) => {
          if (loading) {
            return <></>;
          }

          const quizPayload = loading || error ? {} : data.currentUser.quizPayload;

          if (this.state.isQuizStarted) {
            return <TokenTutorialLanding handleClose={this.props.handleClose} quizPayload={quizPayload} />;
          }

          return <TutorialWelcomeScreens handleClose={this.props.handleClose} quizPayload={quizPayload} />;
        }}
      </Query>
    );
  }
}
