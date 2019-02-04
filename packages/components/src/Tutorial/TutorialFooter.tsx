import * as React from "react";
import { TutorialFooterFull, TutorialFooterWrap } from "./TutorialStyledComponents";

export interface TutorialFooterProps {
  questionResult?: string;
}

export const TutorialFooter: React.StatelessComponent<TutorialFooterProps> = props => {
  return (
    <TutorialFooterFull questionResult={props.questionResult}>
      <TutorialFooterWrap>{props.children}</TutorialFooterWrap>
    </TutorialFooterFull>
  );
};
