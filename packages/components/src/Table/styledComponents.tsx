import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { TableCellProps } from "./types";

export const StyledTable = styled.table`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-collapse: collapse;
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  line-height: 19px;
`;

export const StyledTableHeader = styled.th`
  background-color: ${(props: TableCellProps) =>
    props.accent ? colors.accent.CIVIL_BLUE_VERY_FADED : colors.accent.CIVIL_GRAY_4};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.CIVIL_GRAY_1};
  font-weight: 600;
  letter-spacing: -0.11px;
  padding: 20px 16px;
  text-align: ${(props: TableCellProps) => props.align || "left"};
`;

export const StyledTableCell = styled.td`
  background-color: ${(props: TableCellProps) =>
    props.accent ? colors.accent.CIVIL_GRAY_4 + "7D" : colors.basic.WHITE};
  border: solid ${colors.accent.CIVIL_GRAY_4};
  border-width: ${(props: TableCellProps) => props.borderWidth || "1px 0"};
  padding: 20px 16px;
  text-align: ${(props: TableCellProps) => props.align || "left"};
`;

export interface StyledTabAccentTextProps {
  strong?: boolean;
}

export const StyledTableAccentText = styled.span`
  color: ${colors.accent.CIVIL_BLUE};
  cursor: pointer;
  font-weight: ${(props: StyledTabAccentTextProps) => (props.strong ? "bold" : "normal")};
`;

export const StyledTableRow = styled.tr`
  &:hover ${StyledTableCell} {
    background-color: ${colors.accent.CIVIL_BLUE};
    color: ${colors.basic.WHITE};
  }

  &:hover ${StyledTableAccentText} {
    color: ${colors.basic.WHITE};
  }
`;
