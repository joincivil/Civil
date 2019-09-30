import * as React from "react";
import { StoryRegistryStatusSection, StoryRegistryStatusTextWrap } from "./StoryFeedStyledComponents";
import { ApprovedNewsroomText, ChallengedNewsroomText } from "./StoryFeedTextComponents";

export interface StoryRegistryDetailsProps {
  activeChallenge: boolean;
}

export const StoryRegistryDetails: React.FunctionComponent<StoryRegistryDetailsProps> = props => {
  return (
    <StoryRegistryStatusSection>
      {props.activeChallenge ? (
        <StoryRegistryStatusTextWrap activeChallenge={true}>
          <ChallengedNewsroomText />
          <>challenge icon tktk</>
        </StoryRegistryStatusTextWrap>
      ) : (
        <StoryRegistryStatusTextWrap activeChallenge={false}>
          <ApprovedNewsroomText />
          <>approved icon tktk</>
        </StoryRegistryStatusTextWrap>
      )}
    </StoryRegistryStatusSection>
  );
};
