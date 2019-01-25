import * as React from "react";
import { TutorialProgressContain, TutorialProgressBar, TutorialProgressBarActive } from "./TutorialStyledComponents";

export interface TutorialProgressProps {
  activeSlide: number;
  totalSlides: number;
}

export const TutorialProgress: React.StatelessComponent<TutorialProgressProps> = props => {
  return (
    <>
      <TutorialProgressContain>
        <TutorialProgressBar>
          <TutorialProgressBarActive activeSlide={props.activeSlide} totalSlides={props.totalSlides} />
        </TutorialProgressBar>
      </TutorialProgressContain>
    </>
  );
};
