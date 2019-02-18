import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { fonts, colors } from "./styleConstants";

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

export const PageHeadingCentered = styled.h2`
  font-family: ${props => props.theme.sansSerifFont};
  font-weight: 800;
  font-size: 25px;
  line-height: 50px;
  letter-spacing: -0.58px;
  margin: 0;
  text-align: center;
`;

PageHeadingCentered.defaultProps = headingDefaultProps;

export const PageSubHeadingCentered = styled.h2`
  font-family: ${props => props.theme.sansSerifFont};
  font-weight: 500;
  font-size: 21px;
  font-weight: bold;
  line-height: 50px;
  text-align: center;
`;

PageSubHeadingCentered.defaultProps = headingDefaultProps;

export const PageHeadingTextCentered = styled.div`
  text-align: center;
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 14px;
  line-height: 25px;
`;
