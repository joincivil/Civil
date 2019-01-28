import * as React from "react";
import {
  TutorialContentWrap,
  TutorialSlideContent,
  TutorialInvertedBtn,
  TutorialBtn,
} from "./TutorialStyledComponents";
import { TutorialFooter } from "./TutorialFooter";
import { TutorialProgress } from "./TutorialProgress";

export interface TutorialInfoProps {
  activeSlide: number;
  totalSlides: number;
  content?: string | JSX.Element;
  onClickPrev?(e: any): void;
  onClickNext?(e: any): void;
}

export const TutorialInfo: React.StatelessComponent<TutorialInfoProps> = props => {
  return (
    <>
      <TutorialProgress activeSlide={props.activeSlide} totalSlides={props.totalSlides} />
      <TutorialContentWrap>
        <TutorialSlideContent>{props.content}</TutorialSlideContent>
      </TutorialContentWrap>
      <TutorialFooter>
        <TutorialInvertedBtn onClick={props.onClickPrev}>Back</TutorialInvertedBtn>
        <TutorialBtn onClick={props.onClickNext}>Continue</TutorialBtn>
      </TutorialFooter>
    </>
  );
};
