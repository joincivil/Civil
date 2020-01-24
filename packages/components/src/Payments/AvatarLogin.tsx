import * as React from "react";
import { AvatarGenericIcon, DropdownArrow, colors } from "@joincivil/elements";
import styled from "styled-components";
import { ICivilContext, CivilContext } from "../context";
import { urlConstants as links } from "@joincivil/utils";

const AvatarLoginWrapper = styled.div`
  position: relative;
`;

const AvatarImg = styled.img`
  border-radius: 50%;
  height: 24px;
  width: 24px;
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
  width: 50px;
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

export interface AvatarLoginStates {
  isOpen: boolean;
}

export class AvatarLogin extends React.Component<{}, AvatarLoginStates> {
  public static contextType = CivilContext;
  public static context: ICivilContext;

  constructor(props: any) {
    super(props);
    this.state = { isOpen: false };
  }

  public render(): JSX.Element {
    const currentUser = this.context && this.context.currentUser;
    const showWeb3Login = this.context.auth.showWeb3Login;
    const logout = this.context.auth.logout.bind(this.context.auth);

    return (
      <AvatarLoginWrapper>
        {currentUser ? (
          <>
            <AvatarLoginAvatarBtn onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
              {currentUser.userChannel.tiny72AvatarDataUrl ? (
                <AvatarImg src={currentUser.userChannel.tiny72AvatarDataUrl} />
              ) : (
                <AvatarGenericIcon />
              )}
              <DropdownArrow />
            </AvatarLoginAvatarBtn>
            {this.state.isOpen && (
              <AvatarLoginDropdown>
                <AvatarLoginOptionLink href={links.DASHBOARD} target="_blank">
                  Your Profile
                </AvatarLoginOptionLink>
                <AvatarLoginOptionBtn onClick={logout}>Logout</AvatarLoginOptionBtn>
              </AvatarLoginDropdown>
            )}
          </>
        ) : (
          <>
            <AvatarLoginAvatarBtn onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
              <AvatarGenericIcon />
              <DropdownArrow />
            </AvatarLoginAvatarBtn>
            {this.state.isOpen && (
              <AvatarLoginDropdown>
                <AvatarLoginOptionBtn onClick={showWeb3Login}>Log In / Sign Up</AvatarLoginOptionBtn>
              </AvatarLoginDropdown>
            )}
          </>
        )}
      </AvatarLoginWrapper>
    );
  }
}
