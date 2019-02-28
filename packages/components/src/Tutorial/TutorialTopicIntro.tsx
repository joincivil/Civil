import * as React from "react";
import {
  TutorialTopicTitle,
  TutorialTopicInfo,
  TutorialBtn,
  TutorialTextBtn,
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
      </TutorialContentWrap>
      <TutorialFooter floatRight={true}>
        <div>
          <TutorialTextBtn onClick={props.onClickSkipTutorial}>
            <SkipToQuizBtnText />
          </TutorialTextBtn>
          <TutorialBtn onClick={props.onClickNext}>Let’s go</TutorialBtn>
        </div>
      </TutorialFooter>
    </>
  );
};
