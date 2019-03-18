import * as React from "react";
import { TutorialContent } from "./TutorialContent";
import { TutorialTopicIntro } from "../Tutorial/TutorialTopicIntro";
import { TutorialInfo } from "../Tutorial/TutorialInfo";
import { TutorialQuestion } from "../Tutorial/TutorialQuestion";
import { TutorialTopicCompleted } from "../Tutorial/TutorialTopicCompleted";
import { TutorialContain } from "./TokenTutorialStyledComponents";

export enum QUIZ_SECTION {
  INTRO = "intro",
  TUTORIAL = "tutorial",
  QUIZ = "quiz",
  COMPLETED = "completed",
}

export interface TokenTutorialQuizProps {
  topicIdx: number;
  totalTopics: number;
  activeSection: string;
  skipTutorial: boolean;
  quizSlide: number;
  handleClose(): void;
  handleSaveQuizState(topic: string, lastSlideIdx: number, isComplete: boolean): void;
}

export interface TokenTutorialQuizStates {
  topicIdx: number;
  activeSection: string;
  slideIdx: number;
  quizSlide: number;
}

export class TokenTutorialQuiz extends React.Component<TokenTutorialQuizProps, TokenTutorialQuizStates> {
  public constructor(props: any) {
    super(props);

    const { topicIdx, activeSection, quizSlide } = this.props;

    this.state = {
      topicIdx,
      slideIdx: 0,
      activeSection,
      quizSlide,
    };
  }

  public render(): JSX.Element {
    const { topicIdx, slideIdx, activeSection } = this.state;
    const lastTopic = topicIdx === this.props.totalTopics ? true : false;

    switch (activeSection) {
      case QUIZ_SECTION.INTRO:
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
      case QUIZ_SECTION.TUTORIAL:
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
      case QUIZ_SECTION.QUIZ:
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
      case QUIZ_SECTION.COMPLETED:
        return (
          <TutorialContain>
            <TutorialTopicCompleted
              completedHeader={TutorialContent[topicIdx].completed.header}
              completedText={TutorialContent[topicIdx].completed.content}
              continueBtnText={TutorialContent[topicIdx].completed.btnText}
              lastTopic={lastTopic}
              onClickNextTopic={() => this.nextTopic()}
              handleClose={this.props.handleClose}
            />
          </TutorialContain>
        );
      default:
        return <></>;
    }
  }

  private prev = () => {
    switch (this.state.activeSection) {
      case QUIZ_SECTION.TUTORIAL:
        if (this.state.slideIdx === 0) {
          this.setState({ activeSection: QUIZ_SECTION.INTRO, slideIdx: 0 });
        } else {
          this.setState({ slideIdx: this.state.slideIdx - 1 });
        }
        break;
      case QUIZ_SECTION.QUIZ:
        this.setState({
          activeSection: QUIZ_SECTION.TUTORIAL,
          slideIdx: 0,
        });
        break;
      default:
        this.setState({ activeSection: QUIZ_SECTION.INTRO, slideIdx: 0 });
    }
  };

  private next = () => {
    switch (this.state.activeSection) {
      case QUIZ_SECTION.INTRO:
        this.setState({ slideIdx: 0, activeSection: QUIZ_SECTION.TUTORIAL });
        break;
      case QUIZ_SECTION.TUTORIAL:
        if (this.state.slideIdx + 1 < TutorialContent[this.state.topicIdx].tutorials.length) {
          this.setState({ slideIdx: this.state.slideIdx + 1 });
        } else {
          this.setState({ slideIdx: this.state.quizSlide, activeSection: QUIZ_SECTION.QUIZ });
        }
        break;
      case QUIZ_SECTION.QUIZ:
        if (this.state.slideIdx + 1 < TutorialContent[this.state.topicIdx].questions.length) {
          this.setState({
            slideIdx: this.state.slideIdx + 1,
            quizSlide: this.state.quizSlide + 1,
          });
          this.props.handleSaveQuizState(TutorialContent[this.state.topicIdx].quizId, this.state.slideIdx, false);
        } else {
          this.setState({ slideIdx: 0, activeSection: QUIZ_SECTION.COMPLETED });
          this.props.handleSaveQuizState(TutorialContent[this.state.topicIdx].quizId, this.state.slideIdx, true);
        }
        break;
      default:
        this.setState({ slideIdx: 0, activeSection: QUIZ_SECTION.INTRO });
    }
  };

  private skipTutorial = () => {
    this.setState({ slideIdx: this.state.quizSlide, activeSection: QUIZ_SECTION.QUIZ });
  };

  private nextTopic = () => {
    this.props.skipTutorial
      ? this.setState({
          topicIdx: this.state.topicIdx + 1,
          slideIdx: 0,
          activeSection: QUIZ_SECTION.QUIZ,
          quizSlide: 0,
        })
      : this.setState({
          topicIdx: this.state.topicIdx + 1,
          slideIdx: 0,
          activeSection: QUIZ_SECTION.INTRO,
          quizSlide: 0,
        });
  };
}
