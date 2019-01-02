import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts } from "./styleConstants";

export const ModalHeading = styled.h2`
  font-family: ${fonts.SANS_SERIF};
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
`;

export const ModalContent = styled.p`
  font-family: ${fonts.SANS_SERIF};
  color: ${colors.primary.CIVIL_GRAY_2};
  font-weight: 200;
  font-size: 12px;
  line-height: 24px;
`;

export const ModalContentInsetContainer = styled.div`
  background: ${colors.accent.CIVIL_GRAY_4};
  margin: 24px -35px 32px;
  padding: 20px 40px;
  text-align: left;

  & ${ModalContent} {
    font-size: 16px;
    line-height: 26px;
  }
`;

export const ModalStepLabel = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 14px;
  line-height: 17px;
  margin: 0 0 35px;
  text-transform: uppercase;
`;

export const ModalUnorderedList = styled.ol`
  display: flex;
  flex-flow: column;
  font-size: 14px;
  line-height: 19px;
`;

export const ModalOrderedList = styled.ol`
  align-items: center;
  display: flex;
  flex-flow: column;
  font-size: 14px;
  line-height: 19px;
`;

export interface ModalListItemProps {
  type?: string;
}

export interface ModalListItemColorsProps {
  [index: string]: [string, string, string];
}

export enum ModalListItemTypes {
  FADED = "faded",
  STRONG = "strong",
}

export const StyledModalErrorContainer = styled.div`
  align-items: center;
  display: flex;
  background: ${colors.accent.CIVIL_RED_VERY_FADED};
  border-radius: 50%;
  justify-content: center;
  height: 100px;
  margin: 0 auto;
  text-align: center;
  width: 100px;
`;

const ModalListItemStyles: ModalListItemColorsProps = {
  [ModalListItemTypes.FADED]: [colors.accent.CIVIL_GRAY_3, "italic", "normal"],
  [ModalListItemTypes.STRONG]: [colors.primary.CIVIL_BLUE_1, "normal", "bold"],
};

export const ModalListItem = styled<ModalListItemProps, "li">("li")`
  color: ${props => (props.type && ModalListItemStyles[props.type][0]) || colors.primary.CIVIL_GRAY_2}
  font-style: ${props => (props.type && ModalListItemStyles[props.type][1]) || "normal"};
  font-weight: ${props => (props.type && ModalListItemStyles[props.type][2]) || "normal"};
  margin: 0 0 5px;
  white-space: nowrap;
`;
