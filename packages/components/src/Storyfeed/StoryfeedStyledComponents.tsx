import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "../styleConstants";

export const StoryCardLink = styled.a`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const StoryCardTitle = styled.h2`
  font-family: ${fonts.SANS_SERIF};
  font-size: 17px;
  font-weight: 700;
  line-height: 25px;
  margin: 0 0 2px;
`;

export const StoryCardImg = styled.div`
  height: 90px;
  width: 90px;

  img {
    width: 100%;
  }
`;

export const TimeStamp = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
`;
