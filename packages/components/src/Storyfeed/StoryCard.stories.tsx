import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { StoryCard } from "./StoryCard";

const Container = styled.div`
  display: flex;
  width: 400px;
`;

storiesOf("Story Feed / Story Card", module).add("Share component", () => {
  return (
    <Container>
      <StoryCard
        img={"https://codastory.com/wp-content/uploads/2019/09/Untitled-design-2019-09-13T160153.273.png"}
        newsroom={"Coda"}
        title={"‘Anywhere You Live, There is Your Home’: Story of a Refugee Holding on in Berlin’s Tempelhof"}
        timeStamp={"10 mins ago"}
        url={"https://codastory.com/authoritarian-tech/tiktok-uyghur-china/"}
      />
    </Container>
  );
});
