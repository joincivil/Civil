import * as React from "react";
import {
  TutorialLandingContainer,
  TutorialIntro,
  TutorialTime,
  TutorialSkipSection,
  TakeQuizBtn,
  TutorialTopic,
  LaunchTopic,
  LaunchTopicTop,
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
  quizPayload: {};
  handleClose(): void;
}

export interface TokenTutorialLandingStates {
  activeTutorialIdx: number;
  tutorialActive: boolean;
  skipTutorial: boolean;
  activeSection: string;
  quizSlide: number;
}

export class TokenTutorialLanding extends React.Component<TokenTutorialLandingProps, TokenTutorialLandingStates> {
  public constructor(props: any) {
    super(props);
    this.state = {
      activeTutorialIdx: 0,
      tutorialActive: false,
      skipTutorial: false,
      activeSection: "intro",
      quizSlide: 0,
    };
  }

  public render(): JSX.Element {
    let activeTopic = 0;

    if (this.state.tutorialActive) {
      return (
        <TokenTutorialQuiz
          topicIdx={this.state.activeTutorialIdx}
          totalTopics={TutorialContent.length - 1}
          skipTutorial={this.state.skipTutorial}
          activeSection={this.state.activeSection}
          handleClose={this.props.handleClose}
          handleSaveQuizState={this.saveQuizState}
          quizSlide={this.state.quizSlide}
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
          <TakeQuizBtn onClick={() => this.skipTutorial()}>Take the quiz</TakeQuizBtn>
        </TutorialSkipSection>

        {TutorialContent.map((topic, idx) => {
          // lastSlideIdx is the index number, lastSlideNumber is the visible question number
          const { lastSlideIdx, isComplete, isStarted } = this.getTopicStatus(this.props.quizPayload, topic);
          const lastSlideNumber = lastSlideIdx + 1;
          const skipToQuestion = isStarted ? lastSlideNumber : 0;

          if (isComplete) {
            activeTopic++;
          }

          let topicDisabled = true;
          if (activeTopic === idx) {
            topicDisabled = false;
          }

          return (
            <TutorialTopic key={idx}>
              <LaunchTopic onClick={() => this.openTutorial(idx, skipToQuestion)} disabled={topicDisabled}>
                <LaunchTopicTop>
                  <div>
                    {topic.icon}
                    <h3>{topic.name}</h3>
                    <p>{topic.description}</p>
                  </div>
                  <DisclosureArrowIcon />
                </LaunchTopicTop>
                <TopicProgress>
                  <TutorialProgressText questions={topic.questions.length - lastSlideNumber} />
                  <TutorialLandingProgressBars>
                    {topic.questions.map((question, questionIdx) => {
                      if (isStarted && questionIdx <= lastSlideIdx) {
                        return <TutorialLandingProgressBar key={questionIdx} completed={true} />;
                      }
                      return <TutorialLandingProgressBar key={questionIdx} />;
                    })}
                    <b>
                      {lastSlideNumber}/{topic.questions.length}
                    </b>
                  </TutorialLandingProgressBars>
                </TopicProgress>
              </LaunchTopic>
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
      let allQuizzesComplete: boolean = true;

      TutorialContent.forEach(t => {
        if (!allQuizzesComplete) {
          return;
        }

        if (t.quizId === topic) {
          allQuizzesComplete = isComplete;
          return;
        }

        allQuizzesComplete = (quizPayload as any)[t.quizId] && (quizPayload as any)[t.quizId].isComplete;
      });
      updateQuizPayload({ [topic]: { isComplete, lastSlideIdx } }, allQuizzesComplete ? "complete" : undefined);
    } else {
      updateQuizPayload({ [topic]: { isComplete, lastSlideIdx } });
    }
  };

  private getTopicStatus(
    quizPayload: any,
    topic: any,
  ): { isComplete: boolean; lastSlideIdx: number; isStarted: boolean } {
    if (!quizPayload || !quizPayload[topic.quizId]) {
      return { isComplete: false, lastSlideIdx: 0, isStarted: false };
    }

    const isComplete = quizPayload[topic.quizId].isComplete || false;
    const lastSlideIdx = quizPayload[topic.quizId].lastSlideIdx || 0;

    return { isComplete, lastSlideIdx, isStarted: true };
  }

  // Take the quiz straight thru without reading the tutorial
  private skipTutorial = () => {
    this.setState({ activeTutorialIdx: 0, tutorialActive: true, skipTutorial: true, activeSection: "quiz" });
  };

  private openTutorial = (topicNumber: number, lastSlideNumber: number) => {
    this.setState({ activeTutorialIdx: topicNumber, tutorialActive: true, quizSlide: lastSlideNumber });
  };
}
