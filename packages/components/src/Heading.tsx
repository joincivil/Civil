import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { fonts } from "./styleConstants";

export const Heading = styled.h1`
  font-family: ${fonts.SERIF};
  font-size: 24px;
  font-weight: 300;
  margin: 5px 0;
`;
export const SectionHeading = styled.h1`
  font-family: ${fonts.SERIF};
  font-size: 22px;
  font-weight: 700;
  margin: 15px 0;
`;

export const SubHeading = styled.h2`
  font-family: ${fonts.SERIF};
  font-weight: 200;
  font-size: 20px;
  margin: 0;
`;

export const BlockHeading = styled.h3`
  font-family: ${fonts.SANS_SERIF};
  font-weight: 600;
  font-size: 15px;
  text-transform: uppercase;
  margin: 0;
`;
