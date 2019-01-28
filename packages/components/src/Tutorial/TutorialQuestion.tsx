import * as React from "react";
import {
  TutorialQuizName,
  TutorialQuizQuestion,
  TutorialContentWrap,
  TutorialInvertedBtn,
  TutorialBtn,
} from "./TutorialStyledComponents";
import { TutorialFooter } from "./TutorialFooter";
import { TutorialProgress } from "./TutorialProgress";
import { TutorialRadio } from "./TutorialRadio";
import { RadioInput } from "../input";

export interface Options {
  text?: string;
}

export interface TutorialQuestionProps {
  activeSlide: number;
  totalSlides: number;
  quizName: string | JSX.Element;
  quizId: string;
  question?: string;
  options: Options[];
  answer: string;
  onClickPrev?(e: any): void;
  onClickNext?(e: any): void;
  onClickCheck?(e: any): void;
}

export interface TutorialQuestionStates {
  checkAnswerEnabled: boolean;
  checkAnswerFinished: boolean;
  usersAnswerValue: string;
}

export class TutorialQuestion extends React.Component<TutorialQuestionProps, TutorialQuestionStates> {
  public constructor(props: any) {
    super(props);
    this.state = { checkAnswerEnabled: true, checkAnswerFinished: false, usersAnswerValue: "" };
  }

  public render(): JSX.Element {
    return (
      <>
        <TutorialProgress activeSlide={this.props.activeSlide} totalSlides={this.props.totalSlides} />
        <TutorialContentWrap>
          <TutorialQuizName>{this.props.quizName}</TutorialQuizName>
          <TutorialQuizQuestion>{this.props.question}</TutorialQuizQuestion>
          <div>
            <RadioInput
              name={this.props.quizId + "-" + this.props.activeSlide}
              label=""
              onChange={this.enableCheckAnswerBtn}
            >
              {this.props.options.map((option, idx) => (
                <TutorialRadio id={this.props.quizId + "-" + idx} value={option.text} key={idx}>
                  {option.text}
                </TutorialRadio>
              ))}
            </RadioInput>
          </div>
        </TutorialContentWrap>
        <TutorialFooter>
          <TutorialInvertedBtn onClick={this.props.onClickPrev}>Back</TutorialInvertedBtn>
          {this.state.checkAnswerFinished ? (
            <TutorialBtn onClick={this.props.onClickNext}>Continue</TutorialBtn>
          ) : (
            <TutorialBtn disabled={this.state.checkAnswerEnabled} onClick={() => this.checkAnswer()}>
              Check
            </TutorialBtn>
          )}
        </TutorialFooter>
      </>
    );
  }

  private enableCheckAnswerBtn = (ev: any) => {
    this.setState({ checkAnswerEnabled: false });
    this.setState({ usersAnswerValue: ev.target.value });
  };

  private checkAnswer = () => {
    if (this.state.usersAnswerValue === this.props.answer) {
      this.setState({ checkAnswerFinished: true });
    } else {
      console.log("wrong!");
    }
  };
}
