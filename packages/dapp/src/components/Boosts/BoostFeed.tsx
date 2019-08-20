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
import { BoostFeed } from "@joincivil/civil-sdk";
import { FeatureFlag } from "@joincivil/components";
import { urlConstants } from "@joincivil/utils";

class BoostFeedPage extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <Helmet title="Civil Boost - The Civil Registry" />
        <ScrollToTopOnMount />
        <FeatureFlag feature={"boosts-mvp"} replacement={<ComingSoonText />}>
          <BoostHeaderWrapper>
            <BoostHeader>
              <h1>Boosts: support the work that journalists do.</h1>
              <BoostIntro>
                Newsrooms around the world need your help to fund and start new projects. These Newsrooms are setting up
                Boosts to help get the word out about what they want to do and let their supporters and fans, like you,
                help them do it. Support these newsrooms by funding their Boosts to help hit their goals. Good reporting
                costs money, and the Civil community is making it happen.
                <BoostLearnMore href={urlConstants.FAQ_BOOSTS} target="_blank">
                  Learn More &gt;
                </BoostLearnMore>
              </BoostIntro>
            </BoostHeader>
          </BoostHeaderWrapper>
          <BoostWrapper>
            <BoostFeed />
          </BoostWrapper>
        </FeatureFlag>
      </>
    );
  }
}

export default BoostFeedPage;
