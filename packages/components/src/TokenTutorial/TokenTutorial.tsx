import * as React from "react";
import { TutorialWelcomeScreens } from "./TutorialWelcomeScreens";
import { TokenTutorialLanding } from "./TokenTutorialLanding";

export interface TokenTutorialProps {
  isQuizStarted: boolean;
  quizPayload: {};
  handleClose(): void;
}

export const TokenTutorial: React.StatelessComponent<TokenTutorialProps> = props => {
  if (props.isQuizStarted) {
    return (
      <TokenTutorialLanding handleClose={props.handleClose} quizPayload={props.quizPayload} isQuizStarted={true} />
    );
  }

  return <TutorialWelcomeScreens handleClose={props.handleClose} quizPayload={props.quizPayload} />;
};
