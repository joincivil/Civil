import * as React from "react";
import { Helmet } from "react-helmet";
import { StoryFeedMarquee } from "./StoryFeedMarquee";
import { StoryFeedWrapper, StoryFeedLabel } from "./StoryFeedStyledComponents";
import StoryFeed from "./StoryFeed";
import { CivilContext, ICivilContext } from "@joincivil/components";

export interface StoryFeedPageProps {
  match: any;
  location: any;
  history: any;
  payment?: boolean;
  newsroom?: boolean;
}

class StoryFeedPage extends React.Component<StoryFeedPageProps> {
  public static contextType = CivilContext;
  public static context: ICivilContext;
  public render(): JSX.Element {
    return (
      <>
        <Helmet title="Civil Story Boosts - The Civil Registry" />
        <StoryFeedMarquee />
        <StoryFeedWrapper>
          <StoryFeedLabel>Recent Stories</StoryFeedLabel>
          <StoryFeed
            queryFilterAlg="vw_post_fair_with_interleaved_boosts_2"
            match={this.props.match}
            payment={this.props.payment}
            newsroom={this.props.newsroom}
            onCloseStoryBoost={this.closeStoryBoost}
            onOpenStoryDetails={this.openStoryDetails}
            onOpenPayments={this.openPayments}
            onOpenNewsroomDetails={this.openStoryNewsroomDetails}
          />
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
    this.context.fireAnalyticsEvent("story boost", "story details clicked", postId);
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/storyfeed/" + postId,
    });
  };

  private openPayments = (postId: string) => {
    this.context.fireAnalyticsEvent("story boost", "boost button clicked", postId);
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/storyfeed/" + postId + "/payment",
    });
  };

  private openStoryNewsroomDetails = (postId: string) => {
    this.context.fireAnalyticsEvent("story boost", "newsroom details clicked", postId);
    let urlBase = this.props.location.pathname;
    urlBase = urlBase.substring(0, urlBase.indexOf("/"));
    this.props.history.push({
      pathname: urlBase + "/storyfeed/" + postId + "/newsroom",
    });
  };
}

export default StoryFeedPage;
