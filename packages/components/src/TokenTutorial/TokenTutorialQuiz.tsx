import * as React from "react";
import { TutorialContent } from "./TutorialContent";
import { TutorialTopicIntro } from "../Tutorial/TutorialTopicIntro";
import { TutorialInfo } from "../Tutorial/TutorialInfo";
import { TutorialQuestion } from "../Tutorial/TutorialQuestion";
import { TutorialTopicCompleted } from "../Tutorial/TutorialTopicCompleted";
import { TutorialContain } from "./TokenTutorialStyledComponents";

export interface TokenTutorialQuizProps {
  topicIdx: number;
}

export interface TokenTutorialQuizStates {
  topicIdx: number;
  activeSection: string;
  slideIdx: number;
}

export class TokenTutorialQuiz extends React.Component<TokenTutorialQuizProps, TokenTutorialQuizStates> {
  public constructor(props: any) {
    super(props);
    this.state = { topicIdx: this.props.topicIdx, slideIdx: 0, activeSection: "intro" };
  }

  public render(): JSX.Element {
    const topicIdx = this.state.topicIdx;
    const slideIdx = this.state.slideIdx;
    const activeSection = this.state.activeSection;

    switch (activeSection) {
      case "intro":
        return (
          <TutorialContain>
            <TutorialTopicIntro
              headerText={TutorialContent[topicIdx].tutorialIntro.header}
              infoText={TutorialContent[topicIdx].tutorialIntro.content}
              onClickNext={() => this.next()}
              onClickSkipTutorial={() => this.skipTutorial()}
              activeSlide={0}
              totalSlides={1}
            />
          </TutorialContain>
        );
      case "tutorial":
        return (
          <TutorialContain>
            <TutorialInfo
              content={TutorialContent[topicIdx].tutorials[slideIdx].content}
              onClickPrev={() => this.prev()}
              onClickNext={() => this.next()}
              activeSlide={slideIdx + 1}
              totalSlides={TutorialContent[topicIdx].tutorials.length}
            />
          </TutorialContain>
        );
      case "quiz":
        return (
          <TutorialContain>
            <TutorialQuestion
              quizName={TutorialContent[topicIdx].name}
              quizId={TutorialContent[topicIdx].quizId}
              question={TutorialContent[topicIdx].questions[slideIdx].question}
              options={TutorialContent[topicIdx].questions[slideIdx].options}
              answer={TutorialContent[topicIdx].questions[slideIdx].answer}
              onClickPrev={() => this.prev()}
              onClickNext={() => this.next()}
              activeSlide={slideIdx + 1}
              totalSlides={TutorialContent[topicIdx].questions.length}
            />
          </TutorialContain>
        );
      case "completed":
        return (
          <TutorialContain>
            <TutorialTopicCompleted
              completedHeader={TutorialContent[topicIdx].completed.header}
              completedText={TutorialContent[topicIdx].completed.content}
              continueBtnText={TutorialContent[topicIdx].completed.btnText}
              onClickNextTopic={() => this.nextTopic()}
            />
          </TutorialContain>
        );
      default:
        return <></>;
    }
  }

  private prev = () => {
    switch (this.state.activeSection) {
      case "tutorial":
        if (this.state.slideIdx === 0) {
          this.setState({ activeSection: "intro" });
        } else {
          this.setState({ slideIdx: this.state.slideIdx - 1 });
        }
        break;
      case "quiz":
        if (this.state.slideIdx === 0) {
          this.setState({ activeSection: "tutorial" });
        } else {
          this.setState({ slideIdx: this.state.slideIdx - 1 });
        }
        break;
      case "completed":
        this.setState({ activeSection: "quiz" });
        this.setState({ slideIdx: 0 });
        break;
      default:
        this.setState({ activeSection: "intro" });
        this.setState({ slideIdx: 0 });
    }
  };

  private next = () => {
    switch (this.state.activeSection) {
      case "intro":
        this.setState({ slideIdx: 0 });
        this.setState({ activeSection: "tutorial" });
        break;
      case "tutorial":
        if (this.state.slideIdx + 1 < TutorialContent[this.props.topicIdx].tutorials.length) {
          this.setState({ slideIdx: this.state.slideIdx + 1 });
        } else {
          this.setState({ slideIdx: 0 });
          this.setState({ activeSection: "quiz" });
        }
        break;
      case "quiz":
        if (this.state.slideIdx + 1 < TutorialContent[this.props.topicIdx].questions.length) {
          this.setState({ slideIdx: this.state.slideIdx + 1 });
        } else {
          this.setState({ slideIdx: 0 });
          this.setState({ activeSection: "completed" });
        }
        break;
      case "completed":
        this.setState({ slideIdx: 0 });
        break;
      default:
        this.setState({ slideIdx: 0 });
        this.setState({ activeSection: "intro" });
    }
  };

  private skipTutorial = () => {
    this.setState({ slideIdx: 0 });
    this.setState({ activeSection: "quiz" });
  };

  private nextTopic = () => {
    this.setState({ topicIdx: this.state.topicIdx + 1 });
    this.setState({ slideIdx: 0 });
    this.setState({ activeSection: "intro" });
  };
}
