import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "@joincivil/elements";

export const ContributorsStyled = styled.div`
  margin-bottom: 15px;
`;

export const ContributorsTitle = styled.label`
  display: block;
  font-family: ${fonts.SANS_SERIF};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.82px;
  line-height: 12px;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

export const ContributorItem = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 10px;
`;

export const ContributorAvatar = styled.img`
  border-radius: 50%;
  height: 25px;
  margin-right: 10px;
  width: 25px;
`;

export const ContributorUserName = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 2px;
`;

export const ContributorAmount = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 11px;
  font-weight: 600;
  line-height: 13px;
`;

export const ContributorCountStyled = styled.div`
  align-items: center;
  color: ${colors.accent.CIVIL_GRAY_1};
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  font-size: 11px;
  font-weight: 600;
  line-height: 13px;
`;

export const ContributorCountAvatars = styled.div`
  display: flex;
  margin-right: 5px;
`;

export const ContributorCountAvatar = styled.span`
  & > div {
    margin: 0;
  }

  &:nth-of-type(2),
  &:nth-of-type(3) {
    margin-left: -4px;
  }

  img {
    border: 1px solid ${colors.basic.WHITE};
    border-radius: 50%;
    height: 17px;
    width: 17px;
  }
`;

export const ContributorsLabel = styled.span`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;

  svg {
    opacity: 0.3;
  }
`;

export const ContributorsPrompt = styled.div`
  align-items: center;
  display: flex;
`;

export const ContributorsIconBorder = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 50%;
  height: 26px;
  margin-right: 6px;
  padding: 3px;
  width: 26px;

  svg {
    opacity: 0.3;
  }
`;
