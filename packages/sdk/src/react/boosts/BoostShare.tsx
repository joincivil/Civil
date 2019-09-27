import * as React from "react";
import { colors, ShareEmailIcon, ShareTwitterIcon } from "@joincivil/components";
import styled from "styled-components";

const BoostShareWrap = styled.span`
  display: flex;
  justify-content: space-around;

  a {
    svg path {
      fill: ${colors.accent.CIVIL_GRAY_0};
      transition: fill 0.2s;
    }

    &:hover {
      svg path {
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
      "I just gave " +
      this.props.newsroom +
      " a Boost on the Civil Registry. " +
      this.props.newsroom +
      " also needs your support to make their journalism project a success! " +
      "\n\n" +
      url +
      "\n\n" +
      "Boosts is a peer-to-peer fundraising tool that allows Civil newsrooms to raise funds for specific journalism initiatives. Feel free to pass this email on to anyone you know who may also want to support their project!" +
      "\n\n" +
      "Thank you!";
    const emailShare = "mailto:?subject=" + encodeURI(subjectText) + "&body=" + encodeURI(bodyText);
    return emailShare;
  };

  private getTweetURL = (url: string) => {
    const shareText =
      "Help give " + this.props.newsroom + " a Boost on @Civil by donating to their project: " + this.props.title;
    const twitterShare = "https://twitter.com/intent/tweet?text=" + encodeURI(shareText) + "&url=" + url;
    return twitterShare;
  };
}
