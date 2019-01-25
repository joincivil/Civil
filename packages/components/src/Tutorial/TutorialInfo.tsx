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
  onClick1?(e: any): void;
  onClick2?(e: any): void;
}

export const TutorialInfo: React.StatelessComponent<TutorialInfoProps> = props => {
  return (
    <>
      <TutorialProgress activeSlide={props.activeSlide} totalSlides={props.totalSlides} />
      <TutorialContentWrap>
        <TutorialSlideContent>{props.content}</TutorialSlideContent>
      </TutorialContentWrap>
      <TutorialFooter>
        <TutorialInvertedBtn onClick={props.onClick1}>Back</TutorialInvertedBtn>
        <TutorialBtn onClick={props.onClick2}>Continue</TutorialBtn>
      </TutorialFooter>
    </>
  );
};
