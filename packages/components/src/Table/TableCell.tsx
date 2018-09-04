import * as React from "react";
import { TableCellProps } from "./types";
import { StyledTableCell } from "./styledComponents";

export const Td: React.SFC<TableCellProps> = props => <StyledTableCell {...props}>{props.children}</StyledTableCell>;
