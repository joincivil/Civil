import * as React from "react";
import styled from "styled-components";

import { colors, mediaQueries } from "../styleConstants";
import { Td } from "../Table";
import { StyledTableCell } from "../Table/styledComponents";
import { TableCellProps } from "../Table/types";

const StyledParameterizerTableCell = styled(StyledTableCell)`
  ${mediaQueries.MOBILE} {
    display: flex;

    &:before {
      display: block;
      background-color: ${(props: TableCellProps) =>
        props.accent ? colors.accent.CIVIL_GRAY_4 + "7D" : "transparent"};
      content: attr(data-mobile-th);
      text-align: ${(props: TableCellProps) => props.align || "left"};
      width: 50%;
    }
  }
`;

const StyledParameterizerTableCellInner = styled.div`
  ${mediaQueries.MOBILE} {
    width: 50%;
  }
`;

export const ParameterizerTd: React.SFC<TableCellProps> = props => {
  return (
    <Td StyledTableCellComponent={StyledParameterizerTableCell} {...props}>
      <StyledParameterizerTableCellInner {...props}>{props.children}</StyledParameterizerTableCellInner>
    </Td>
  );
};
