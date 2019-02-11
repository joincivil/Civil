import * as React from "react";
import {
  TutorialLandingContainer,
  TutorialIntro,
  TutorialTime,
  TutorialSkipSection,
  TakeQuizBtn,
  TutorialTopic,
  LaunchTopic,
  TopicProgress,
  TutorialLandingProgressBars,
  TutorialLandingProgressBar,
} from "./TokenTutorialStyledComponents";
import { ClockIcon } from "../icons/ClockIcon";
import {
  TutorialIntroText,
  TutorialTimeText,
  TutorialSkipText,
  TutorialSkipBtnText,
  TutorialProgressText,
} from "./TokenTutorialTextComponents";
import { TokenTutorialQuiz } from "./TokenTutorialQuiz";
import { TutorialContent } from "./TutorialContent";
import { DisclosureArrowIcon } from "../icons/DisclosureArrowIcon";

export interface TokenTutorialLandingProps {
  handleClose(): void;
}

export interface TokenTutorialLandingStates {
  activeTutorialIdx: number;
  tutorialActive: boolean;
  skipTutorial: boolean;
  activeSection: string;
}

export class TokenTutorialLanding extends React.Component<TokenTutorialLandingProps, TokenTutorialLandingStates> {
  public constructor(props: any) {
    super(props);
    this.state = { activeTutorialIdx: 0, tutorialActive: false, skipTutorial: false, activeSection: "intro" };
  }

  public render(): JSX.Element {
    if (this.state.tutorialActive) {
      return (
        <TokenTutorialQuiz
          topicIdx={this.state.activeTutorialIdx}
          totalTopics={TutorialContent.length - 1}
          skipTutorial={this.state.skipTutorial}
          activeSection={this.state.activeSection}
          handleClose={this.props.handleClose}
        />
      );
    }

    return (
      <TutorialLandingContainer>
        <TutorialIntro>
          <TutorialIntroText />
          <TutorialTime>
            <ClockIcon />
            <TutorialTimeText />
          </TutorialTime>
        </TutorialIntro>

        <TutorialSkipSection>
          <TutorialSkipText />
          <TakeQuizBtn onClick={() => this.skipTutorial()}>
            <TutorialSkipBtnText />
          </TakeQuizBtn>
        </TutorialSkipSection>

        {TutorialContent.map((topic, idx) => (
          <TutorialTopic key={idx}>
            <LaunchTopic onClick={() => this.openTutorial(idx)}>
              <div>
                {topic.icon}
                <h3>{topic.name}</h3>
                <p>{topic.description}</p>
              </div>
              <DisclosureArrowIcon />
            </LaunchTopic>
            <TopicProgress>
              <TutorialProgressText questions={topic.questions.length} />
              <TutorialLandingProgressBars>
                {topic.questions.map((x, i) => <TutorialLandingProgressBar key={i} />)}
                <b>0/{topic.questions.length}</b>
              </TutorialLandingProgressBars>
            </TopicProgress>
          </TutorialTopic>
        ))}
      </TutorialLandingContainer>
    );
  }

  private skipTutorial = () => {
    this.setState({ activeTutorialIdx: 0, tutorialActive: true, skipTutorial: true, activeSection: "quiz" });
  };

  private openTutorial = (idx: number) => {
    this.setState({ activeTutorialIdx: idx, tutorialActive: true });
  };
}
