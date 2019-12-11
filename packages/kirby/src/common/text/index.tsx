import styled from "styled-components";
import { colors } from "../colors";

export interface FocusWordProps {
  color: colors;
}
export const FocusWord = styled.span<FocusWordProps>`
  padding: 10px;
  color: ${(props: FocusWordProps) => props.color};
`;

export const CenteredTextBlock = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 28px;
`;

export const Notice = styled.div`
  background-color: ${colors.lightBlue};
  font-size: 13px;
  width: 95%;
  margin: 10px 0;
  padding: 5px 10px;
`;

// Otherwise no href means no pointer.
export const PointerAnchor = styled.a`
  cursor: pointer;
`;
