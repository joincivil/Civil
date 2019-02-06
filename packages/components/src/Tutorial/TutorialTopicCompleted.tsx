import * as React from "react";
import {
  TutorialCompletedHeader,
  TutorialCompletedP,
  TutorialContentWrap,
  TutorialBtn,
} from "./TutorialStyledComponents";
import { HollowGreenCheck } from "../icons/HollowGreenCheck";

export interface TutorialTopicCompletedProps {
  completedHeader: string | JSX.Element;
  completedText: string | JSX.Element;
  continueBtnText: string;
  lastTopic: boolean;
  onClickNextTopic(e: any): void;
  handleClose(): void;
}

export const TutorialTopicCompleted: React.StatelessComponent<TutorialTopicCompletedProps> = props => {
  const buttonNext = props.lastTopic ? (
    <TutorialBtn onClick={props.handleClose}>{props.continueBtnText}</TutorialBtn>
  ) : (
    <TutorialBtn onClick={props.onClickNextTopic}>{props.continueBtnText}</TutorialBtn>
  );

  return (
    <TutorialContentWrap centerContent={true}>
      <HollowGreenCheck width={50} height={50} />
      <TutorialCompletedHeader>{props.completedHeader}</TutorialCompletedHeader>
      <TutorialCompletedP>{props.completedText}</TutorialCompletedP>
      {buttonNext}
    </TutorialContentWrap>
  );
};
