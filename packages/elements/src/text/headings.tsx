import * as React from "react";
import styled from "styled-components";

export const Heading = styled.span`
  display: block;
  margin: 6px;
  color: ${props => props.theme.headingColor};
  font-family: ${props => props.theme.headingFont};
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
`;

export const SubHeading = styled.span`
  display: block;
  margin: 6px;
  color: ${props => props.theme.subheadingColor};
  font-family: ${props => props.theme.headingFont};
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
`;
