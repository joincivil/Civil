import * as React from "react";
import styled from "styled-components";

import { colors } from "../colors/index";

import { DarkButton } from "./Button";

export const CTAButton = styled(DarkButton)`
  border: 2px solid ${colors.basic.WHITE};
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  margin-left: 30px;
  text-align: center;
  width: 180px;
  &:hover {
    background: ${colors.basic.WHITE};
    color: ${colors.primary.BLACK};
  }
`;
