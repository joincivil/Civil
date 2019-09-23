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
    const subjectText = "You can support " + this.props.newsroom + " with a Boost";
    const bodyText =
      "I just gave supported " +
      this.props.newsroom +
      " a Boost on the Civil Registry. Now, " +
      this.props.newsroom +
      " also needs your support to make their journalism project a success! " +
      "%0D%0D" +
      +url +
      +"%0D%0D" +
      +"Boosts is a peer-to-peer fundraising tool that allows Civil newsrooms to raise funds for specific journalism initiatives. Feel free to pass this email on to anyone you know who may also want to support their project!" +
      +"%0D%0D" +
      +"Thank you!";
    const emailShare = "mailto:?subject=" + encodeURI(subjectText) + "&amp;body=" + encodeURI(bodyText);
    return emailShare;
  };

  private getTweetURL = (url: string) => {
    const shareText =
      "Help give " + this.props.newsroom + " a Boost on @Civil by donating to their project - " + this.props.title;
    const twitterShare = "https://twitter.com/intent/tweet?text=" + encodeURI(shareText) + "&url=" + url;
    return twitterShare;
  };
}
