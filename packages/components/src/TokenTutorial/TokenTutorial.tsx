import * as React from "react";
import { TutorialWelcomeScreens } from "./TutorialWelcomeScreens";
import { TokenTutorialLanding } from "./TokenTutorialLanding";
import { getCurrentUserQuery } from "@joincivil/utils";
import { Query } from "react-apollo";

export interface TokenTutorialProps {
  handleClose(): void;
  onQuizBegin?(): void;
  onQuizComplete?(): void;
}

export interface TokenTutorialStates {
  startQuiz: boolean;
}

export class TokenTutorial extends React.Component<TokenTutorialProps, TokenTutorialStates> {
  public constructor(props: any) {
    super(props);
    this.state = { startQuiz: false };
  }

  public render(): JSX.Element {
    const { onQuizComplete } = this.props;
    return (
      <Query query={getCurrentUserQuery}>
        {({ loading, error, data }) => {
          if (loading) {
            return <></>;
          }

          const quizPayload = loading || error ? {} : data.currentUser.quizPayload;

          if (this.state.startQuiz || this.isQuizStarted(quizPayload)) {
            return (
              <TokenTutorialLanding
                handleClose={this.props.handleClose}
                quizPayload={quizPayload}
                onQuizComplete={onQuizComplete}
              />
            );
          }

          return <TutorialWelcomeScreens handleStartQuiz={this.startQuiz} />;
        }}
      </Query>
    );
  }

  private isQuizStarted = (quizPayload: {}) => {
    return Object.keys(quizPayload).length > 0;
  };

  private startQuiz = () => {
    const { onQuizBegin } = this.props;

    if (onQuizBegin) {
      onQuizBegin();
    }

    this.setState({ startQuiz: true });
  };
}
