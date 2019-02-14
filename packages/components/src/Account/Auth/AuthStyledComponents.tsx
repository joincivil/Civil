import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../../styleConstants";

export const CheckboxContainer = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 0;
`;

export const CheckboxSection = styled.li`
  margin-bottom: 10px;
`;

export const CheckboxLabel = styled.span`
  color: ${colors.primary.CIVIL_GRAY_1};
  font: 400 12px/20px ${fonts.SANS_SERIF};
  padding-left: 7px;
`;

export const ConfirmButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;
