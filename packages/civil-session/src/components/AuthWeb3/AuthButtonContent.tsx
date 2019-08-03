import * as React from "react";
import styled from "styled-components";
import { colors } from "@joincivil/components";

const StyledAuthServiceIconContainer = styled.div`
  align-items: center;
  display: flex;
  background: ${colors.accent.CIVIL_GRAY_5};
  border-radius: 50%;
  height: 60px;
  justify-content: center;
  margin-right: 15px;
  min-width: 60px;
  width: 60px;
`;

const StyledAuthServiceBody = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
`;

const StyledAuthServiceHeader = styled.h4`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 16px;
  font-weight: 500;
  line-height: 26px;
  margin: 0 0 13px;
`;

const StyledAuthButtonContent = styled.div`
  align-items: center;
  display: flex;
`;

export const StyledCardTransactionButtonContainer = styled.div`
  margin: 0 0 18px;

  &:hover {
    ${StyledAuthServiceHeader} {
      color: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

export interface AuthButtonProps {
  image: JSX.Element;
  header: JSX.Element | string;
  content: JSX.Element | string;
}

const AuthButtonContent: React.FunctionComponent<AuthButtonProps> = props => {
  return (
    <StyledAuthButtonContent>
      <StyledAuthServiceIconContainer>{props.image}</StyledAuthServiceIconContainer>

      <StyledAuthServiceBody>
        <StyledAuthServiceHeader>{props.header}</StyledAuthServiceHeader>
        {props.content}
      </StyledAuthServiceBody>
    </StyledAuthButtonContent>
  );
};

export default React.memo(AuthButtonContent);
