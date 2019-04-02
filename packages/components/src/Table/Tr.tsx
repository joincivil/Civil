import * as React from "react";
import { StyledTableRow } from "./styledComponents";

export const Tr: React.FunctionComponent = props => <StyledTableRow>{props.children}</StyledTableRow>;
