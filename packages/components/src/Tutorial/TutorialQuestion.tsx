import * as React from "react";
import { TutorialQuizName, TutorialQuizQuestion, TutorialContentWrap } from "./TutorialStyledComponents";
import { TutorialFooter } from "./TutorialFooter";
import { TutorialProgress } from "./TutorialProgress";
import { TutorialRadio } from "./TutorialRadio";
import { RadioInput } from "../input";

interface Options {
  text?: string;
  result?: string;
}

export interface TutorialQuestionProps {
  quizName?: string | JSX.Element;
  question?: string;
  options?: Options[];
}

export const TutorialQuestion: React.StatelessComponent<TutorialQuestionProps> = props => {
  const options = props.options || [];
  return (
    <>
      <TutorialProgress />
      <TutorialContentWrap>
        <TutorialQuizName>{props.quizName}</TutorialQuizName>
        <TutorialQuizQuestion>{props.question}</TutorialQuizQuestion>
        <div>
          <RadioInput name="" label="" onChange="">
            {options.map(option => <TutorialRadio value="">{option.text}</TutorialRadio>)}
          </RadioInput>
        </div>
      </TutorialContentWrap>
      <TutorialFooter />
    </>
  );
};
