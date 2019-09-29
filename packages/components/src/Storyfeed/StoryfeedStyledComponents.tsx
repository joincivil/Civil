import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "../styleConstants";

export const StoryLink = styled.a`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const StoryNewsroomName = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
`;

export const StoryTitle = styled.h2`
  font-family: ${fonts.SANS_SERIF};
  font-size: 17px;
  font-weight: 700;
  line-height: 25px;
  margin: 0 0 2px;
`;

export const StoryDescription = styled.p`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 18px;
  margin: 0 0 2px;
`;

export const StoryImgSquare = styled.div`
  height: 90px;
  width: 90px;

  img {
    width: 100%;
  }
`;

export const StoryImgWide = styled.div`
  height: 90px;
  width: 100%;

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

export const StoryCardFooter = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE};
  padding: 15px;
`;

export const ReadMoreBtn = styled.a`
  color: ${colors.basic.WHITE};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.2px;
  line-height: 14px;
  padding: 15px;
`;

export const CivilStatusInfo = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE};
  padding: 15px;
`;
