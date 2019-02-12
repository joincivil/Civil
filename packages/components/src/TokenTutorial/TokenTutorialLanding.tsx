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
            <TutorialSkipBtnText />
          </TakeQuizBtn>
        </TutorialSkipSection>

        {TutorialContent.map((topic, idx) => {
          console.log("???", this.props.quizPayload, this.props);
          const { isComplete, lastSlideIdx } = this.getTopicStatus(this.props.quizPayload, topic);

          // TODO(jorgelo): We should do something with these.
          console.log("For topic" + topic.name, { isComplete, lastSlideIdx });

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
                  {topic.questions.map((x, i) => <TutorialLandingProgressBar key={i} />)}
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
          console.log("state1", t.quizId, "skip");
          return;
        }

        if (t.quizId === topic) {
          allQuizesComplete = isComplete;

          console.log("state2", t.quizId, { isComplete });
          return;
        }

        allQuizesComplete = (quizPayload as any)[t.quizId] && (quizPayload as any)[t.quizId].isComplete;

        console.log("state3", t.quizId, { allQuizesComplete, quizPayload });
      });

      console.log("state4", { isComplete, allQuizesComplete });

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
    const lastSlideIdx = quizPayload[topic.quizId].lastSlideIdx || 0;

    return { isComplete, lastSlideIdx };
  }

  private skipTutorial = () => {
    this.setState({ activeTutorialIdx: 0, tutorialActive: true, skipTutorial: true, activeSection: "quiz" });
  };

  private openTutorial = (idx: number, slideIdx: number = 0) => {
    this.setState({ activeTutorialIdx: idx, tutorialActive: true });
  };
}
