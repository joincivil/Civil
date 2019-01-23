import * as React from "react";
import { TutorialQuizName, TutorialQuizQuestion } from "./TutorialStyledComponents";
import { TutorialFooter } from "./TutorialFooter";
import { TutorialProgress } from "./TutorialProgress";
import { TutorialRadio } from "./TutorialRadio";
import { RadioInput } from "../input";

export interface TutorialQuestionProps {
  quizName?: string | JSX.Element;
  question?: string;
  optionText?: string;
  optionResult?: string;
}

export const TutorialQuestion: React.StatelessComponent<TutorialQuestionProps> = props => {
  return (
    <>
      <TutorialProgress />
      <TutorialQuizName>{props.quizName}</TutorialQuizName>
      <TutorialQuizQuestion>{props.question}</TutorialQuizQuestion>
      <div>
        <RadioInput name="" label="" onChange="">
          <TutorialRadio value="">{props.optionText}</TutorialRadio>
        </RadioInput>
      </div>
      <TutorialFooter />
    </>
  );
};
