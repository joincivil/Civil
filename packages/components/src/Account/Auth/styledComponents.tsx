import styled from "styled-components";
import { colors, fonts } from "../../styleConstants";
import { Checkbox } from "../../input/Checkbox";

export const CheckboxContainer = styled.ul`
  list-style: none;
  padding-left: 0;
`;

export const CheckboxSection = styled.li`
  padding: 5px 0;
`;

// ???? What does 12px/20px do?
export const CheckboxLabel = styled.span`
  color: ${colors.primary.CIVIL_GRAY_1};
  font: 400 12px/20px ${fonts.SANS_SERIF};
  padding-left: 5px;
`;

// ??? Is this the proper way to center a div?
export const ConfirmButtonContainer = styled.div`
  text-align: center;
`;

// ?? Is this the proper way to change another styled component?
export const CheckboxSmall = styled(Checkbox)`
  border: 1px;
`;
