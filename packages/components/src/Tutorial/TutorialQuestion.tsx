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
  result?: string;
}

export interface TutorialQuestionProps {
  activeSlide: number;
  totalSlides: number;
  quizName?: string | JSX.Element;
  question?: string;
  options?: Options[];
  onClick1?(e: any): void;
  onClick2?(e: any): void;
}

export const TutorialQuestion: React.StatelessComponent<TutorialQuestionProps> = props => {
  const options = props.options || [];
  return (
    <>
      <TutorialProgress activeSlide={props.activeSlide} totalSlides={props.totalSlides} />
      <TutorialContentWrap>
        <TutorialQuizName>{props.quizName}</TutorialQuizName>
        <TutorialQuizQuestion>{props.question}</TutorialQuizQuestion>
        <div>
          <RadioInput name="" label="" onChange="">
            {options.map((option, idx) => (
              <TutorialRadio value="" key={idx}>
                {option.text}
              </TutorialRadio>
            ))}
          </RadioInput>
        </div>
      </TutorialContentWrap>
      <TutorialFooter>
        <TutorialInvertedBtn onClick={props.onClick1}>Back</TutorialInvertedBtn>
        <TutorialBtn onClick={props.onClick2}>Continue</TutorialBtn>
      </TutorialFooter>
    </>
  );
};
