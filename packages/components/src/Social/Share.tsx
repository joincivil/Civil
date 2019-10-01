import * as React from "react";
import { ShareTwitter } from "./ShareTwitter";
import { ShareEmail } from "./ShareEmail";
import { SocialWrapper, SocialBtnFlex } from "./SocialStyledComponents";

export interface ShareProps {
  label?: string;
  labelEmail?: string;
  labelTwitter?: string;
  handleEmailShare?(ev: any): void;
  handleTwitterShare?(ev: any): void;
}

export const Share: React.FunctionComponent<ShareProps> = props => {
  return (
    <SocialWrapper>
      <label>{props.label || "Follow"}</label>
      <SocialBtnFlex>
        {props.handleTwitterShare && <ShareTwitter handleShare={props.handleTwitterShare} label={props.labelTwitter} />}
        {props.handleEmailShare && <ShareEmail handleShare={props.handleEmailShare} label={props.labelEmail} />}
      </SocialBtnFlex>
    </SocialWrapper>
  );
};
