import * as React from "react";
import { TutorialContentWrap, TutorialSlideContent } from "./TutorialStyledComponents";
import { TutorialFooter } from "./TutorialFooter";
import { TutorialProgress } from "./TutorialProgress";

export interface TutorialInfoProps {
  content?: string | JSX.Element;
}

export const TutorialInfo: React.StatelessComponent<TutorialInfoProps> = props => {
  return (
    <>
      <TutorialProgress />
      <TutorialContentWrap>
        <TutorialSlideContent>{props.content}</TutorialSlideContent>
      </TutorialContentWrap>
      <TutorialFooter />
    </>
  );
};
