import * as React from "react";
import {
  TutorialProgressContain,
  TutorialProgressBar,
  TutorialProgressBarActive,
  TutorialProgressBarSlideCount,
} from "./TutorialStyledComponents";

export interface TutorialProgressProps {
  activeSlide: number;
  totalSlides: number;
  showSlideCount?: boolean;
}

export const TutorialProgress: React.FunctionComponent<TutorialProgressProps> = props => {
  return (
    <>
      <TutorialProgressContain>
        <TutorialProgressBar>
          {props.showSlideCount && (
            <TutorialProgressBarSlideCount activeSlide={props.activeSlide} totalSlides={props.totalSlides}>
              {props.activeSlide} of {props.totalSlides}
            </TutorialProgressBarSlideCount>
          )}
          <TutorialProgressBarActive activeSlide={props.activeSlide} totalSlides={props.totalSlides} />
        </TutorialProgressBar>
      </TutorialProgressContain>
    </>
  );
};
