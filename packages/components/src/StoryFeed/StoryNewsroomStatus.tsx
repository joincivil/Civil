import * as React from "react";
import styled from "styled-components";
import { ChallengeMarkIcon, TrustMarkIcon, colors, fonts } from "@joincivil/elements";

export const StoryNewsroomStatusStyled = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  margin-bottom: 7px;

  a {
    align-items: center;
    color: ${colors.primary.BLACK};
    cursor: pointer;
    display: flex;
    transition: color 0.2s ease;

    &:hover {
      color: ${colors.accent.CIVIL_BLUE};
    }
  }

  svg {
    margin-left: 5px;
  }
`;

export interface StoryNewsroomStatusProps {
  newsroomName: string;
  activeChallenge: boolean;
  handleOpenNewsroom?(): void;
}

export const StoryNewsroomStatus: React.FunctionComponent<StoryNewsroomStatusProps> = props => {
  if (props.handleOpenNewsroom) {
    return (
      <StoryNewsroomStatusStyled>
        <a onClick={props.handleOpenNewsroom}>
          {props.newsroomName}
          {props.activeChallenge ? (
            <ChallengeMarkIcon width={18} height={18} />
          ) : (
            <TrustMarkIcon width={18} height={18} />
          )}
        </a>
      </StoryNewsroomStatusStyled>
    );
  }

  return (
    <StoryNewsroomStatusStyled>
      {props.newsroomName}
      {props.activeChallenge ? <ChallengeMarkIcon width={18} height={18} /> : <TrustMarkIcon width={18} height={18} />}
    </StoryNewsroomStatusStyled>
  );
};
