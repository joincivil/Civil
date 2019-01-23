import * as React from "react";
import { TutorialProgressContain, TutorialProgressBar } from "./TutorialStyledComponents";

export interface TutorialProgressProps {
  activeIdx?: number;
  total?: number;
}

export const TutorialProgress: React.StatelessComponent<TutorialProgressProps> = props => {
  return (
    <>
      <TutorialProgressContain>
        <TutorialProgressBar />
      </TutorialProgressContain>
    </>
  );
};
