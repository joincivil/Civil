import * as React from "react";
import styled from "styled-components";
import { ShareEmailIcon, LinkIcon, ShareTwitterIcon } from "../icons";
import { colors } from "../colors";
import { fonts } from "../text";

const ShareWrapper = styled.div`
  width: 300px;
`;

const ShareHeader = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  padding: 20px 15px;

  h2 {
    font-family: ${fonts.SANS_SERIF};
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
    margin: 0 0 10px;
  }
`;

const ShareContent = styled.p`
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 20px;
  margin: 0;

  a {
    color: ${colors.accent.CIVIL_BLUE};
    display: block;
    text-decoration: none;

    &:hover {
      color: ${colors.accent.CIVIL_BLUE};
      text-decoration: underline;
    }
  }
`;

const ShareOptions = styled.div`
  padding: 0 15px 15px;

  a,
  button {
    align-items: center;
    border: none;
    border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
    color: ${colors.primary.BLACK};
    cursor: pointer;
    display: flex;
    font-family: ${fonts.SANS_SERIF};
    font-size: 14px;
    justify-content: space-between;
    line-height: 17px;
    padding: 15px 0;
    text-decoration: none;
    transition: color: 0.2s ease;
    width: 100%;

    &:hover {
      color: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

export interface ShareStoryProps {
  title: string;
  url: string;
}

export class ShareStory extends React.Component<ShareStoryProps> {
  public render(): JSX.Element {
    return (
      <ShareWrapper>
        <ShareHeader>
          <h2>Share</h2>
          <ShareContent>
            {this.props.title}
            <a href={this.props.url} target="_blank">
              {this.props.url}
            </a>
          </ShareContent>
        </ShareHeader>
        <ShareOptions>
          <a href={this.getTweetURL()}>
            <>Share to Twitter</>
            <ShareTwitterIcon />
          </a>
          <a href={this.getEmailURL()}>
            <>Share via Email</>
            <ShareEmailIcon />
          </a>
          {/* TODO(sruddy) add copy embed when embeds are ready
          <a>
            <>Embed Story Boost</>
            <EmbedIcon />
          </a>
          */}
          <button onClick={() => this.copyURL()}>
            <>Copy Link</>
            <LinkIcon />
          </button>
        </ShareOptions>
      </ShareWrapper>
    );
  }

  private getEmailURL = () => {
    const emailShare = "mailto:?subject=" + encodeURI(this.props.title) + "&body=" + encodeURI(this.props.url);
    return emailShare;
  };

  private getTweetURL = () => {
    const twitterShare =
      "https://twitter.com/intent/tweet?text=" + encodeURI(this.props.title) + "&url=" + this.props.url;
    return twitterShare;
  };

  private copyURL = () => {
    const textArea = document.createElement("textarea");
    const storyURL = this.props.url;
    textArea.innerText = storyURL.replace(/ /g, "");
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  };
}
