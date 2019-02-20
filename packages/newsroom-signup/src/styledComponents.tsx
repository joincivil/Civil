import {
  colors,
  fonts,
  Button,
  ButtonProps,
  TextInput,
  TextareaInput,
  InputProps,
  QuestionToolTip as _QuestionToolTip,
  ToolTipProps,
  Collapsable,
  CollapsableProps,
} from "@joincivil/components";
// tslint:disable-next-line:no-unused-variable
import * as React from "react"; // needed to export styled components
import styled, { StyledComponentClass } from "styled-components";

export const SectionTitle = styled.h2`
  font-family: ${fonts.SANS_SERIF};
  font-size: 28px;
  font-weight: bold;
  letter-spacing: -0.58px;
  line-height: 30px;
  margin: 24px 0;
  text-align: center;
  color: ${colors.primary.BLACK};
`;

export const SectionHeader = styled.h2`
  font-family: ${fonts.SANS_SERIF};
  font-size: 24px;
  font-weight: bold;
  letter-spacing: -0.17px;
  line-height: 30px;
  text-align: center;
`;

export const SectionDescription = styled.p`
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${colors.primary.CIVIL_GRAY_1};
`;

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
  magin-bottom: 10px;
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
export const FormRowItem = styled.div`
  flex: 1;
  padding-right: 15px;
  &:last-child {
    padding-right: 0;
  }
`;

export const HelperText = styled.div`
  margin-top: -6px;
  padding-left: 15px;
  font-size: 13px;
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

export const SmallParagraph = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 24px;
`;
export const SmallestParagraph = styled(SmallParagraph)`
  font-size: 12px;
  line-height: 22px;
`;

export const StyledCollapsable: StyledComponentClass<CollapsableProps, any> = styled(Collapsable)`
  text-align: left;
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin: 25px 0;
  padding: 17px 7px 17px 0;

  & + & {
    border-top: none;
    margin-top: -25px;
  }
`;
export const CollapsableHeader = styled.h4`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: bold;
  line-height: 32px;
  margin: 0;
`;

export const BorderedSection = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 7px;
  padding: 32px;
`;
export const BorderedSectionActive = styled(BorderedSection)`
  border-color: ${colors.accent.CIVIL_BLUE_VERY_FADED};
`;

export const NoteContainer = styled(BorderedSection)`
  display: flex;
  justify-content: space-between;
  padding-bottom: 30px;
  margin-bottom: 36px;
  text-align: left;
`;
export const NoteHeading = styled.span`
  font-weight: 600;
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  line-height: 16px;
`;
export const NoteText = styled.span`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  line-height: 16px;
`;

export const AvatarWrap = styled.div`
  width: 50px;
  height: 50px;
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
