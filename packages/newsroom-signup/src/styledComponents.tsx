import {
  colors,
  fonts,
  buttonSizes,
  Button,
  BorderlessButton,
  ButtonProps,
  TextInput,
  TextareaInput,
  InputProps,
  QuestionToolTip as _QuestionToolTip,
  ToolTipProps,
  TransactionPopUpWarning as _TransactionPopUpWarning,
} from "@joincivil/components";
// tslint:disable-next-line:no-unused-variable
import * as React from "react"; // needed to export styled components
import styled, { StyledComponentClass } from "styled-components";

export const FormSection = styled.div`
  padding-top: 10px;
  padding-bottom: 40px;
`;

export const FormTitle = styled.h4`
  font-size: 20px;
  color: #000;
  font-family: ${fonts.SANS_SERIF};
  line-height: 32px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export interface FormSubheadProps {
  optional?: any;
}
export const FormSubhead = styled<FormSubheadProps, "h4">("h4")`
  font-size: 14px;
  font-weight: 500;
  color: #23282d;
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 5px;

  ${props =>
    props.optional &&
    `
    &:after {
      content: " (optional)";
      font-style: italic;
    }
  `};
`;

export const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

export const FormRowLeftAlign = styled(FormRow)`
  justify-content: flex-start;
`;

export const FormRowCenter = styled(FormRow)`
  justify-content: center;
`;

export interface FormRowItemProps {
  align?: string;
  width?: string;
}

export const FormRowItem: StyledComponentClass<FormRowItemProps, "div"> = styled<FormRowItemProps, "div">("div")`
  padding-right: 15px;
  text-align: ${(props: FormRowItemProps) => props.align || "left"};
  &:last-child {
    padding-right: 0;
  }

  // Support either specified widths or true flexible child elements
  ${(props: FormRowItemProps) => (props.width ? "" : "flex: 1;")};
  ${(props: FormRowItemProps) => (props.width ? `width: ${props.width};` : "")};
`;

export const HelperText = styled.div`
  margin-top: -6px;
  padding-left: 11px;
  font-size: 12px;
  color: #72777c;
`;

export const TertiaryButton: StyledComponentClass<ButtonProps, any> = styled(Button)`
  border-radius: 3px;
  background-color: #f7f7f7;
  border: solid 1px #cccccc;
  font-size: 13px;
  font-weight: normal;
  color: #555555;
  &:active,
  &:hover {
    border-radius: 3px;
    background-color: #f7f7f7;
    border: solid 1px #cccccc;
    color: #555555;
  }
`;

export const StyledTextInput: StyledComponentClass<InputProps, any> = styled(TextInput)`
  position: relative;
  small {
    position: absolute;
    width: 100%;
    top: 45px;
    right: 15px;
    text-align: right;
  }
`;

export const StyledTextareaInput: StyledComponentClass<InputProps, any> = styled(TextareaInput)`
  position: relative;
  small {
    position: absolute;
    width: 100%;
    top: 75px;
    right: 15px;
    text-align: right;
  }
`;

export const QuestionToolTip: StyledComponentClass<ToolTipProps, any> = styled(_QuestionToolTip)`
  position: relative;
  top: 2px;
`;

export const MemberDisplayName = styled(FormSubhead)`
  display: inline-block;
  font-weight: bold;
  margin: 0 10px 0 0;
`;

export const StepSectionCounter = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 12px;
  font-weight: bold;
  line-height: 20px;
  opacity: 0.87;
  margin-bottom: 10px;
`;

export const StyledHr = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  heigth: 0;
  margin-top: 35px;
  margin-bottom: 25px;
`;

export const AvatarWrap = styled.div`
  width: 50px;
  height: 50px;
  flex-shrink: 0;
`;
export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

export const _NoAvatar = styled.div`
  border-radius: 50%;
  padding: 15px 20px;
  text-align: center;
  font-weight: bold;
  background-color: ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.accent.CIVIL_GRAY_2};
`;

export const noAvatar = <_NoAvatar>?</_NoAvatar>;

export const TransactionPopUpWarning = styled(_TransactionPopUpWarning)`
  margin-top: 12px;
`;

// Apply to Registry
export const TransferTextLarge = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 16px;
  line-height: 24px;
`;

export const CivilLabel = styled.span`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 12px;
  font-weight: bold;
  letter-spacing: -0.07px;
  line-height: 15px;
`;

export const DepositAmountText = styled.span`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 16px;
  font-weight: bold;
  line-height: 15px;
`;

export const NextBackButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding-top: 24px;
`;
export interface NextBackProps {
  backHidden?: boolean;
  nextDisabled?: () => boolean;
  nextHidden?: boolean;
  navigate(go: 1 | -1): void;
}
export const NextBack: React.SFC<NextBackProps> = (props: NextBackProps) => (
  <NextBackButtonContainer style={{ marginTop: 64 }}>
    {!props.backHidden ? (
      <BorderlessButton size={buttonSizes.MEDIUM_WIDE} onClick={() => props.navigate(-1)}>
        Back
      </BorderlessButton>
    ) : (
      <div />
    )}

    {!props.nextHidden ? (
      <Button
        disabled={props.nextDisabled && props.nextDisabled()}
        textTransform="none"
        width={220}
        size={buttonSizes.MEDIUM_WIDE}
        onClick={() => props.navigate(1)}
      >
        Next
      </Button>
    ) : (
      <div />
    )}
  </NextBackButtonContainer>
);
