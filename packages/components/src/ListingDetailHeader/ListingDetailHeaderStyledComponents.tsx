import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts, mediaQueries } from "../styleConstants";
import { DarkButton } from "../Button";

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

  & ${DarkButton} {
    border: 1px solid ${colors.accent.CIVIL_GRAY_1};
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 0.2px;
    line-height: 14px;
    padding: 15px 21px;

    svg {
      margin: 0 0 -2px 3px;
    }
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

export const StyledEthereumInfoToggle = styled.div`
  color: ${colors.basic.WHITE};
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  line-height: 15px;
  text-transform: uppercase;
`;

export interface ExpandArrowProps {
  isOpen?: boolean;
}

export const StyledEthereumInfo: StyledComponentClass<ExpandArrowProps, "dl"> = styled<ExpandArrowProps, "dl">("dl")`
  height: ${props => (!props.isOpen ? "0px" : "auto")};
  margin: 0 0 20px;
  max-width: 680px;
  overflow: hidden;
  transition: height 0.25s;
`;

export const ExpandArrow: StyledComponentClass<ExpandArrowProps, "div"> = styled<ExpandArrowProps, "div">("div")`
  display: inline-block;
  border-bottom: 2px solid ${colors.basic.WHITE};
  border-left: 2px solid ${colors.basic.WHITE};
  height: 8px;
  margin-left: 6px;
  transform: ${props => (props.isOpen ? "rotate(135deg)" : "rotate(-45deg)")};
  transition: transform 0.25s;
  width: 8px;
`;

export const StyledEthereumTerm = styled.dt`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  display: inline-block;
  font-size: 14px;
  line-height: 17px;
  padding: 10px 0;
  width: 23%;

  ${mediaQueries.MOBILE} {
    padding: 10px 0 78px;
    vertical-align: top;
    width: 44%;
  }
`;

export const StyledEthereumValue = styled.dd`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  display: inline-block;
  font-family: ${fonts.MONOSPACE};
  font-size: 15px;
  letter-spacing: -0.11px;
  line-height: 22px;
  margin: 0;
  padding: 0 0 10px;
  width: 77%;

  ${mediaQueries.MOBILE} {
    padding: 10px 0;
    width: 46%;
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
