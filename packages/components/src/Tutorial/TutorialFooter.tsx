import * as React from "react";
import { TutorialFooterFull, TutorialFooterWrap } from "./TutorialStyledComponents";

export interface TutorialFooterProps {
  questionResult?: string;
  floatRight?: boolean;
}

export const TutorialFooter: React.StatelessComponent<TutorialFooterProps> = props => {
  return (
    <TutorialFooterFull questionResult={props.questionResult}>
      <TutorialFooterWrap floatRight={props.floatRight}>{props.children}</TutorialFooterWrap>
    </TutorialFooterFull>
  );
};
