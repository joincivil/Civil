import styled from "styled-components";
import { colors, fonts, mediaQueries, Button, InvertedButton, RENDER_CONTEXT } from "@joincivil/components";

export interface BoostStyleProps {
  open?: boolean;
  margin?: string;
  textAlign?: string;
}

export const MobileStyle = styled.span`
  display: none:

  ${mediaQueries.MOBILE} {
    display: inline;
  }
`;

export const BoostWrapper = styled.div`
  border: ${(props: BoostStyleProps) => (props.open ? "none" : "1px solid " + colors.accent.CIVIL_GRAY_4)};
  font-family: ${fonts.SANS_SERIF};
  margin: 0 auto 45px;
  padding: 30px 30px 30px 110px;
  position: relative;

  ${mediaQueries.MOBILE} {
    border-color: transparent;
    border-bottom: ${(props: BoostStyleProps) => (props.open ? "none" : "1px solid " + colors.accent.CIVIL_GRAY_4)};
    border-top: ${(props: BoostStyleProps) => (props.open ? "none" : "1px solid " + colors.accent.CIVIL_GRAY_3)};
    margin: 0 auto 30px;
    padding: 20px 15px;
  }
`;

export const BoostTitle = styled.h2`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 20px;
  font-family: ${fonts.SANS_SERIF};
  line-height: 27px;
  font-weight: bold;
  margin: 0 0 8px;
  transition: color 0.25s ease;

  ${props =>
    props.theme.renderContext === RENDER_CONTEXT.EMBED &&
    "white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"}

  ${mediaQueries.MOBILE} {
    font-size: 16px;
    line-height: 22px;
    margin: 0 0 12px;
  }
`;

export const BoostWrapperLink = styled.a`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  display: block;
  font-family: ${fonts.SANS_SERIF};
  margin: 0 auto 45px;
  padding: 30px 30px 30px 110px;
  position: relative;
  transition: border 0.25s ease;

  &:hover {
    ${BoostTitle} {
      color: ${colors.accent.CIVIL_BLUE};
    }
  }

  ${mediaQueries.MOBILE} {
    border-color: transparent;
    border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
    border-top: 1px solid ${colors.accent.CIVIL_GRAY_3};
    margin: 0 auto 30px;
    padding: 20px 15px;
  }
`;

export const BoostWrapperFullWidthHr = styled.hr`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  border: none;
  height: 1px;
  margin: 28px 0 28px -110px;
  width: calc(100% + 140px);

  ${mediaQueries.MOBILE} {
    margin-left: -20px;
    width: calc(100% + 40px);
  }
`;

export const BoostButton = styled(Button)`
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 19px;
  padding: 10px 40px;
  text-transform: none;

  ${mediaQueries.MOBILE} {
    margin-bottom: 20px;
    width: 100%;
  }
`;

export const BoostTextButton = styled(InvertedButton)`
  border: none;
  cursor: pointer;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 19px;
  padding: 0;
  text-transform: none;

  &:hover {
    background-color: transparent;
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: underline;
  }
`;

export const BoostLinkBtn = styled.a`
  background-color: ${colors.accent.CIVIL_BLUE};
  border-radius: 2px;
  color: ${colors.basic.WHITE};
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
  min-width: 220px;
  padding: 10px;
  text-align: center;
  text-decoration: none;

  &:hover {
    color: ${colors.basic.WHITE};
  }
`;

export const BoostBack = styled.div`
  margin: 0 0 30px;
`;

export const BoostImgDiv = styled.div`
  left: 30px;
  position: absolute;
  top: 30px;

  img {
    height: 64px;
    object-fit: contain;
    width: 64px;
  }

  ${mediaQueries.MOBILE} {
    display: none;
  }
`;

export const BoostImgDivMobile = styled.div`
  display: none;

  img {
    height: ${(props: BoostStyleProps) => (props.open ? "64px" : "32px")};
    margin-right: 10px;
    object-fit: contain;
    width: ${(props: BoostStyleProps) => (props.open ? "64px" : "32px")};
  }

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;

export const BoostNewsroomInfo = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 30px;

  ${mediaQueries.MOBILE} {
    display: block;
  }

  a {
    color: ${colors.accent.CIVIL_BLUE};
    font-size: 14px;
    line-height: 20px;
    margin-right: 20px;
    text-decoration: none;

    &:hover {
      color: ${colors.accent.CIVIL_BLUE};
      text-decoration: underline;
    }

    ${mediaQueries.MOBILE} {
      display: block;
      margin-bottom: 5px;
    }
  }
`;

export const BoostNewsroomName = styled.a`
  // override <a> specificity
  && {
    color: ${colors.accent.CIVIL_GRAY_0} !important;
    font-family: ${fonts.SANS_SERIF};
    font-size: 18px;
    line-height: 26px;
    font-weight: 200;
    margin-right: 20px;
  }

  ${mediaQueries.MOBILE} {
    font-size: 14px;
  }
`;

