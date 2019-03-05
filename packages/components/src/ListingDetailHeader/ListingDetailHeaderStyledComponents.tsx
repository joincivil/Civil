import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts, mediaQueries } from "../styleConstants";
import { Button, DarkButton, ButtonProps } from "../Button";
import {
  StyledDisplayName,
  StyledEthAddressContainer,
  StyledEthAddress,
} from "../EthAddressViewer/StyledEthAddressViewer";

export const ListingDetailOuter = styled.div`
  background: ${colors.primary.BLACK};
  display: flex;
  justify-content: center;
`;

export const StyledListingDetailHeader = styled.div`
  color: ${colors.basic.WHITE};
  font-family: ${fonts.SANS_SERIF};
  padding: 24px 0 62px;

  ${mediaQueries.MOBILE} {
    padding: 30px 20px 42px;
  }
`;

export const StyledNewsroomIcon = styled.figure`
  margin: 0 30px 0 0;
  min-width: 130px;
  padding-top: 50px;

  ${mediaQueries.MOBILE} {
    margin: 45px auto;
    padding: 0;
  }
`;

export const StyledNewsroomLogo = styled.img`
  height: 130px;
  min-width: 130px;
  min-height: 130px;
  object-fit: contain;
  width: 130px;
  background: ${colors.basic.WHITE};
`;

export const StyledEthereumInfoToggle: StyledComponentClass<ButtonProps, "button"> = styled(DarkButton)`
  background: ${colors.accent.CIVIL_GRAY_0};
  color: ${colors.accent.CIVIL_GRAY_4};
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: normal;
  line-height: 15px;
  padding: 4px 12px;
  margin: 0 0 14px;
`;

export const StyledListingURLButton: StyledComponentClass<ButtonProps, "button"> = styled(DarkButton)`
  border: 1px solid ${colors.accent.CIVIL_GRAY_1};
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.2px;
  line-height: 14px;
  padding: 15px 21px;
  white-space: nowrap;

  svg {
    margin: 0 0 -2px 3px;
  }
`;

export const StyledModalHeader = styled.div`
  color: ${colors.primary.BLACK};
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  font-size: 18px;
  line-height: 24px;
  justify-content: space-between;
`;

export const StyledCloseModal = styled.span`
  cursor: pointer;
  margin-top: -10px;
`;

export const StyledEthereumInfoModalInner = styled.div`
  display: flex;

  & ~ & {
    border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
    padding-top: 26px;
  }

  & > div {
    width: 48%;
  }

  ${mediaQueries.MOBILE} {
    display: block;

    & > div {
      width: 100%;
    }
  }

  ${StyledDisplayName} {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 16px;
    font-weight: bold;
    line-height: 26px;
  }

  ${StyledEthAddressContainer} {
    flex-wrap: wrap;
    width: 100%;
  }

  ${StyledEthAddress} {
    margin: 0 0 17px;
    width: 100%;
  }

  ${Button} {
    margin: 0 12px 0 0;
    padding: 16px 0;
    width: 133px;
  }
`;

export const StyledEthereumAddressDescription = styled.div`
  font-size: 14px;
  font-family: ${fonts.SANS_SERIF};
  line-height: 22px;
  margin-left: 28px;
  padding-top: 28px;

  p {
    margin: 0 0 14px;
  }

  ${mediaQueries.MOBILE} {
    margin-left: 0;
  }
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
  font-weight: 300;
  letter-spacing: -0.11px;
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
  margin-right: 45px;

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
