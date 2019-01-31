import * as React from "react";
import { TutorialWelcomeScreens } from "./TutorialWelcomeScreens";
import { TokenTutorialLanding } from "./TokenTutorialLanding";

export interface TokenTutorialState {
  isQuizStarted: boolean;
}

export class TokenTutorial extends React.Component<{}, TokenTutorialState> {
  public constructor(props: any) {
    super(props);
    this.state = { isQuizStarted: false };
  }

  public render(): JSX.Element {
    if (this.state.isQuizStarted) {
      return <TokenTutorialLanding />;
    }

    return <TutorialWelcomeScreens />;
  }
}
