import * as React from "react";
import { WelcomeSlide, WelcomeSlideBtns, SlideProgress } from "./TokenTutorialStyledComponents";
import { WelcomeScreenContent } from "./WelcomeScreenContent";
import { TokenTutorialLanding } from "./TokenTutorialLanding";
import { colors } from "../styleConstants";

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
    let progressColor;

    if (activeIdx < WelcomeScreenContent.length) {
      return (
        <WelcomeSlide>
          {WelcomeScreenContent[activeIdx].icon}
          <h2>{WelcomeScreenContent[activeIdx].title}</h2>
          <p>{WelcomeScreenContent[activeIdx].description}</p>
          <SlideProgress>
            {WelcomeScreenContent.map((x, idx) => (
              <svg height="10" width="10">
                {idx === activeIdx
                  ? (progressColor = colors.accent.CIVIL_BLUE)
                  : (progressColor = colors.accent.CIVIL_GRAY_4)}
                <circle cx="5" cy="5" r="5" stroke="none" stroke-width="0" fill={progressColor} />
              </svg>
            ))}
          </SlideProgress>
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
