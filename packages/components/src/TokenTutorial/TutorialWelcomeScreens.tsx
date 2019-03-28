import * as React from "react";
import { WelcomeSlide, WelcomeSlideBtns, SlideProgress } from "./TokenTutorialStyledComponents";
import { WelcomeScreenContent } from "./WelcomeScreenContent";
import { colors } from "../styleConstants";

export interface TutorialWelcomeScreensProps {
  handleStartQuiz(): void;
}

export interface TutorialWelcomeScreensState {
  activeWelcomeIdx: number;
}

export class TutorialWelcomeScreens extends React.Component<TutorialWelcomeScreensProps, TutorialWelcomeScreensState> {
  public constructor(props: any) {
    super(props);
    this.state = { activeWelcomeIdx: 0 };
  }

  public render(): JSX.Element {
    const { activeWelcomeIdx } = this.state;
    let progressColor;

    return (
      <WelcomeSlide>
        {WelcomeScreenContent[activeWelcomeIdx].icon}
        <h2>{WelcomeScreenContent[activeWelcomeIdx].title}</h2>
        <p>{WelcomeScreenContent[activeWelcomeIdx].description}</p>
        <SlideProgress>
          {WelcomeScreenContent.map((x, idx) => (
            <svg key={idx} height="10" width="10">
              {idx === activeWelcomeIdx
                ? (progressColor = colors.accent.CIVIL_BLUE)
                : (progressColor = colors.accent.CIVIL_GRAY_4)}
              <circle cx="5" cy="5" r="5" stroke="none" strokeWidth="0" fill={progressColor} />
            </svg>
          ))}
        </SlideProgress>
        <WelcomeSlideBtns onClick={() => this.welcomeNext()}>
          {WelcomeScreenContent[activeWelcomeIdx].btn}
        </WelcomeSlideBtns>
      </WelcomeSlide>
    );
  }

  private welcomeNext = () => {
    const nextSlide = this.state.activeWelcomeIdx + 1;

    if (nextSlide < WelcomeScreenContent.length) {
      this.setState({ activeWelcomeIdx: nextSlide });
    } else {
      this.props.handleStartQuiz();
    }
  };
}
