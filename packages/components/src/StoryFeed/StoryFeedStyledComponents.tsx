import * as React from "react";
import styled from "styled-components";
import { colors, fonts, mediaQueries } from "@joincivil/elements";

export const StoryFeedItemWrap = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding: 30px 0;
`;

export const StoryNewsroomStatusStyled = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  margin-bottom: 7px;

  a {
    align-items: center;
    color: ${colors.primary.BLACK};
    cursor: pointer;
    display: flex;
    transition: color 0.2s ease;

    &:hover {
      color: ${colors.accent.CIVIL_BLUE};
    }
  }

  svg {
    margin-left: 5px;
  }
`;

export const StoryTitle = styled.h2`
  color: ${colors.primary.BLACK};
  font-family: ${fonts.SANS_SERIF};
  font-size: 17px;
  font-weight: 700;
  line-height: 25px;
  margin: 0 0 8px;
  transition: color 0.2s ease;
`;

export const StoryLink = styled.a`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;

  &:hover {
    ${StoryTitle} {
      color: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

export const StoryLinkLeft = styled.div`
  width: calc(100% - 100px);
`;

export const TimeStamp = styled.div`
  color: ${colors.accent.CIVIL_GRAY_3};
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
`;

export const TimeStampDot = styled.span`
  font-weight: 800;
  margin-right: 6px;
`;

export const StoryDescription = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 18px;
  margin: 0 0 15px;
`;

export const StoryPostedAt = styled.div`
  margin: 0 0 16px;

  ${TimeStamp} {
    font-size: 11px;
    line-height: 13px;
  }
`;

export const StoryImgSquare = styled.div`
  display: flex;
  height: 90px;
  justify-content: center;
  overflow: hidden;
  width: 90px;

  img {
    height: 100%;
    width: auto;
  }
`;

export const StoryImgWide = styled.div`
  align-items: flex-start;
  display: flex;
  height: 100px;
  overflow: hidden;
  width: 100%;

  img {
    width: 100%;
  }
`;

export const StoryElementsFlex = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  button:first-of-type {
    margin-right: 10px;
  }
`;

export const StoryRegistryLabel = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 20px;
`;

export const StoryNewsroomName = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  margin-bottom: 5px;
`;

export const StoryNewsroomURL = styled.a`
  color: ${colors.accent.CIVIL_BLUE};
  display: block;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 22px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const StoryNewsroomSection = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  margin-bottom: 12px;
  width: 100%;

  h2 {
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    text-transform: uppercase;
    margin: 0 0 8px;
  }

  h3 {
    font-size: 13px;
    font-weight: 400;
    line-height: 22px;
    margin: 0;
  }

  p {
    font-size: 13px;
    font-weight: 400;
    line-height: 18px;
    margin: 0 0 8px;

    &:last-of-type {
      margin: 0;
    }
  }
`;

export const StoryETHAddress = styled.span`
  font-family: ${fonts.MONOSPACE};
  font-size: 11px;
  line-height: 13px;
  margin-bottom: 10px;
`;

export const StoryDetailsFlex = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;

  ${StoryTitle} {
    width: calc(100% - 45px);
  }
`;

export const StoryDetailsFlexLeft = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 10px;

  ${StoryNewsroomStatusStyled} {
    margin: 0 6px 0 0;
  }
`;

export const BlueLinkBtn = styled.a`
  align-items: center;
  background-color: ${colors.accent.CIVIL_BLUE};
  border-radius: 2px;
  color: ${colors.basic.WHITE};
  cursor: pointer;
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  font-weight: 700;
  justify-content: center;
  letter-spacing: 0.2px;
  min-height: 20px;
  opacity: 1;
  padding: 8px;
  text-decoration: none;
  transition: opactiy 0.2s ease;
  width: 100%;

  &:hover {
    color: ${colors.basic.WHITE};
    opacity: 0.75;
  }
`;

export const StoryRegistryDetailsStyled = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin-bottom: 20px;
  padding: 20px 0;
`;

export interface StoryRegistryStatusProps {
  activeChallenge: boolean;
}

export const StoryRegistryStatusTextWrap = styled.div`
  border-left: 1px solid
    ${(props: StoryRegistryStatusProps) =>
      props.activeChallenge ? colors.accent.CIVIL_ORANGE : colors.accent.CIVIL_TEAL};
  padding: 0 50px 0 15px;
  position: relative;

  p {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 14px;
    line-height: 18px;
    margin: 0;
  }

  svg {
    position: absolute;
    right: 0;
    top: calc(50% - 20px);
  }
`;

export const RegistryStatusTag = styled.span`
  background-color: ${(props: StoryRegistryStatusProps) =>
    props.activeChallenge ? colors.accent.CIVIL_ORANGE : colors.accent.CIVIL_TEAL_DARK};
  color: ${(props: StoryRegistryStatusProps) =>
    props.activeChallenge ? colors.accent.CIVIL_GRAY_0 : colors.basic.WHITE};
  font-family: ${fonts.SANS_SERIF};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.92px;
  line-height: 15px;
  padding: 2px 4px;
  text-transform: uppercase;
`;

export interface StoryModalProps {
  maxHeight: number;
}

export const StoryModalContain = styled.div`
  font-family: ${fonts.SANS_SERIF};
  overflow: auto;
  position: relative;
  max-height: ${(props: StoryModalProps) => props.maxHeight + "px"};
  width: 500px;

  ${mediaQueries.MOBILE} {
    width: 450px;
  }

  ${mediaQueries.MOBILE_SMALL} {
    height: 100%;
    max-height: 100%;
    width: 100%;
  }
`;

export const StoryModalCloseBtn = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 1;
`;

export const StoryDetailsHeader = styled.div`
  font-family: ${fonts.SANS_SERIF};
  padding: 20px 20px 0;
`;

export const StoryDetailsFullBleedHeader = styled.div`
  height: 100px;
  overflow: hidden;
  width: 100%;
`;

export const StoryDetailsContent = styled.div`
  background-color: ${colors.basic.WHITE};
  font-family: ${fonts.SANS_SERIF};
  padding: 20px;
`;

export const StoryDetailsFooter = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding: 20px;
`;

export const StoryDetailsFooterFlex = styled.div`
  display: flex;
  justify-content: space-between;

  button,
  a {
    width: 48%;
  }
`;
