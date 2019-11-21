import * as React from "react";
import { StoryLink, StoryLinkLeft, StoryTitle, StoryImgSquare, TimeStamp } from "./StoryFeedStyledComponents";
import { OpenGraphData } from "./types";
import { getTimeSince } from "@joincivil/utils";
import { storyPlaceholderImgUrl } from "@joincivil/components";

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
          {props.openGraphData.article && props.openGraphData.article.published_time && (
            <TimeStamp>{getTimeSince(props.openGraphData.article.published_time)}</TimeStamp>
          )}
        </StoryLinkLeft>
        <StoryImgSquare>
          {props.openGraphData.images ? (
            <img src={props.openGraphData.images[0].url} />
          ) : (
            <img src={storyPlaceholderImgUrl} />
          )}
        </StoryImgSquare>
      </StoryLink>
    </>
  );
};
