import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "../styleConstants";
import { InvertedButton } from "../Button";

export const StoryFeedItemWrap = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding: 30px 0;
`;

export const StoryNewsroomStatusStyled = styled.div`
  align-items: center;
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  margin-bottom: 8px;

  svg {
    margin-left: 8px;
  }
`;

export const StoryTitle = styled.h2`
  color: ${colors.primary.BLACK};
  font-family: ${fonts.SANS_SERIF};
  font-size: 17px;
  font-weight: 700;
  line-height: 25px;
  margin-bottom: 8px;
  transition: color 0.2s ease;
`;

export const StoryLink = styled.a`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
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

export const StoryDescription = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 18px;
  margin: 0 0 10px;
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

export const StoryRegistryLabel = styled.div`
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 20px;
`;

export const StoryNewsroomName = styled.div`
  font-size: 17px;
  font-weight: 700;
  line-height: 25px;
  margin-bottom: 2px;
`;

export const StoryNewsroomURL = styled.a`
  color: ${colors.accent.CIVIL_BLUE};
  display: block;
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 10px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const StoryNewsroomSection = styled.div`
  height: 90px;
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

export const TimeStamp = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
`;

export const StoryDetailsFlex = styled.div`
  display: flex;
  margin-bottom: 10px;

  ${StoryNewsroomStatusStyled} {
    margin-right: 10px;
  }
`;

export const BlueLinkBtn = styled.a`
  background-color: ${colors.accent.CIVIL_BLUE};
  border-radius: 2px;
  color: ${colors.basic.WHITE};
  curcor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.2px;
  line-height: 14px;
  padding: 15px;
  opacity: 1;
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
  margin-bottom: 15px;
  padding: 15px 0;
`;

export interface StoryRegistryStatusProps {
  activeChallenge: boolean;
}

export const StoryRegistryStatusTextWrap = styled.div`
  border-left: 1px solid
    ${(props: StoryRegistryStatusProps) =>
      props.activeChallenge ? colors.accent.CIVIL_ORANGE : colors.accent.CIVIL_TEAL};
  padding: 0 15px;
`;

export const RegistryStatusTag = styled.span`
  background-color: ${(props: StoryRegistryStatusProps) =>
    props.activeChallenge ? colors.accent.CIVIL_ORANGE : colors.accent.CIVIL_TEAL};
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

export const StoryModalContain = styled.div`
  font-family: ${fonts.SANS_SERIF};
  overflow: scroll;
  position: relative;
  width: 100%;
`;

export const StoryModalCloseBtn = styled(InvertedButton)`
  border: none;
  padding: 0;
  height: 40px;
  position: absolute;
  right: 5px;
  top: 5px;
  width: 40px;

  svg path {
    transition: fill 0.2s ease;
  }

  &:focus,
  &:hover {
    background-color: transparent;

    svg path {
      fill: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

export const StoryModalHeader = styled.div`
  padding: 20px;
`;

export const StoryModalFullBleedHeader = styled.div`
  height: 110px;
  overflow: hidden;
  width: 100%;
`;

export const StoryModalContent = styled.div`
  background-color: ${colors.basic.WHITE};
  padding: 20px;
`;

export const StoryModalFooter = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding: 30px 20px;
`;