export const BoostDescShareFlex = styled.div`
  display: flex;
  ${mediaQueries.MOBILE_SMALL} {
    flex-direction: column-reverse;
  }
`;

export const BoostShareHeading = styled.h3`
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
  margin: 5px 0 10px;
  white-space: nowrap;

  ${mediaQueries.MOBILE} {
    color: ${colors.primary.BLACK};
    font-size: 16px;
    line-height: 28px;
    margin-top: 1px;
  }
`;

export const BoostCardShare = styled.div`
  width: 245px;

  ${mediaQueries.MOBILE} {
    display: none;
  }
`;

export const BoostPaymentShare = styled.span`
  display: block;
  margin: 10px auto 8px;
  width: 100px;
`;

export const BoostDescription = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  margin-bottom: 30px;

  h3 {
    font-size: 14px;
    font-weight: bold;
    line-height: 19px;
    margin: 0 0 10px;

    ${mediaQueries.MOBILE} {
      color: ${colors.primary.BLACK};
      font-size: 16px;
      line-height: 28px;
    }
  }

  p {
    font-size: 14px;
    line-height: 20px;
    margin: 0 0 15px;

    ${mediaQueries.MOBILE} {
      font-size: 16px;
      line-height: 28px;
    }

    a {
      color: ${colors.accent.CIVIL_BLUE};

      &:hover {
        color: ${colors.accent.CIVIL_BLUE};
        text-decoration: underline;
      }
    }
  }
`;

export const BoostDescriptionWhy = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  margin-bottom: 30px;
  width: 500px;

  p {
    font-size: 18px;
    line-height: 32px;
    margin: 0 0 15px;
  }
`;

export const BoostDescriptionTable = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin-bottom: 30px;
  padding: 20px;

  ${mediaQueries.MOBILE} {
    border: none;
    padding: 0;
  }

  h3 {
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 10px;

    ${mediaQueries.MOBILE} {
      font-size: 16px;
      line-height: 28px;
    }
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;

    th {
      font-size: 12px;
      letter-spacing: 1px;
      padding: 8px 15px 8px 0;
      text-align: left;
      text-transform: uppercase;

      ${mediaQueries.MOBILE} {
        color: ${colors.accent.CIVIL_GRAY_2};
        padding: 8px;
      }
    }

    td {
      padding: 8px 15px 8px 0;

      ${mediaQueries.MOBILE} {
        color: ${colors.accent.CIVIL_GRAY_2};
        padding: 8px;
      }
    }

    ${mediaQueries.MOBILE} {
      tbody {
        tr:nth-child(odd) {
          background-color: ${colors.accent.CIVIL_GRAY_4};
        }
      }
    }
  }
`;

export const BoostProgressCol = styled.div`
  width: ${(props: BoostStyleProps) => (props.open ? "calc(100% - 200px)" : "100%")};

  ${mediaQueries.MOBILE} {
    width: 100%;
  }
