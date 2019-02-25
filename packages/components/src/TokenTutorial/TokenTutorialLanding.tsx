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
  TutorialProgressText,
} from "./TokenTutorialTextComponents";
import { TokenTutorialQuiz } from "./TokenTutorialQuiz";
import { TutorialContent } from "./TutorialContent";
import { DisclosureArrowIcon } from "../icons/DisclosureArrowIcon";
import { updateQuizPayload } from "@joincivil/utils";

export interface TokenTutorialLandingProps {
  isQuizStarted: boolean;
  quizPayload: {};
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
          handleSaveQuizState={this.saveQuizState}
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
            {this.props.isQuizStarted ? "Continue" : "Take the quiz"}
          </TakeQuizBtn>
        </TutorialSkipSection>

        {TutorialContent.map((topic, idx) => {
          const { lastSlideIdx } = this.getTopicStatus(this.props.quizPayload, topic);

          // TODO(jorgelo): What do we do when isComplete is true (this means that this topic has been completed)
          // TODO(jorgelo): lastSlideIdx is the last slide that was completed correctly. Should we jump the user to that last slide?

          return (
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
                <TutorialProgressText questions={topic.questions.length - lastSlideIdx} />
                <TutorialLandingProgressBars>
                  {topic.questions.map((question, questionIdx) => {
                    if (lastSlideIdx > 0 && questionIdx <= lastSlideIdx - 1) {
                      return <TutorialLandingProgressBar key={questionIdx} completed={true} />;
                    }
                    return <TutorialLandingProgressBar key={questionIdx} />;
                  })}
                  <b>
                    {lastSlideIdx}/{topic.questions.length}
                  </b>
                </TutorialLandingProgressBars>
              </TopicProgress>
            </TutorialTopic>
          );
        })}
      </TutorialLandingContainer>
    );
  }

  private saveQuizState = (topic: string, lastSlideIdx: number, isComplete: boolean): void => {
    const { quizPayload } = this.props;

    if (isComplete) {
      // This bad boy loops through all the current topics and checks to see if any topic has not been completed. If complete set the quizStatus.
      let allQuizesComplete: boolean = true;

      TutorialContent.forEach(t => {
        if (!allQuizesComplete) {
          return;
        }

        if (t.quizId === topic) {
          allQuizesComplete = isComplete;
          return;
        }

        allQuizesComplete = (quizPayload as any)[t.quizId] && (quizPayload as any)[t.quizId].isComplete;
      });
      updateQuizPayload({ [topic]: { isComplete, lastSlideIdx } }, allQuizesComplete ? "complete" : undefined);
    } else {
      updateQuizPayload({ [topic]: { isComplete, lastSlideIdx } });
    }
  };

  private getTopicStatus(quizPayload: any, topic: any): { isComplete: boolean; lastSlideIdx: number } {
    if (!quizPayload || !quizPayload[topic.quizId]) {
      return { isComplete: false, lastSlideIdx: 0 };
    }

    const isComplete = quizPayload[topic.quizId].isComplete || false;
    const lastSlideIdx = quizPayload[topic.quizId].lastSlideIdx + 1 || 0;

    return { isComplete, lastSlideIdx };
  }

  private skipTutorial = () => {
    this.setState({ activeTutorialIdx: 0, tutorialActive: true, skipTutorial: true, activeSection: "quiz" });
  };

  private openTutorial = (idx: number) => {
    this.setState({ activeTutorialIdx: idx, tutorialActive: true });
  };
}
