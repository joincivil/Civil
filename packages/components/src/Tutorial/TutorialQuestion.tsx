import * as React from "react";
import {
  TutorialQuizName,
  TutorialQuizQuestion,
  TutorialContentWrap,
  TutorialInvertedBtn,
  TutorialBtn,
  TutorialFooterLeft,
} from "./TutorialStyledComponents";
import { IncorrectText, SelectCorrectText, CorrectText } from "./TutorialTextComponents";
import { TutorialFooter } from "./TutorialFooter";
import { TutorialProgress } from "./TutorialProgress";
import { TutorialRadio } from "./TutorialRadio";
import { RadioInput } from "../input";
import { HollowGreenCheck } from "../icons/HollowGreenCheck";
import { HollowRedNoGood } from "../icons/HollowRedNoGood";

export interface Options {
  text: string;
}

export interface TutorialQuestionProps {
  activeSlide: number;
  totalSlides: number;
  quizName: string | JSX.Element;
  quizId: string;
  question: string;
  options: Options[];
  answer: string;
  checkAnswerDisabled: boolean;
  usersAnswerValue: string;
  usersAnswerResult: string;
  resetQuestion: number;
  onClickPrev(e: any): void;
  onClickNext(e: any): void;
}

export interface TutorialQuestionStates {
  checkAnswerDisabled: boolean;
  usersAnswerValue: string;
  usersAnswerResult: string;
  resetQuestion: number;
}

export class TutorialQuestion extends React.Component<TutorialQuestionProps, TutorialQuestionStates> {
  public static getDerivedStateFromProps(
    props: TutorialQuestionProps,
    state: TutorialQuestionStates,
  ): TutorialQuestionStates {
    if (props.resetQuestion !== state.resetQuestion) {
      return {
        checkAnswerDisabled: props.checkAnswerDisabled,
        usersAnswerValue: props.usersAnswerValue,
        usersAnswerResult: props.usersAnswerResult,
        resetQuestion: props.resetQuestion,
      };
    } else {
      return {
        checkAnswerDisabled: state.checkAnswerDisabled,
        usersAnswerValue: state.usersAnswerValue,
        usersAnswerResult: state.usersAnswerResult,
        resetQuestion: state.resetQuestion,
      }
    };
  }

  public constructor(props: any) {
    super(props);
    this.state = {
      checkAnswerDisabled: this.props.checkAnswerDisabled,
      usersAnswerValue: this.props.usersAnswerValue,
      usersAnswerResult: this.props.usersAnswerResult,
      resetQuestion: this.props.resetQuestion,
    };
  }

  public render(): JSX.Element {
    console.log("checkAnswerDisabled: " + this.state.checkAnswerDisabled);
    console.log("usersAnswerValue: " + this.state.usersAnswerValue);
    console.log("usersAnswerResult: " + this.state.usersAnswerResult);
    return (
      <>
        <TutorialProgress
          activeSlide={this.props.activeSlide}
          totalSlides={this.props.totalSlides}
          showSlideCount={true}
        />
        <TutorialContentWrap>
          <TutorialQuizName>Quiz: {this.props.quizName}</TutorialQuizName>
          <TutorialQuizQuestion>
            <span>{this.props.activeSlide}.</span>
            {this.props.question}
          </TutorialQuizQuestion>
          <div>
            <RadioInput
              name={this.props.quizId + "-" + this.props.activeSlide}
              label=""
              onChange={this.enableCheckAnswerBtn}
            >
              {this.props.options.map((option, idx) => (
                <TutorialRadio value={option.text} key={idx}>
                  {option.text}
                </TutorialRadio>
              ))}
            </RadioInput>
          </div>
        </TutorialContentWrap>
        <TutorialFooter questionResult={this.state.usersAnswerResult}>
          {this.state.usersAnswerResult === "correct" ? (
            <>
              <TutorialFooterLeft>
                <HollowGreenCheck width={50} height={50} />
                <h3>
                  <CorrectText />
                </h3>
              </TutorialFooterLeft>
              <TutorialBtn onClick={this.resetQuestion}>Continue</TutorialBtn>
            </>
          ) : this.state.usersAnswerResult === "incorrect" ? (
            <>
              <TutorialFooterLeft>
                <HollowRedNoGood width={50} height={50} />
                <div>
                  <h3>
                    <IncorrectText />
                  </h3>
                  <p>{this.props.answer}</p>
                  <span>
                    <SelectCorrectText />
                  </span>
                </div>
              </TutorialFooterLeft>
              <TutorialBtn disabled={this.state.checkAnswerDisabled} onClick={() => this.checkAnswer()}>
                Check
              </TutorialBtn>
            </>
          ) : (
            <>
              <TutorialInvertedBtn onClick={this.props.onClickPrev}>Back to Tutorial</TutorialInvertedBtn>
              <TutorialBtn disabled={this.state.checkAnswerDisabled} onClick={() => this.checkAnswer()}>
                Check
              </TutorialBtn>
            </>
          )}
        </TutorialFooter>
      </>
    );
  }

  private enableCheckAnswerBtn = (name: string, value: any) => {
    this.setState({ checkAnswerDisabled: false, usersAnswerValue: value });
  };

  private checkAnswer = () => {
    if (this.state.usersAnswerValue === this.props.answer) {
      this.setState({ usersAnswerResult: "correct" });
    } else {
      this.setState({ usersAnswerResult: "incorrect", checkAnswerDisabled: true });
    }
  };

  private resetQuestion = (e: any) => {
    this.props.onClickNext(e)

    this.setState({ resetQuestion: this.state.resetQuestion + 1 });
  };
}
