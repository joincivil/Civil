import * as React from "react";
import { FollowFacebook } from "./FollowFacebook";
import { FollowTwitter } from "./FollowTwitter";
import { SocialWrapper, SocialBtnFlex } from "./SocialStyledComponents";

export interface FollowProps {
  label?: string;
  facebookURL?: string;
  twitterURL?: string;
}

export const Follow: React.FunctionComponent<FollowProps> = props => {
  return (
    <SocialWrapper>
      <label>{props.label || "Follow"}</label>
      <SocialBtnFlex>
        {props.facebookURL && <FollowFacebook url={props.facebookURL} />}
        {props.twitterURL && <FollowTwitter url={props.twitterURL} />}
      </SocialBtnFlex>
    </SocialWrapper>
  );
};
