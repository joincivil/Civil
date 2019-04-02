import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Table } from "./Table";
import { Tr } from "./Tr";
import { Th } from "./TableHeader";
import { Td } from "./TableCell";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
`;

const Container: React.FunctionComponent = ({ children }) => <StyledDiv>{children}</StyledDiv>;

storiesOf("Table", module).add("Default", () => {
  return (
    <Container>
      <Table width="100%">
        <Tr>
          <Th>Default Header</Th>
          <Th align="right">Right aligned</Th>
          <Th accent colSpan={2}>
            Accent Col spanned header
          </Th>
        </Tr>
        <Tr>
          <Td>Default cell</Td>
          <Td align="right">Default cell</Td>
          <Td accent>Pasta</Td>
          <Td accent>Pho</Td>
        </Tr>
        <Tr>
          <Td>Pizza is delicious</Td>
          <Td align="right">Ramen is tasty too</Td>
          <Td accent>Pasta</Td>
          <Td accent>Pho</Td>
        </Tr>
      </Table>
    </Container>
  );
});
