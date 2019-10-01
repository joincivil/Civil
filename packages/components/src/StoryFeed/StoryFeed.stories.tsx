import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Story } from "./Story";
import { StoryDetails } from "./StoryDetails";
import { StoryNewsroomDetails } from "./StoryNewsroomDetails";

const Container = styled.div`
  display: flex;
  width: 400px;
`;

const contributers = [
  { avatar: "https://picsum.photos/50", username: "violetnight13", amount: "$2.50" },
  { avatar: "https://picsum.photos/50", username: "CaryRay", amount: "$5.00" },
  { avatar: "https://picsum.photos/50", username: "ronburgundy", amount: "0.009214 ETH" },
];

const onClickFunc = () => {
  console.log("clicked");
};

storiesOf("Pulse / Story Feed", module)
  .add("Story", () => {
    return (
      <Container>
        <Story
          img={"https://codastory.com/wp-content/uploads/2019/09/Untitled-design-2019-09-13T160153.273.png"}
          title={"How TikTok opened a window into China’s police state"}
          timeStamp={"10 mins ago"}
          handleOpenStory={onClickFunc}
        />
      </Container>
    );
  })
  .add("Story Details", () => {
    return (
      <Container>
        <StoryDetails
          activeChallenge={false}
          contributers={contributers}
          description={"Uyghurs are gaming TikTok’s algorithm to find a loophole in Xinjiangs’s information lockdown"}
          img={"https://codastory.com/wp-content/uploads/2019/09/Still-Header-.png"}
          newsroom={"Coda Story"}
          timeStamp={"10 days ago"}
          title={"How TikTok opened a window into China’s police state"}
          totalContributers={30}
          url={"https://codastory.com/authoritarian-tech/tiktok-uyghur-china/"}
          handleOpenNewsroom={onClickFunc}
        />
      </Container>
    );
  })
  .add("Story Newsroom Details", () => {
    return (
      <Container>
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
    );
  });
