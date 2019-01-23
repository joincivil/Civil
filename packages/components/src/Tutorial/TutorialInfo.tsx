import * as React from "react";
import { TutorialSlideHeader } from "./TutorialStyledComponents";
import { TutorialFooter } from "./TutorialFooter";
import { TutorialProgress } from "./TutorialProgress";

export interface TutorialInfoProps {
  headerText?: string | JSX.Element;
  slideText?: string | JSX.Element;
}

export const TutorialInfo: React.StatelessComponent<TutorialInfoProps> = props => {
  return (
    <>
      <TutorialProgress />
      <TutorialSlideHeader>{props.headerText}</TutorialSlideHeader>
      {props.slideText}
      <TutorialFooter />
    </>
  );
};
