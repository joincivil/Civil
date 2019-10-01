import * as React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import { Share } from "./Share";
import { ShareTwitter } from "./ShareTwitter";
import { ShareEmail } from "./ShareEmail";

import { Follow } from "./Follow";
import { FollowFacebook } from "./FollowFacebook";
import { FollowTwitter } from "./FollowTwitter";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

const handleShare = () => console.log("Share");

storiesOf("Pattern Library / Social", module)
  .add("Share component", () => {
    return (
      <Container>
        <Share handleEmailShare={handleShare} handleTwitterShare={handleShare} />
      </Container>
    );
  })
  .add("Share on Twitter", () => {
    return (
      <Container>
        <ShareTwitter handleShare={handleShare} />
      </Container>
    );
  })
  .add("Share via Email", () => {
    return (
      <Container>
        <ShareEmail handleShare={handleShare} />
      </Container>
    );
  })
  .add("Follow component", () => {
    return (
      <Container>
        <Follow facebookURL={"https://www.facebook.com/JoinCivil/"} twitterURL={"https://facebook.com/Civil"} />
      </Container>
    );
  })
  .add("Follow on Twitter", () => {
    return (
      <Container>
        <FollowFacebook url={"https://www.facebook.com/JoinCivil/"} />
      </Container>
    );
  })
  .add("Follow on Facebook", () => {
    return (
      <Container>
        <FollowTwitter url={"https://facebook.com/Civil"} />
      </Container>
    );
  });
