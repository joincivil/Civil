import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";

export const CircleBorder = styled.div`
  align-items: center;
  border: 1px solid ${colors.accent.CIVIL_BLUE};
  border-radius: 50%;
  display: flex;
  height: 38px;
  width: 38px;
`;
