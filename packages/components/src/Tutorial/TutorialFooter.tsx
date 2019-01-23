import * as React from "react";
import { TutorialFooterContain, TutorialBtn, TutorialInvertedBtn } from "./TutorialStyledComponents";

export interface TutorialFooterProps {
  btn1Text?: string | JSX.Element;
  btn2Text?: string | JSX.Element;
}

export const TutorialFooter: React.StatelessComponent<TutorialFooterProps> = props => {
  return (
    <TutorialFooterContain>
      <TutorialInvertedBtn>{props.btn1Text}</TutorialInvertedBtn>
      <TutorialBtn>{props.btn2Text}</TutorialBtn>
    </TutorialFooterContain>
  );
};
