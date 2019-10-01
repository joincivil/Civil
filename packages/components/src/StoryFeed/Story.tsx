import * as React from "react";
import { StoryLink, StoryLinkLeft, StoryTitle, StoryImgSquare, TimeStamp } from "./StoryFeedStyledComponents";
import { OpenGraphData } from "./types";

export interface StoryProps {
  openGraphData: OpenGraphData;
  handleOpenStory(): void;
}

export const Story: React.FunctionComponent<StoryProps> = props => {
  return (
    <>
      <StoryLink onClick={props.handleOpenStory}>
        <StoryLinkLeft>
          <StoryTitle>{props.openGraphData.title}</StoryTitle>
          <TimeStamp>{props.openGraphData.article.published_time}</TimeStamp>
        </StoryLinkLeft>
        <StoryImgSquare>
          <img src={props.openGraphData.images.url} />
        </StoryImgSquare>
      </StoryLink>
    </>
  );
};
