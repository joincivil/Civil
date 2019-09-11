import * as React from "react";
import styled from "styled-components";
import { colors, mediaQueries, TwitterIcon } from "@joincivil/components";

export interface BoostShareProps {
  newsroom?: string;
  boostId?: string;
}

export class BoostShare extends React.Component<BoostShareProps> {
  public render(): JSX.Element {
    const twitterShare = this.getTweet();

    return (
      <>
        <a href={twitterShare}>
          <TwitterIcon />
        </a>
      </>
    );
  }

  private getTweet = () => {
    const shareText = encodeURI("Support this Boost on @Civil - Help ");
    const url = "https://registry.civil.co/boosts/" + this.props.boostId;
    const twitterShare =
      "https://twitter.com/intent/tweet?text=" + shareText + encodeURI(this.props.newsroom) + "&url=" + url;
    return twitterShare;
  };
}
