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
import { BoostFeed } from "@joincivil/sdk";
import { FeatureFlag, StoryFeedItem, StoryNewsroomDetails, StoryDetails } from "@joincivil/components";
import { urlConstants } from "@joincivil/utils";
import styled from "styled-components";

const contributers = [
  { avatar: "https://picsum.photos/50", username: "violetnight13", amount: "$2.50" },
  { avatar: "https://picsum.photos/50", username: "CaryRay", amount: "$5.00" },
  { avatar: "https://picsum.photos/50", username: "ronburgundy", amount: "0.009214 ETH" },
];

const Container = styled.div`
  padding: 20px;
  width: 400px;
`;

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
          <Container>
            <StoryFeedItem
              activeChallenge={false}
              contractAddress={"0x224b07d2ff8ca3c3757fdfc101922fb4792cc2d7"}
              contributers={contributers}
              description={
                "Uyghurs are gaming TikTok’s algorithm to find a loophole in Xinjiangs’s information lockdown"
              }
              img={"https://codastory.com/wp-content/uploads/2019/09/Still-Header-.png"}
              multisigAddress={"0xe1e345504d9cd4d19bee9c0300a8c8265e62b17c"}
              newsroom={"Coda Story"}
              newsroomAbout={
                "Coda Story puts a team of journalists on one crisis at a time and stays with it, providing unique depth, continuity and understanding to events that shape our world."
              }
              newsroomRegistryURL={"https://codastory.com"}
              newsroomURL={"https://codastory.com"}
              timeStamp={"10 days ago"}
              title={"How TikTok opened a window into China’s police state"}
              total={30}
              url={"https://codastory.com/authoritarian-tech/tiktok-uyghur-china/"}
            />
            <StoryDetails
              contributers={contributers}
              description={
                "Uyghurs are gaming TikTok’s algorithm to find a loophole in Xinjiangs’s information lockdown"
              }
              img={"https://codastory.com/wp-content/uploads/2019/09/Still-Header-.png"}
              newsroom={"Coda Story"}
              timeStamp={"10 days ago"}
              title={"How TikTok opened a window into China’s police state"}
              total={30}
              url={"https://codastory.com/authoritarian-tech/tiktok-uyghur-china/"}
            />
            <StoryNewsroomDetails
              activeChallenge={false}
              contractAddress={"0x224b07d2ff8ca3c3757fdfc101922fb4792cc2d7"}
              multisigAddress={"0xe1e345504d9cd4d19bee9c0300a8c8265e62b17c"}
              newsroom={"Coda Story"}
              newsroomAbout={
                "Coda Story puts a team of journalists on one crisis at a time and stays with it, providing unique depth, continuity and understanding to events that shape our world."
              }
              newsroomURL={"https://codastory.com"}
              newsroomRegistryURL={"https://codastory.com"}
            />
          </Container>
        </FeatureFlag>
      </>
    );
  }
}

export default BoostFeedPage;
