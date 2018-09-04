import * as React from "react";
import { TableProps } from "./types";
import { StyledTable } from "./styledComponents";

export const Table: React.SFC<TableProps> = props => <StyledTable {...props}>{props.children}</StyledTable>;
