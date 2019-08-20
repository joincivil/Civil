import * as React from "react";
import styled from "styled-components";
import { LoadingIndicator, LoadingIndicatorProps } from "./LoadingIndicator";
import { colors } from "./styleConstants";

const Wrapper = styled.div`
  padding-top: 100px;
  text-align: center;
  width: 100%;
`;
const Message = styled.p`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 18px;
  line-height: 24px;
  margin: 36px 0 0;
`;

export const LoadingMessage: React.FunctionComponent<LoadingIndicatorProps> = props => {
  const defaultCopy = "Loading";
  return (
    <Wrapper className={props.className}>
      <LoadingIndicator width={props.width} height={props.height} />
      <Message>{props.children || defaultCopy}</Message>
    </Wrapper>
  );
};
