import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts, mediaQueries } from "../styleConstants";

export const ListingDetailOuter = styled.div`
  background: ${colors.primary.BLACK};
  display: flex;
  justify-content: center;
`;

export const StyledListingDetailHeader = styled.div`
  color: ${colors.basic.WHITE};
  font-family: ${fonts.SANS_SERIF};
  padding: 24px 0 62px;
`;

export const StyledNewsroomIcon = styled.figure`
  margin: 0 30px 0 0;
  min-width: 130px;
  padding-top: 47px;
`;

export const StyledNewsroomLogo = styled.img`
  height: 130px;
  min-width: 130px;
  min-height: 130px;
  object-fit: cover;
  width: 130px;
`;

export const StyledEthereumInfoToggle = styled.div`
  color: ${colors.basic.WHITE};
  font-size: 12px;
  line-height: 15px;
  text-transform: uppercase;
`;

export const ListingDetailNewsroomName = styled.h1`
  font: 200 48px/40px ${fonts.SERIF};
  letter-spacing: -0.19px;
  margin: 0 0 18px;

  ${mediaQueries.MOBILE} {
    font-size: 32px;
    letter-spacing: -0.12px;
    line-height: 36px;
  }
`;

export const ListingDetailNewsroomDek = styled.p`
  font: normal 21px/35px ${fonts.SANS_SERIF};
  margin: 0 0 35px;

  ${mediaQueries.MOBILE} {
    font-size: 16px;
    letter-spacing: -0.11px;
    line-height: 26px;
    margin: 0 0 32px;
  }
`;

export const StyledRegistryLinkContainer = styled.div`
  padding: 0 0 43px;

  & a {
    color: ${colors.basic.WHITE}B3;
  }
`;

export const NewsroomLinks = styled.div`
  display: flex;
  margin-top: 40px;
`;

export const VisitNewsroomButtonWrap = styled.div`
  line-height: 32px;
  width: 50%;

  ${mediaQueries.MOBILE} {
    width: 100%;
  }
`;

export const FollowNewsroom = styled.div`
  display: inline-block;
  width: 50%;

  ${mediaQueries.MOBILE} {
    width: 100%;
  }
`;

export const FollowNewsroomHeading = styled.h5`
  margin-bottom: 10px;
  font: 500 14px/14px ${fonts.SANS_SERIF};
  letter-spacing: 1px;
  color: ${colors.basic.WHITE};
  text-transform: uppercase;
`;

export const FollowNewsroomLink = styled.a`
  margin-right: 20px;
`;
