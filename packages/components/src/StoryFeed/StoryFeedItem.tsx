import * as React from "react";
import { StoryNewsroomStatus } from "./StoryNewsroomStatus";
import { Story } from "./Story";
import { ContributerCount, Contributers } from "../Leaderboard";

export interface StoryFeedItemProps {
  contributers: Contributers[];
  img: string;
  newsroom: string;
  timeStamp: string;
  title: string;
  total: number;
  url: string;
}

export const StoryFeedItem: React.FunctionComponent<StoryFeedItemProps> = props => {
  return (
    <>
      <StoryNewsroomStatus newsroom={props.newsroom} activeChallenge={true} />
      <Story img={props.img} timeStamp={props.timeStamp} title={props.title} url={props.url} />
      <ContributerCount total={props.total} contributers={props.contributers} />
    </>
  );
};
