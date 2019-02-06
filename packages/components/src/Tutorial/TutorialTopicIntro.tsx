import * as React from "react";
import {
  TutorialTopicTitle,
  TutorialTopicInfo,
  TutorialBtn,
  TutorialInvertedBtn,
  TutorialContentWrap,
} from "./TutorialStyledComponents";
import { SkipToQuizBtnText } from "./TutorialTextComponents";
import { TutorialFooter } from "./TutorialFooter";
import { TutorialProgress } from "./TutorialProgress";

export interface TutorialTopicIntroProps {
  activeSlide: number;
  totalSlides: number;
  headerText: string | JSX.Element;
  infoText: string | JSX.Element;
  onClickNext(e: any): void;
  onClickSkipTutorial(e: any): void;
}

export const TutorialTopicIntro: React.StatelessComponent<TutorialTopicIntroProps> = props => {
  return (
    <>
      <TutorialProgress activeSlide={props.activeSlide} totalSlides={props.totalSlides} />
      <TutorialContentWrap>
        <TutorialTopicTitle>{props.headerText}</TutorialTopicTitle>
        <TutorialTopicInfo>{props.infoText}</TutorialTopicInfo>
        <TutorialInvertedBtn onClick={props.onClickSkipTutorial} positionAbsolute={true}>
          <SkipToQuizBtnText />
        </TutorialInvertedBtn>
      </TutorialContentWrap>
      <TutorialFooter floatRight={true}>
        <TutorialBtn onClick={props.onClickNext}>Let’s go</TutorialBtn>
      </TutorialFooter>
    </>
  );
};
