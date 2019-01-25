import * as React from "react";
import { TutorialContent } from "./TutorialContent";
import { TutorialTopicIntro } from "../Tutorial/TutorialTopicIntro";
import { TutorialInfo } from "../Tutorial/TutorialInfo";
import { TutorialQuestion } from "../Tutorial/TutorialQuestion";
import { TutorialTopicCompleted } from "../Tutorial/TutorialTopicCompleted";
import { TutorialContain } from "./TokenTutorialStyledComponents";

export interface TokenTutorialQuizProps {
  quizId: number;
}

export interface TokenTutorialQuizStates {
  activeSection: string;
  slideIdx: number;
}

export class TokenTutorialQuiz extends React.Component<TokenTutorialQuizProps, TokenTutorialQuizStates> {
  public constructor(props: any) {
    super(props);
    this.state = { slideIdx: 0, activeSection: "intro" };
  }

  public render(): JSX.Element {
    const quizId = this.props.quizId;
    const slideIdx = this.state.slideIdx;
    const activeSection = this.state.activeSection;

    switch (activeSection) {
      case "intro":
        return (
          <TutorialContain>
            <TutorialTopicIntro
              headerText={TutorialContent[quizId].tutorialIntro.header}
              infoText={TutorialContent[quizId].tutorialIntro.content}
              onClick={() => this.next()}
              activeSlide={0}
              totalSlides={1}
            />
          </TutorialContain>
        );
      case "tutorial":
        console.log(slideIdx);
        console.log(TutorialContent[quizId].tutorials.length);
        return (
          <TutorialContain>
            <TutorialInfo
              content={TutorialContent[quizId].tutorials[slideIdx].content}
              onClick1={() => this.prev()}
              onClick2={() => this.next()}
              activeSlide={slideIdx + 1}
              totalSlides={TutorialContent[quizId].tutorials.length}
            />
          </TutorialContain>
        );
      case "quiz":
        return (
          <TutorialContain>
            <TutorialQuestion
              quizName={TutorialContent[quizId].name}
              question={TutorialContent[quizId].questions[slideIdx].question}
              options={TutorialContent[quizId].questions[slideIdx].options}
              onClick1={() => this.prev()}
              onClick2={() => this.next()}
              activeSlide={slideIdx + 1}
              totalSlides={TutorialContent[quizId].questions.length}
            />
          </TutorialContain>
        );
      case "completed":
        return (
          <TutorialContain>
            <TutorialTopicCompleted
              completedHeader={TutorialContent[quizId].completed.header}
              completedText={TutorialContent[quizId].completed.content}
              onClick={() => this.next()}
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
        if (this.state.slideIdx + 1 < TutorialContent[this.props.quizId].tutorials.length) {
          this.setState({ slideIdx: this.state.slideIdx + 1 });
        } else {
          this.setState({ slideIdx: 0 });
          this.setState({ activeSection: "quiz" });
        }
        break;
      case "quiz":
        if (this.state.slideIdx + 1 < TutorialContent[this.props.quizId].questions.length) {
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
}
