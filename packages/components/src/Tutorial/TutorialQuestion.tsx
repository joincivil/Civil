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
  onClickPrev(e: any): void;
  onClickNext(e: any): void;
}

export interface TutorialQuestionStates {
  checkAnswerDisabled: boolean;
  usersAnswerValue: string;
  usersAnswerResult: string;
}

export class TutorialQuestion extends React.Component<TutorialQuestionProps, TutorialQuestionStates> {
  public constructor(props: any) {
    super(props);
    this.state = { checkAnswerDisabled: true, usersAnswerValue: "", usersAnswerResult: "" };
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
        <TutorialFooter questionResult={this.state.usersAnswerResult}>
          {this.state.usersAnswerResult === "correct" ? (
            <>
              <TutorialFooterLeft>
                <HollowGreenCheck width={50} height={50} />
                <h3>
                  <CorrectText />
                </h3>
              </TutorialFooterLeft>
              <TutorialBtn onClick={this.props.onClickNext}>Continue</TutorialBtn>
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

  private enableCheckAnswerBtn = (ev: any) => {
    this.setState({ checkAnswerDisabled: false, usersAnswerValue: ev.target.value });
  };

  private checkAnswer = () => {
    if (this.state.usersAnswerValue === this.props.answer) {
      this.setState({ usersAnswerResult: "correct" });
    } else {
      this.setState({ usersAnswerResult: "incorrect", checkAnswerDisabled: true });
    }
  };
}
