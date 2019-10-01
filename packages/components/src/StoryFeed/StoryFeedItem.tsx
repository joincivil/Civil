import * as React from "react";
import { StoryNewsroomStatus } from "./StoryNewsroomStatus";
import { Story } from "./Story";
import { StoryDetails } from "./StoryDetails";
import { StoryNewsroomDetails } from "./StoryNewsroomDetails";
import { StoryModal } from "./StoryModal";
import { ContributorCount, ContributorData } from "../Contributors";
import { StoryFeedItemWrap } from "./StoryFeedStyledComponents";

export interface StoryFeedItemProps {
  activeChallenge: boolean;
  contractAddress: string;
  description: string;
  img: string;
  multisigAddress: string;
  newsroom: string;
  newsroomAbout: string;
  newsroomRegistryURL: string;
  newsroomURL: string;
  timeStamp: string;
  title: string;
  displayedContributors: ContributorData[];
  sortedContributors: ContributorData[];
  totalContributors: number;
  url: string;
}

export interface StoryFeedItemStates {
  isStoryModalOpen: boolean;
  isStoryNewsroomModalOpen: boolean;
}

export class StoryFeedItem extends React.Component<StoryFeedItemProps, StoryFeedItemStates> {
  public constructor(props: any) {
    super(props);
    this.state = {
      isStoryModalOpen: false,
      isStoryNewsroomModalOpen: false,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <StoryFeedItemWrap>
          <StoryNewsroomStatus
            newsroom={this.props.newsroom}
            activeChallenge={this.props.activeChallenge}
            handleOpenNewsroom={this.openStoryNewsroomDetails}
          />
          <Story
            img={this.props.img}
            timeStamp={this.props.timeStamp}
            title={this.props.title}
            handleOpenStory={this.openStoryDetails}
          />
          <ContributorCount
            totalContributors={this.props.totalContributors}
            displayedContributors={this.props.displayedContributors}
          />
        </StoryFeedItemWrap>
        <StoryModal open={this.state.isStoryModalOpen} handleClose={this.handleClose}>
          <StoryDetails
            activeChallenge={this.props.activeChallenge}
            description={this.props.description}
            img={this.props.img}
            newsroom={this.props.newsroom}
            timeStamp={this.props.timeStamp}
            title={this.props.title}
            displayedContributors={this.props.displayedContributors}
            sortedContributors={this.props.sortedContributors}
            totalContributors={this.props.totalContributors}
            url={this.props.url}
            handleOpenNewsroom={this.openStoryNewsroomDetails}
          />
        </StoryModal>
        <StoryModal open={this.state.isStoryNewsroomModalOpen} handleClose={this.handleClose}>
          <StoryNewsroomDetails
            activeChallenge={this.props.activeChallenge}
            contractAddress={this.props.contractAddress}
            multisigAddress={this.props.multisigAddress}
            newsroom={this.props.newsroom}
            newsroomAbout={this.props.newsroomAbout}
            newsroomURL={this.props.newsroomURL}
            newsroomRegistryURL={this.props.newsroomRegistryURL}
          />
        </StoryModal>
      </>
    );
  }

  private openStoryDetails = () => {
    this.setState({ isStoryModalOpen: true, isStoryNewsroomModalOpen: false });
  };

  private openStoryNewsroomDetails = () => {
    this.setState({ isStoryNewsroomModalOpen: true, isStoryModalOpen: false });
  };

  private handleClose = () => {
    this.setState({ isStoryModalOpen: false, isStoryNewsroomModalOpen: false });
  };
}
