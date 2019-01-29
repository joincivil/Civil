import * as React from "react";
import {RosterMember} from "@joincivil/core";
import {colors, BorderlessButton, buttonSizes} from "@joincivil/components";
import { FormSubhead } from "../styledComponents";
import styled from "styled-components";

export interface RosterMemberListItemProps {
  member: RosterMember;
  edit(): void;
}

const AvatarWrap = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  width: 24px;
  height: 24px;
`;
const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const _NoAvatar = styled.div`
  display: inline-block;
  width: 24px;
  height: 21px;
  padding-top: 3px;
  text-align: center;
  font-weight: bold;
  background-color: ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.accent.CIVIL_GRAY_2};
`;

const DisplayName = styled(FormSubhead)`
  display: inline-block;
  font-weight: bold;
  margin: 0 10px 0 0;
`;

const Role = styled.span`
  color: #72777c;
  margin-right: 10px;
`;

const noAvatar = <_NoAvatar>?</_NoAvatar>;

const StyledLi = styled.li`
  display: flex;
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding: 37px 10px 37px 3px;
`;

const StyledButton = styled(BorderlessButton)`
  justify-self: flex-end;
`;

export class RosterMemberListItem extends React.Component<RosterMemberListItemProps, {}> {
  public render(): JSX.Element {
    return (
      <StyledLi>
        <AvatarWrap>
          {this.props.member.avatarUrl ? (<AvatarImg src={this.props.member.avatarUrl}/>) : noAvatar}
        </AvatarWrap>
        <DisplayName>{this.props.member.name}</DisplayName>
        <Role>{this.props.member.role}</Role>
        {this.props.member.ethAddress && <code>{this.props.member.ethAddress}</code>}
        <StyledButton onClick={this.props.edit} size={buttonSizes.SMALL}>Edit</StyledButton>
      </StyledLi>
    );
  }
}
