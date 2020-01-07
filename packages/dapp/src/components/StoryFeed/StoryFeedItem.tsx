import * as React from "react";
import { Story } from "./Story";
import { StoryFeedItemWrap, StoryElementsFlex } from "./StoryFeedStyledComponents";
import { StoryNewsroomData, OpenGraphData } from "./types";
import { StoryNewsroomStatus, ContributorCount, ContributorData } from "@joincivil/components";
import { PaymentButton, ShareButton, ShareStory, SharePanel } from "@joincivil/elements";

export interface StoryFeedItemProps {
  postId: string;
  activeChallenge: boolean;
  newsroom: StoryNewsroomData;
  openGraphData: OpenGraphData;
  displayedContributors: ContributorData[];
  totalContributors: number;
  openStoryNewsroomDetails(postId: string): void;
  openStoryDetails(postId: string): void;
  openPayments(postId: string): void;
}

export interface StoryFeedItemStates {
  isShareModalOpen: boolean;
}

export class StoryFeedItem extends React.Component<StoryFeedItemProps, StoryFeedItemStates> {
  public constructor(props: any) {
    super(props);
    this.state = {
      isShareModalOpen: false,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <StoryFeedItemWrap>
          <StoryNewsroomStatus
            newsroomName={this.props.newsroom.name}
            activeChallenge={this.props.activeChallenge}
            handleOpenNewsroom={() => this.props.openStoryNewsroomDetails(this.props.postId)}
          />
          <Story
            openGraphData={this.props.openGraphData}
            handleOpenStory={() => this.props.openStoryDetails(this.props.postId)}
          />
          <StoryElementsFlex>
            <ContributorCount
              totalContributors={this.props.totalContributors}
              displayedContributors={this.props.displayedContributors}
            />
            <StoryElementsFlex>
              <PaymentButton onClick={() => this.props.openPayments(this.props.postId)} />
              <ShareButton onClick={this.openShare} />
            </StoryElementsFlex>
          </StoryElementsFlex>
        </StoryFeedItemWrap>
        <SharePanel open={this.state.isShareModalOpen} handleClose={this.handleCloseShare}>
          <ShareStory title={this.props.openGraphData.title} url={this.props.openGraphData.url} />
        </SharePanel>
      </>
    );
  }

  private openShare = () => {
    this.setState({ isShareModalOpen: true });
  };

  private handleCloseShare = () => {
    this.setState({ isShareModalOpen: false });
  };
}
