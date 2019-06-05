import * as React from "react";
import { BoostHeaderWrapper, BoostHeader, BoostWrapper, BoostIntro, ComingSoonText } from "./BoostStyledComponents";
import { Helmet } from "react-helmet";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { BoostFeed } from "@joincivil/civil-sdk";
import { FeatureFlag } from "@joincivil/components";

class BoostFeedPage extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <Helmet title="Civil Boost - The Civil Registry" />
        <ScrollToTopOnMount />
        <FeatureFlag feature={"boost"} replacement={<ComingSoonText />}>
          <BoostHeaderWrapper>
            <BoostHeader>
              <h1>Civil Boost</h1>
            </BoostHeader>
          </BoostHeaderWrapper>
          <BoostWrapper>
            <BoostIntro>
              <p>
                Newsrooms around the world need your help to fund and start new projects. These Newsrooms are setting up
                Boosts to help in get the word out with what they want to do and let their supporters and fans, like
                you, help them do it. Support these newsrooms by funding their Boosts to help hit their goals. Good
                reporting costs money, and the Civil community is making it happen.
              </p>
            </BoostIntro>
            <BoostFeed />
          </BoostWrapper>
        </FeatureFlag>
      </>
    );
  }
}

export default BoostFeedPage;
