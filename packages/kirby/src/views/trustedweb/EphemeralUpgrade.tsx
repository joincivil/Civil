import * as React from "react";
import styled from "styled-components";
import { BorderlessButton, buttonSizes } from "@joincivil/elements";
import { StrongText, SmallerText } from "./common";

const Container = styled.div`
  margin: 7px;
  padding: 4px;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    > button {
      margin-top: 7px;
    }
  }
`;

export interface EphemeralUpgradeProps {
  goToSignup(): void;
  goToLogin(): void;
}
export const EphemeralUpgrade: React.FC<EphemeralUpgradeProps> = ({ goToSignup, goToLogin }) => {
  return (
    <Container>
      <div>
        <div>
          <small>You are using a guest account and it will be deleted if you clear your cookies.</small>
        </div>
        <div>
          <div>
            <StrongText>Control your transactions, identity, and more on any device. </StrongText>
          </div>
          <div>
            <SmallerText>
              Finish by creating an account to sync this decentralized identity. You can customize your profile settings
              once you create an account.
            </SmallerText>
          </div>
        </div>
        <BorderlessButton onClick={goToSignup} size={buttonSizes.SMALL}>
          Create account
        </BorderlessButton>
        <div></div>
        <div>
          <small>
            Already have an account?
            <BorderlessButton onClick={goToLogin} size={buttonSizes.SMALL}>
              Login
            </BorderlessButton>
          </small>
        </div>
      </div>
    </Container>
  );
};
