import * as React from "react";
import { RosterMember } from "@joincivil/core";
import { colors, BorderlessButton, buttonSizes } from "@joincivil/components";
import { FormSubhead, AvatarImg, AvatarWrap, noAvatar } from "../styledComponents";
import styled from "styled-components";

export interface RosterMemberListItemProps {
  member: RosterMember;
  edit?(): void;
}

const DisplayName = styled(FormSubhead)`
  display: inline-block;
  font-weight: bold;
  margin: 0 10px 0 0;
`;

const Role = styled.span`
  color: #72777c;
  margin-right: 10px;
`;

const StyledLi = styled.li`
  display: grid;
  grid-template-columns: 60px 20% 30% auto 50px;
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  justify-items: center;
  align-items: center;
  padding: 37px 10px 37px 3px;
  &:last-child {
    border-bottom: none;
  }
`;

export class RosterMemberListItem extends React.Component<RosterMemberListItemProps> {
  public render(): JSX.Element {
    return (
      <StyledLi>
        <AvatarWrap>
          {this.props.member.avatarUrl ? <AvatarImg src={this.props.member.avatarUrl} /> : noAvatar}
        </AvatarWrap>
        <DisplayName>{this.props.member.name}</DisplayName>
        <Role>{this.props.member.role}</Role>
        {this.props.member.ethAddress && <code>{this.props.member.ethAddress}</code>}
        {!!this.props.edit && (
          <BorderlessButton onClick={this.props.edit} size={buttonSizes.SMALL}>
            Edit
          </BorderlessButton>
        )}
      </StyledLi>
    );
  }
}
