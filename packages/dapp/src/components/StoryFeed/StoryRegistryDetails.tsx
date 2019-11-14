import * as React from "react";
import { StoryRegistryDetailsStyled, StoryRegistryStatusTextWrap } from "./StoryFeedStyledComponents";
import { ApprovedNewsroomText, ChallengedNewsroomText } from "./StoryFeedTextComponents";
import { ChallengeMarkIcon, TrustMarkIcon } from "@joincivil/elements";

export interface StoryRegistryDetailsProps {
  activeChallenge: boolean;
}

export const StoryRegistryDetails: React.FunctionComponent<StoryRegistryDetailsProps> = props => {
  return (
    <StoryRegistryDetailsStyled>
      {props.activeChallenge ? (
        <StoryRegistryStatusTextWrap activeChallenge={true}>
          <ChallengedNewsroomText />
          <ChallengeMarkIcon />
        </StoryRegistryStatusTextWrap>
      ) : (
        <StoryRegistryStatusTextWrap activeChallenge={false}>
          <ApprovedNewsroomText />
          <TrustMarkIcon />
        </StoryRegistryStatusTextWrap>
      )}
    </StoryRegistryDetailsStyled>
  );
};
