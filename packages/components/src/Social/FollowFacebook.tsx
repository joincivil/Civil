import * as React from "react";
import { ShareTwitterIcon } from "../icons";

export interface FollowFacebookProps {
  url: string;
}

export const FollowFacebook: React.FunctionComponent<FollowFacebookProps> = props => {
  return (
    <a href={props.url} target="_blank">
      {/* TODO(sruddy) get facebook icon */}
      <ShareTwitterIcon />
    </a>
  );
};
