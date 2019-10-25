import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "@joincivil/elements";

export interface ContributorsDefaultAvatarProps {
  contributor: any;
  index: number;
  size: number;
}

export interface ContributorsDefaultAvatarStyledProps {
  backgroundColor: string;
  size: number;
}

export const ContributorsDefaultAvatarStyled = styled.div`
  align-items: center;
  background-color: ${(props: ContributorsDefaultAvatarStyledProps) => props.backgroundColor};
  border: 1px solid ${colors.basic.WHITE};
  border-radius: 50%;
  color: ${colors.basic.WHITE};
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  font-size: 10px;
  height: ${(props: ContributorsDefaultAvatarStyledProps) => props.size + "px"};
  justify-content: center;
  margin-right: 10px;
  text-transform: uppercase;
  width: ${(props: ContributorsDefaultAvatarStyledProps) => props.size + "px"};
`;

export const ContributorsDefaultAvatar: React.FunctionComponent<ContributorsDefaultAvatarProps> = props => {
  const avatarColors = ["#EF6B4A", "#9452B5", "#A5CE52"];
  let initial = "?";

  if (props.contributor && props.contributor.payerChannel && props.contributor.payerChannel.handle) {
    initial = props.contributor.payerChannel.handle.charAt(0);
  }
  return (
    <ContributorsDefaultAvatarStyled backgroundColor={avatarColors[props.index]} size={props.size}>
      {initial}
    </ContributorsDefaultAvatarStyled>
  );
};
