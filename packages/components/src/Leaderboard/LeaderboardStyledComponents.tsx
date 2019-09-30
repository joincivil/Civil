import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "../styleConstants";

export const LeaderboardLabel = styled.label`
  font-family: ${fonts.SANS_SERIF};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.82px;
  line-height: 12px;
  text-transform: uppercase;
`;

export const LeaderboardItem = styled.div`
  padding: 5px 5px 5px 35px;
  position: relative;
`;

export const LeaderboardAvatar = styled.img`
  border-radius: 50%;
  height: 25px;
  left: 0;
  position: absolute;
  top: 5px;
  width: 25px;
`;

export const LeaderboardUserName = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  line-height: 14px;
`;

export const LeaderboardAmount = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 11px;
  font-weight: 600;
  line-height: 13px;
`;

export const ContributerCountAvatar = styled.img`
  border: 1px solid ${colors.basic.WHITE};
  border-radius: 50%;
  height: 25px;
  left: -3px;
  position: relative;
  width: 25px;
`;

export const ContributerCountTotal = styled.span`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  line-height: 14px;
`;
