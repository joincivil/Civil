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
    const subjectText = "Support this Boost on Civil";
    const bodyText = "Support this Boost on @Civil - Help " + this.props.newsroom + " " + url;
    const emailShare = "mailto:?subject=" + encodeURI(subjectText) + "&amp;body=" + encodeURI(bodyText);
    return emailShare;
  };

  private getTweetURL = (url: string) => {
    const shareText = "Support this Boost on @Civil - Help ";
    const twitterShare =
      "https://twitter.com/intent/tweet?text=" + encodeURI(shareText + this.props.newsroom) + "&url=" + url;
    return twitterShare;
  };
}
