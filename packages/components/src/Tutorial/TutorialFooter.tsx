import * as React from "react";
import { TutorialFooterFull, TutorialFooterWrap } from "./TutorialStyledComponents";

export const TutorialFooter: React.StatelessComponent = props => {
  return (
    <TutorialFooterFull>
      <TutorialFooterWrap>{props.children}</TutorialFooterWrap>
    </TutorialFooterFull>
  );
};
