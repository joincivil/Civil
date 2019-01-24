import * as React from "react";
import { TutorialCompletedHeader, TutorialCompletedP, TutorialContentWrap } from "./TutorialStyledComponents";
import { HollowGreenCheck } from "../icons/HollowGreenCheck";
import { TutorialFooter } from "./TutorialFooter";
import { TutorialProgress } from "./TutorialProgress";

export interface TutorialTopicCompletedProps {
  completedHeader?: string | JSX.Element;
  completedText?: string | JSX.Element;
}

export const TutorialTopicCompleted: React.StatelessComponent<TutorialTopicCompletedProps> = props => {
  return (
    <>
      <TutorialProgress />
      <TutorialContentWrap>
        <HollowGreenCheck width={50} height={50} />
        <TutorialCompletedHeader>{props.completedHeader}</TutorialCompletedHeader>
        <TutorialCompletedP>{props.completedText}</TutorialCompletedP>
      </TutorialContentWrap>
      <TutorialFooter />
    </>
  );
};
