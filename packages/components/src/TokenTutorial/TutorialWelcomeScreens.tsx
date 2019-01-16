import * as React from "react";
import { WelcomeSlide, WelcomeSlideBtns } from "./TokenTutorialStyledComponents";
import { WelcomeScreenContent } from "./WelcomeScreenContent";
import { TokenTutorialLanding } from "./TokenTutorialLanding";

export interface TutorialWelcomeScreensState {
  activeIdx: number;
}

export class TutorialWelcomeScreens extends React.Component<{}, TutorialWelcomeScreensState> {
  public constructor(props: any) {
    super(props);
    this.state = { activeIdx: 0 };
  }

  public render(): JSX.Element {
    const activeIdx = this.state.activeIdx;

    if (activeIdx < WelcomeScreenContent.length) {
      return (
        <WelcomeSlide>
          {WelcomeScreenContent[activeIdx].icon}
          <h2>{WelcomeScreenContent[activeIdx].title}</h2>
          <p>{WelcomeScreenContent[activeIdx].description}</p>
          <WelcomeSlideBtns onClick={() => this.next()}>{WelcomeScreenContent[activeIdx].btn}</WelcomeSlideBtns>
        </WelcomeSlide>
      );
    } else {
      return <TokenTutorialLanding />;
    }
  }

  private next = () => {
    this.setState({ activeIdx: this.state.activeIdx + 1 });
  };
}
