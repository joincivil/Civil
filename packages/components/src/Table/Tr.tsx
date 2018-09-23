import * as React from "react";
import { StyledTableRow } from "./styledComponents";

export const Tr: React.SFC = props => <StyledTableRow>{props.children}</StyledTableRow>;
