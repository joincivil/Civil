import * as React from "react";
import { colors, ShareEmailIcon, ShareTwitterIcon } from "@joincivil/components";
import styled from "styled-components";

const BoostShareWrap = styled.span`
  display: flex;
  justify-content: space-around;

  a {
    .email-share-icon,
    .twitter-share-icon {
      fill: ${colors.accent.CIVIL_GRAY_2};
      transition: fill 0.2s;
    }

    &:hover {
      .email-share-icon,
      .twitter-share-icon {
        fill: ${colors.accent.CIVIL_BLUE};
      }
    }
  }
`;

export interface BoostShareProps {
  newsroom: string;
  title: string;
  boostId: string;
}

export class BoostShare extends React.Component<BoostShareProps> {
  public render(): JSX.Element {
    const boostUrl = "https://registry.civil.co/boosts/" + this.props.boostId;
    const twitterShare = this.getTweetURL(boostUrl);
    const emailShare = this.getEmailURL(boostUrl);

    return (
      <BoostShareWrap>
        <a href={twitterShare} target="_blank">
          <ShareTwitterIcon />
        </a>
        <a href={emailShare} target="_blank">
          <ShareEmailIcon />
        </a>
      </BoostShareWrap>
    );
  }

  private getEmailURL = (url: string) => {
    const subjectText = "Support this newsroom with a Boost";
    const bodyText =
      "Support this newsroom on Civil - " +
      this.props.title +
      "%0D%0D" +
      url +
      "%0D%0D" +
      this.props.newsroom +
      "%0D%0D" +
      " are using Civil Boosts. Boosts are a peer-to-peer fundraising tool that allows newsrooms on the Registry to raise funds for specific journalism initiatives." +
      "%0D%0D" +
      "Pass this along to anyone else you know who may want to support a newsroom Boost." +
      "%0D%0D" +
      "Thanks!";
    const emailShare = "mailto:?subject=" + encodeURI(subjectText) + "&amp;body=" + encodeURI(bodyText);
    return emailShare;
  };

  private getTweetURL = (url: string) => {
    const shareText = "Support this Boost on @Civil - " + this.props.title;
    const twitterShare = "https://twitter.com/intent/tweet?text=" + encodeURI(shareText) + "&url=" + url;
    return twitterShare;
  };
}
