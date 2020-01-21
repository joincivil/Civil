import * as React from "react";
import { Helmet } from "react-helmet";
import { StoryFeedMarquee } from "./StoryFeedMarquee";
import { StoryFeedWrapper, StoryFeedLabel } from "./StoryFeedStyledComponents";
import StoryFeed from "./StoryFeed";

export interface StoryFeedPageProps {
  match: any;
  location: any;
  history: any;
  payment?: boolean;
  newsroom?: boolean;
}

class StoryFeedPage extends React.Component<StoryFeedPageProps> {
  public render(): JSX.Element {
    return (
      <>
        <Helmet title="Civil Story Boosts - The Civil Registry" />
        <StoryFeedMarquee />
        <StoryFeedWrapper>
          <StoryFeedLabel>Recent Stories</StoryFeedLabel>
          <StoryFeed
            match={this.props.match}
            payment={this.props.payment}
            newsroom={this.props.newsroom}
            onCloseStoryBoost={this.closeStoryBoost}
            onOpenStoryDetails={this.openStoryDetails}
            onOpenPayments={this.openPayments}
            onOpenNewsroomDetails={this.openStoryNewsroomDetails}/>
        </StoryFeedWrapper>
      </>
    );
  }

  private closeStoryBoost = () => {
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/storyfeed",
    });
  };

  private openStoryDetails = (postId: string) => {
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/storyfeed/" + postId,
    });
  };

  private openPayments = (postId: string) => {
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/storyfeed/" + postId + "/payment",
    });
  };

  private openStoryNewsroomDetails = (postId: string) => {
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/storyfeed/" + postId + "/newsroom",
    });
  };
}

export default StoryFeedPage;