`;

export const BoostPayCardDetails = styled.div`
  margin-top: 5px;
  padding-left: 35px;

  ${mediaQueries.MOBILE} {
    margin-top: 15px;
    padding-left: 0;
  }

  p {
    margin-top: 0;
  }

  a {
    color: ${colors.accent.CIVIL_BLUE}
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const BoostPayWallet = styled.p`
  display: block;
  font-size: 14px;
  line-height: 19px;

  ${mediaQueries.MOBILE} {
    display: none;
  }
`;

export const BoostPayWalletMobile = styled.p`
  display: none;

  ${mediaQueries.MOBILE} {
    display: block;
    font-size: 14px;
    line-height: 21px;
  }
`;

export const LearnMore = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 5px;
  font-size: 14px;
  line-height: 19px;
  padding: 15px;

  ${mediaQueries.MOBILE} {
    background-color: ${colors.accent.CIVIL_YELLOW_VERY_FADED};
    font-size: 12px;
    letter-spacing: -0.07px;
    line-height: 18px;
  }

  a {
    cursor: pointer;
    margin-right: 30px;

    ${mediaQueries.MOBILE} {
      margin-right: 15px;
    }

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

export const BoostFormTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
`;

export const BoostPayFormTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
`;

export const BoostFlexStart = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;

export const BoostFlexStartMobile = styled.div`
  ${mediaQueries.MOBILE} {
    align-items: flex-start;
    display: flex;
  }
`;

export const BoostFlexCenter = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${mediaQueries.MOBILE} {
    display: block;

    button {
      margin: 0;
    }
  }
`;

export const BoostFlexEnd = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;

export const BoostFlexEth = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;

  button {
    margin: 9px 0 0 15px;
  }

  label {
    display: none;
  }

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;

export const BoostModalContain = styled.div`
  font-family: ${fonts.SANS_SERIF};
  overflow: scroll;
  padding: 10px 30px 20px 30px;
  position: relative;
  text-align: ${(props: BoostStyleProps) => (props.textAlign ? props.textAlign : "left")};
  width: 500px;

  ${mediaQueries.MOBILE} {
    width: 100%;
  }
`;

export const BoostModalHeader = styled.div`
  color: ${colors.primary.BLACK};
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 15px;
  text-align: center;

  svg {
    display: block;
    margin: 15px auto 20px;
  }
`;

export const BoostModalContent = styled.p`
  color: ${colors.primary.BLACK};
  font-size: 14px;
  line-height: 24px;
  text-align: ${(props: BoostStyleProps) => (props.textAlign ? props.textAlign : "left")};
`;

export const BoostModalCloseBtn = styled(InvertedButton)`
  border: none;
  padding: 0;
  height: 40px;
  position: absolute;
  right: 5px;
  top: 5px;
  width: 40px;

  svg path {
    transition: fill 0.2s ease;
  }

  &:focus,
  &:hover {
    background-color: transparent;

    svg path {
      fill: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

export const BoostSmallPrint = styled.div`
  font-size: 12px;
  margin: ${(props: BoostStyleProps) => props.margin || "0"};
`;

export const BoostAmount = styled.div`
  span {
    margin-right: 10px;
  }
`;

export const BoostEthConfirm = styled.span`
  display: block;
  font-size: 13px;
  margin-top: 15px;

  svg {
    margin-right: 3px;
    vertical-align: sub;
  }
`;

export const BoostNotice = styled.div`
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 25px;

  ${mediaQueries.MOBILE} {
    font-size: 12px;
    line-height: 18px;
  }
`;

export const BoostCompeletedWrapper = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 20px;
  padding: 20px 25px 12px;
  margin: 30px 50px;

  ${mediaQueries.MOBILE} {
    padding: 10px 15px 2px;
    margin: 15px 10px;
  }

  h3,
  p {
    font-size: 14px;
    line-height: 20px;
    margin: 0 0 10px;

    ${mediaQueries.MOBILE} {
      margin: 0 0 15px;
    }
  }

  a {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: none;

    &:hover {
      color: ${colors.accent.CIVIL_BLUE};
      text-decoration: underline;
    }
  }
`;

export const BoostWarningLabel = styled.div`
  color: ${colors.accent.CIVIL_RED};
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 15px;

  svg {
    vertical-align: sub;
  }
`;

export const BoostWalletOptions = styled.div`
  padding: 15px;
  text-align: center;

  a {
    display: block;
    margin-bottom: 15px;
  }
`;

export const BoostCopyAddress = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_2};
  font-size: 13px;
  line-height: 24px;
  padding: 15px;
  text-align: center;

  span {
    diplay: block;
    margin-bottom: 15px;
  }
`;

export const BoostNotificationContain = styled.div`
  padding: 20px;
`;

export const BoostNotification = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  padding: 20px;

  svg {
    margin-right: 5px;
    vertical-align: sub;
  }
`;

export const NoBoostsTextStyled = styled.p`
  font-size: 21px;
  font-weight: bold;
  line-height: 33px;
  text-align: center;
`;

export const BoostPayFormWrapper = styled.div`
  display: block;
  font-family: ${fonts.SANS_SERIF};
  margin: 0 0 0 20px;

  button {
    margin-bottom: 20px;

    ${mediaQueries.MOBILE} {
      width: 100%;
    }
  }

  ${mediaQueries.MOBILE} {
    margin: 0;
  }
`;

export const SubmitInstructions = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  margin: 0 30px 0 0;

  ${mediaQueries.MOBILE} {
    border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
    font-size: 14px;
    line-height: 24px;
    margin: 0 0 30px;
    padding: 0 0 30px;
  }
`;

export const SubmitWarning = styled.p`
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-decoration: none;

  a {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: underline;
  }

  ${mediaQueries.MOBILE} {
    font-size: 12px;
    line-height: 22px;
  }
`;

export const BoostPayFormContain = styled.div`
  margin-bottom: 30px;
`;

export const CheckboxLabel = styled.span`
  margin-left: 10px;
`;

export const BoostAmountInputWrap = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 22px;
  padding-left: 20px;

  ${mediaQueries.MOBILE} {
    padding-left: 0;
  }
`;

export const BoostAmountInput = styled.div`
  margin-right: 10px;
  position: relative;
  width: 100px;

  &::before {
    content: "$";
    left: 10px;
    position: absolute;
    top: 10px;
  }

  > div {
    margin: 0;
  }

  input {
    margin: 0;
    padding: 10px 10px 10px 20px;
  }

  label,
  span {
    display: none;
  }

  ${mediaQueries.MOBILE} {
    width: 150px;
  }
`;

export const BoostUserInfoForm = styled.div`
  margin-bottom: 50px;
  max-width: 500px;
  width: 100%;

  label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
  }
`;

export interface CurrencyLabelProps {
  secondary?: boolean;
}
export const CurrencyLabel = styled.span`
  color: ${colors.primary.CIVIL_GRAY_0};
  font-size: 12px;
  font-weight: ${(props: CurrencyLabelProps) => (props.secondary ? 500 : 600)};
`;
