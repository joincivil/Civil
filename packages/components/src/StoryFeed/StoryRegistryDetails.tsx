import * as React from "react";
import { StoryRegistryDetailsStyled, StoryRegistryStatusTextWrap } from "./StoryFeedStyledComponents";
import { ApprovedNewsroomText, ChallengedNewsroomText } from "./StoryFeedTextComponents";

export interface StoryRegistryDetailsProps {
  activeChallenge: boolean;
}

export const StoryRegistryDetails: React.FunctionComponent<StoryRegistryDetailsProps> = props => {
  return (
    <StoryRegistryDetailsStyled>
      {props.activeChallenge ? (
        <StoryRegistryStatusTextWrap activeChallenge={true}>
          <ChallengedNewsroomText />
          {/* TODO(sruddy) challenge icon tktk */}
        </StoryRegistryStatusTextWrap>
      ) : (
        <StoryRegistryStatusTextWrap activeChallenge={false}>
          <ApprovedNewsroomText />
          {/* TODO(sruddy) approved icon tktk */}
        </StoryRegistryStatusTextWrap>
      )}
    </StoryRegistryDetailsStyled>
  );
};
