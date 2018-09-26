import * as Reaqct from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts } from "../styleConstants";

const StyledUserStatementHeader = styled.div`
  background: ${colors.accent.CIVIL_YELLOW};
`;

const StatementHeaderHeading = styled.h2`
  color: ${colors.primary.BLACK};
  font-family: ${fonts.SERIF};
  font-size: 32px;
  line-height: 40px;
  margin: 0 0 23px;
`;

const StatementHeaderNewsroomName = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 24px;
  line-height: 29px;
  margin: 0 0 11px;
`;
