import styled, { StyledComponentClass } from "styled-components";

export const CheckboxContainer = styled("ul")`
  border: 1px solid red;
  list-style: none;
`;

export const CheckboxSection = styled("li")`
  border: 1px solid green;
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })``;
