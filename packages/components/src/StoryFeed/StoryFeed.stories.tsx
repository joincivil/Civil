import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Story } from "./Story";
import { StoryDetails } from "./StoryDetails";
import { StoryNewsroomDetails } from "./StoryNewsroomDetails";

const Container = styled.div`
  width: 400px;
`;

const contributors = [
  {
    usdEquivalent: 2.5,
    payerChannel: {
      handle: "violetnight13",
      tiny72AvatarDataUrl: "https://picsum.photos/50",
    },
  },
  {
    usdEquivalent: 3,
    payerChannel: {
      handle: "CaryRay",
      tiny72AvatarDataUrl: "https://picsum.photos/50",
    },
  },
  {
    usdEquivalent: 5,
    payerChannel: {
      handle: "ronburgundy",
      tiny72AvatarDataUrl: "https://picsum.photos/50",
    },
  },
];

const newsroom = {
  contractAddress: "0x224b07d2ff8ca3c3757fdfc101922fb4792cc2d7",
  multisigAddress: "0xe1e345504d9cd4d19bee9c0300a8c8265e62b17c",
  charter: {
    name: "Coda Story",
    newsroomUrl: "https://codastory.com",
    mission: {
      purpose:
        "Coda Story puts a team of journalists on one crisis at a time and stays with it, providing unique depth, continuity and understanding to events that shape our world.",
    },
  },
};

const openGraphData = {
  description: "Uyghurs are gaming TikTok’s algorithm to find a loophole in Xinjiangs’s information lockdown",
  images: [
    {
      url: "https://codastory.com/wp-content/uploads/2019/09/Still-Header-.png",
    },
  ],
  title: "How TikTok opened a window into China’s police state",
  url: "https://codastory.com/authoritarian-tech/tiktok-uyghur-china/",
};

const onClickFunc = () => {
  console.log("clicked");
};

storiesOf("Pulse / Story Feed", module)
  .add("Story", () => {
    return (
      <Container>
        <Story createdAt={"2019-08-28T15:58:32Z"} openGraphData={openGraphData} handleOpenStory={onClickFunc} />
      </Container>
    );
  })
  .add("Story Details", () => {
    return (
      <Container>
        <StoryDetails
          activeChallenge={false}
          createdAt={"2019-08-28T15:58:32Z"}
          newsroom={newsroom}
          openGraphData={openGraphData}
          displayedContributors={contributors}
          sortedContributors={contributors}
          totalContributors={30}
          handleOpenNewsroom={onClickFunc}
        />
      </Container>
    );
  })
  .add("Story Newsroom Details", () => {
    return (
      <Container>
        <StoryNewsroomDetails activeChallenge={false} newsroom={newsroom} />
      </Container>
    );
  });
