import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { fonts } from "./styleConstants";

const headingDefaultProps = {
  theme: {
    sansSerifFont: fonts.SANS_SERIF,
    serifFont: fonts.SERIF,
  },
};

export const Heading = styled.h1`
  font-family: ${props => props.theme.serifFont};
  font-size: 24px;
  font-weight: 300;
  margin: 5px 0;
`;

Heading.defaultProps = headingDefaultProps;

export const SectionHeading = styled.h1`
  font-family: ${props => props.theme.serifFont};
  font-size: 22px;
  font-weight: 700;
  margin: 15px 0;
`;

SectionHeading.defaultProps = headingDefaultProps;

export const SubHeading = styled.h2`
  font-family: ${props => props.theme.serifFont};
  font-weight: 200;
  font-size: 20px;
  margin: 0;
`;

SubHeading.defaultProps = headingDefaultProps;

export const BlockHeading = styled.h3`
  font-family: ${props => props.theme.sansSerifFont};
  font-weight: 600;
  font-size: 15px;
  text-transform: uppercase;
  margin: 0;
`;

BlockHeading.defaultProps = headingDefaultProps;

export const ManagerHeading = styled.h3`
  font-family: ${props => props.theme.sansSerifFont};
  font-weight: 600;
  font-size: 18px;
`;

ManagerHeading.defaultProps = headingDefaultProps;

export const ManagerSectionHeading = styled.h4`
  font-family: ${props => props.theme.sansSerifFont};
  font-weight: 500;
  font-size: 17px;
`;

ManagerSectionHeading.defaultProps = headingDefaultProps;
