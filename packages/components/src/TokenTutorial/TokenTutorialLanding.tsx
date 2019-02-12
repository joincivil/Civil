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
import { getCurrentUserQuery } from "@joincivil/utils";
import { Query } from "react-apollo";

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
      <Query query={getCurrentUserQuery}>
        {({ loading, error, data }) => {
          console.log({ data });

          const quizPayload = loading || error ? {} : data.currentUser.quizPayload;

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
                const { isComplete, lastSlideIdx } = this.getTopicStatus(quizPayload, topic);

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
        }}
      </Query>
    );
  }

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
