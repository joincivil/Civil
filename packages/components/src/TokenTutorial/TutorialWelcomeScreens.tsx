import * as React from "react";
import { WelcomeSlide, WelcomeSlideBtns, SlideProgress } from "./TokenTutorialStyledComponents";
import { WelcomeScreenContent } from "./WelcomeScreenContent";
import { TokenTutorialLanding } from "./TokenTutorialLanding";
import { TokenTutorialQuiz } from "./TokenTutorialQuiz";
import { colors } from "../styleConstants";

export interface TutorialWelcomeScreensState {
  activeWelcomeIdx: number;
  activeTutorialIdx: number;
  tutorialActive: boolean;
}

export class TutorialWelcomeScreens extends React.Component<{}, TutorialWelcomeScreensState> {
  public constructor(props: any) {
    super(props);
    this.state = { activeWelcomeIdx: 0, activeTutorialIdx: 0, tutorialActive: false };
  }

  public render(): JSX.Element {
    const activeWelcomeIdx = this.state.activeWelcomeIdx;
    const activeTutorialIdx = this.state.activeTutorialIdx;
    const tutorialActive = this.state.tutorialActive;
    let progressColor;

    if (activeWelcomeIdx < WelcomeScreenContent.length) {
      return (
        <WelcomeSlide>
          {WelcomeScreenContent[activeWelcomeIdx].icon}
          <h2>{WelcomeScreenContent[activeWelcomeIdx].title}</h2>
          <p>{WelcomeScreenContent[activeWelcomeIdx].description}</p>
          <SlideProgress>
            {WelcomeScreenContent.map((x, idx) => (
              <svg height="10" width="10">
                {idx === activeWelcomeIdx
                  ? (progressColor = colors.accent.CIVIL_BLUE)
                  : (progressColor = colors.accent.CIVIL_GRAY_4)}
                <circle cx="5" cy="5" r="5" stroke="none" stroke-width="0" fill={progressColor} />
              </svg>
            ))}
          </SlideProgress>
          <WelcomeSlideBtns onClick={() => this.welcomeNext()}>
            {WelcomeScreenContent[activeWelcomeIdx].btn}
          </WelcomeSlideBtns>
        </WelcomeSlide>
      );
    } else if (tutorialActive) {
      return <TokenTutorialQuiz topicIdx={activeTutorialIdx} />;
    }

    return <TokenTutorialLanding onClick={this.openTutorial} />;
  }

  private openTutorial = (ev: any) => {
    // console.log(ev.currentTarget.getAttribute("data-quiz-id"));
    this.setState({ activeTutorialIdx: 0 });
    this.setState({ tutorialActive: true });
  };

  private welcomeNext = () => {
    this.setState({ activeWelcomeIdx: this.state.activeWelcomeIdx + 1 });
  };
}
