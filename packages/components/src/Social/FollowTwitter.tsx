import * as React from "react";
import { ShareTwitterIcon } from "../icons";

export interface FollowTwitterProps {
  url: string;
}

export const FollowTwitter: React.FunctionComponent<FollowTwitterProps> = props => {
  return (
    <a href={props.url} target="_blank">
      <ShareTwitterIcon />
    </a>
  );
};
