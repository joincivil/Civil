import * as React from "react";
import {
  BoostHeaderWrapper,
  BoostHeader,
  BoostWrapper,
  BoostIntro,
  BoostLearnMore,
  ComingSoonText,
} from "./BoostStyledComponents";
import { Helmet } from "react-helmet";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { FeatureFlag } from "@joincivil/components";
import { urlConstants } from "@joincivil/utils";
import StoryFeed from "../StoryFeed/StoryFeed";

class BoostFeedPage extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <Helmet title="Civil Project Boost - The Civil Registry" />
        <ScrollToTopOnMount />
        <FeatureFlag feature={"boosts-mvp"} replacement={<ComingSoonText />}>
          <BoostHeaderWrapper>
            <BoostHeader>
              <h1>Project Boosts: support the work that journalists do.</h1>
              <BoostIntro>
                Newsrooms around the world need your help to fund and start new projects. These Newsrooms are setting up
                Project Boosts to help get the word out about what they want to do and let their supporters and fans,
                like you, help them do it. Support these newsrooms by funding their Project Boosts to help hit their
                goals. Good reporting costs money, and the Civil community is making it happen.{" "}
                <BoostLearnMore href={urlConstants.FAQ_BOOSTS} target="_blank">
                  Learn More
                </BoostLearnMore>
              </BoostIntro>
            </BoostHeader>
          </BoostHeaderWrapper>
          <BoostWrapper>
            <StoryFeed
              queryFilterAlg="vw_post_boost_chronological"
              match={this.props.match}
              payment={false}
              newsroom={false}
            />
          </BoostWrapper>
        </FeatureFlag>
      </>
    );
  }
}

export default BoostFeedPage;
