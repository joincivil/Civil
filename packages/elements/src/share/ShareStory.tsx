import * as React from "react";
import styled from "styled-components";
import { ShareEmailIcon, LinkIcon, ShareTwitterIcon, HollowGreenCheck } from "../icons";
import { colors } from "../colors";
import { fonts } from "../text";
import { mediaQueries } from "../containers";

const ShareWrapper = styled.div`
  width: 360px;

  ${mediaQueries.MOBILE} {
    width: 100%;
  }
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
    overflow-wrap: break-word;
    text-decoration: none;
    word-wrap: break-word;

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
    background-color: ${colors.basic.WHITE};
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
    transition: color 0.2s ease;
    width: 100%;

    &:hover {
      color: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

const ShareCopyFeedback = styled.span`
  align-items: center;
  display: flex;
  font-size: 13px;
  margin-top: 5px;
  width: 100%;

  svg {
    margin-right: 3px;
  }
`;

export interface ShareStoryProps {
  title: string;
  url: string;
}

export interface ShareStoryState {
  copied: boolean;
}

export class ShareStory extends React.Component<ShareStoryProps, ShareStoryState> {
  public constructor(props: ShareStoryProps) {
    super(props);
    this.state = {
      copied: false,
    };
  }

  public render(): JSX.Element {
    return (
      <ShareWrapper>
        <ShareHeader>
          <h2>Share</h2>
          <ShareContent>
            {this.props.title}
            {this.state.copied ? (
              <ShareCopyFeedback>
                <HollowGreenCheck width={15} height={15} />
                copied
              </ShareCopyFeedback>
            ) : (
              <a href={this.props.url} target="_blank">
                {this.props.url}
              </a>
            )}
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

  // @TODO This should ideally re-use `copyToClipboard` from `utils`, but `elements` shouldn't depend on `utils`. Either this should be in `components`, or should be in some new package that has fewer deps than `components` but more than `elements`, and/or we break out some stuff from `utils` because right now `utils` depends on everything too.
  private copyURL = () => {
    const textArea = document.createElement("textarea");
    textArea.innerText = this.props.url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();

    this.setState({ copied: true });
  };
}
