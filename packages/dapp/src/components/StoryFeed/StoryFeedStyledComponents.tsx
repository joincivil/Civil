import * as React from "react";
import styled from "styled-components";
import { fonts, mediaQueries } from "@joincivil/components";

export const StoryFeedWrapper = styled.div`
  margin: 0 auto;
  max-width: 600px;
  padding: 50px 0;
  width: 100%;

  ${mediaQueries.MOBILE} {
    padding: 50px 20px;
  }
`;

export const StoryFeedHeader = styled.h1`
  font-family: ${fonts.SANS_SERIF};
  font-size: 36px;
  font-weight: bold;
  line-height: 49px;
  margin-bottom: 20px;

  ${mediaQueries.MOBILE} {
    font-size: 24px;
    line-height: 30px;
  }
`;
