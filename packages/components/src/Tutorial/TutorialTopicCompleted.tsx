import * as React from "react";
import {
  TutorialCompletedHeader,
  TutorialCompletedP,
  TutorialContentWrap,
  TutorialBtn,
} from "./TutorialStyledComponents";
import { HollowGreenCheck } from "../icons/HollowGreenCheck";

export interface TutorialTopicCompletedProps {
  completedHeader?: string | JSX.Element;
  completedText?: string | JSX.Element;
  onClick?(e: any): void;
}

export const TutorialTopicCompleted: React.StatelessComponent<TutorialTopicCompletedProps> = props => {
  return (
    <TutorialContentWrap>
      <HollowGreenCheck width={50} height={50} />
      <TutorialCompletedHeader>{props.completedHeader}</TutorialCompletedHeader>
      <TutorialCompletedP>{props.completedText}</TutorialCompletedP>
      <TutorialBtn>Continue on to Topic 2</TutorialBtn>
    </TutorialContentWrap>
  );
};
