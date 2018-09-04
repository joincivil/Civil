import * as React from "react";
import { TableCellProps } from "./types";
import { StyledTableHeader } from "./styledComponents";

export const Th: React.SFC<TableCellProps> = props => (
  <StyledTableHeader {...props}>{props.children}</StyledTableHeader>
);
