import * as React from "react";
import { BoostHeaderWrapper, BoostHeader, BoostWrapper, BoostIntro, BoostLearnMore } from "./BoostStyledComponents";
import { Helmet } from "react-helmet";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { BoostFeed } from "@joincivil/civil-sdk";
import { urlConstants } from "@joincivil/utils";

class BoostFeedPage extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <Helmet title="Civil Boost - The Civil Registry" />
        <ScrollToTopOnMount />
        <BoostHeaderWrapper>
          <BoostHeader>
            <h1>Boosts: support the work that journalists do.</h1>
            <BoostIntro>
              Newsrooms around the world need your help to fund and start new projects. These Newsrooms are setting up
              Boosts to help in get the word out with what they want to do and let their supporters and fans, like you,
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
      </>
    );
  }
}

export default BoostFeedPage;
