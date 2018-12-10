import * as React from "react";
import { TableCellProps } from "./types";
import { StyledTableCell } from "./styledComponents";

export const Td: React.SFC<TableCellProps> = props => {
  const StyledTableCellComponent = props.StyledTableCellComponent || StyledTableCell;
  return <StyledTableCellComponent {...props}>{props.children}</StyledTableCellComponent>;
};
