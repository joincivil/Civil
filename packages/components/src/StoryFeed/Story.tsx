import * as React from "react";
import { StoryLink, StoryLinkLeft, StoryTitle, StoryImgSquare, TimeStamp } from "./StoryFeedStyledComponents";
import { OpenGraphData } from "./types";

export interface StoryProps {
  createdAt: string;
  openGraphData: OpenGraphData;
  handleOpenStory(): void;
}

export const Story: React.FunctionComponent<StoryProps> = props => {
  return (
    <>
      <StoryLink onClick={() => props.handleOpenStory}>
        <StoryLinkLeft>
          <StoryTitle>{props.openGraphData.title}</StoryTitle>
          <TimeStamp>{props.createdAt}</TimeStamp>
        </StoryLinkLeft>
        {props.openGraphData.images && (
          <StoryImgSquare>
            <img src={props.openGraphData.images[0].url} />
          </StoryImgSquare>
        )}
      </StoryLink>
    </>
  );
};
