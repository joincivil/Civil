import * as React from "react";
import styled from "styled-components";
import { colors, mediaQueries, FacebookIcon, TwitterIcon } from "@joincivil/components";

export interface BoostShareProps {
  newsroom: string;
  title: string;
  url: string;
}

export class BoostShare extends React.Component<BoostShareProps> {
  public render(): JSX.Element {
    const twitterShare = this.handleTwitter();
    const facebookShare = this.handleFacebook();

    return (
      <>
        <a><FacebookIcon /></a>
        <a href={twitterShare}><TwitterIcon /></a>
      </>
    );
  };

  private handleFacebook = () => {
    const twitterShare = "https://twitter.com/intent/tweet?text=" + encodeURI(this.props.newsroom + this.props.title) + "&url=" + this.props.url;
    return twitterShare;
  };

  private handleTwitter = () => {
    const twitterShare = "https://twitter.com/intent/tweet?text=" + encodeURI(this.props.newsroom + this.props.title) + "&url=" + this.props.url;
    return twitterShare;
  };
}
