import * as React from "react";
import { AvatarGenericIcon, DropdownArrow, colors } from "@joincivil/elements";
import styled from "styled-components";
import { CivilUserData } from "./types";
import { urlConstants as links } from "@joincivil/utils";

const AvatarLoginWrapper = styled.div`
  position: relative;
`;

const AvatarImg = styled.img`
  border-radius: 50%;
  height: 20px;
  width: 20px;
`;

const AvatarLoginAvatarBtn = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  outline: none;
  padding: 5px;
  width: 45px;
`;

const AvatarLoginDropdown = styled.div`
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 4px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding: 5px 0;
  position: absolute;
  right: 0;
  top: 30px;
  width: 120px;
`;

const AvatarLoginOptionBtn = styled.button`
  background-color: ${colors.basic.WHITE};
  border: none;
  color: ${colors.accent.CIVIL_GRAY_1};
  cursor: pointer;
  font-size: 13px;
  line-height: 16px;
  outline: none;
  padding: 5px 12px;
  text-align: left;
  transition: color 250ms;
  width: 100%;

  &:hover {
    color: ${colors.accent.CIVIL_BLUE};
  }
`;

const AvatarLoginOptionLink = styled.a`
  color: ${colors.accent.CIVIL_GRAY_1};
  cursor: pointer;
  font-size: 13px;
  line-height: 16px;
  padding: 5px 12px;
  transition: color 250ms;
  width: 100%;

  &:hover {
    color: ${colors.accent.CIVIL_BLUE};
  }
`;

export interface PaymentLoginAvatarProps {
  civilUser?: CivilUserData;
  handleLogin(): void;
  handleLogout(): void;
}

export const AvatarLogin: React.FunctionComponent<PaymentLoginAvatarProps> = props => {
  const [isOpen, setOpen] = React.useState(false);
  const { civilUser } = props;
  return (
    <AvatarLoginWrapper>
      {civilUser ? (
        <>
          <AvatarLoginAvatarBtn onClick={() => setOpen(!isOpen)}>
            {civilUser.userChannel.tiny72AvatarDataUrl ? (
              <AvatarImg src={civilUser.userChannel.tiny72AvatarDataUrl} />
            ) : (
              <AvatarGenericIcon />
            )}
            <DropdownArrow />
          </AvatarLoginAvatarBtn>
          {isOpen && (
            <AvatarLoginDropdown>
              <AvatarLoginOptionLink href={links.DASHBOARD} target="_blank">
                Your Profile
              </AvatarLoginOptionLink>
              <AvatarLoginOptionBtn onClick={props.handleLogout}>Logout</AvatarLoginOptionBtn>
            </AvatarLoginDropdown>
          )}
        </>
      ) : (
        <>
          <AvatarLoginAvatarBtn onClick={() => setOpen(!isOpen)}>
            <AvatarGenericIcon />
            <DropdownArrow />
          </AvatarLoginAvatarBtn>
          {isOpen && (
            <AvatarLoginDropdown>
              <AvatarLoginOptionBtn onClick={props.handleLogin}>Log In / Sign Up</AvatarLoginOptionBtn>
            </AvatarLoginDropdown>
          )}
        </>
      )}
    </AvatarLoginWrapper>
  );
};
