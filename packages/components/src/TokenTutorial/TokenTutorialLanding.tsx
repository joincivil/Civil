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
  TutorialProgressBars,
  TutorialProgressBar,
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

export interface TokenTutorialLandingStates {
  activeTutorialIdx: number;
  tutorialActive: boolean;
  skipTutorial: boolean;
  activeSection: string;
}

export class TokenTutorialLanding extends React.Component<{}, TokenTutorialLandingStates> {
  public constructor(props: any) {
    super(props);
    this.state = { activeTutorialIdx: 0, tutorialActive: false, skipTutorial: false, activeSection: "intro" };
  }

  public render(): JSX.Element {
    if (this.state.tutorialActive) {
      return (
        <TokenTutorialQuiz
          topicIdx={this.state.activeTutorialIdx}
          skipTutorial={this.state.skipTutorial}
          activeSection={this.state.activeSection}
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
            <LaunchTopic data-quiz-id={idx} onClick={() => this.openTutorial(idx)}>
              <div>
                {topic.icon}
                <h3>{topic.name}</h3>
                <p>{topic.description}</p>
              </div>
              <DisclosureArrowIcon />
            </LaunchTopic>
            <TopicProgress>
              <TutorialProgressText questions={topic.questions.length} />
              <TutorialProgressBars>
                {topic.questions.map(x => <TutorialProgressBar />)}
                <b>0/{topic.questions.length}</b>
              </TutorialProgressBars>
            </TopicProgress>
          </TutorialTopic>
        ))}
      </TutorialLandingContainer>
    );
  }

  private skipTutorial = () => {
    this.setState({ activeTutorialIdx: 0 });
    this.setState({ tutorialActive: true });
    this.setState({ skipTutorial: true });
    this.setState({ activeSection: "quiz" });
  };

  private openTutorial = (idx: number) => {
    this.setState({ activeTutorialIdx: idx });
    this.setState({ tutorialActive: true });
  };
}
