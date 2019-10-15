import * as React from "react";
import styled from "styled-components";

import { colors } from "../colors/index";
import { SecondaryButton } from "../buttons/Button";
import { InputLabel } from "./Input";
import { Heading, SubHeading } from "../text/headings";

import { OvalImage } from "../icons/logos/index";

export interface RadioButtonProps {
  className?: string;
  inputRef?: any;
  onChange?: any;
  value: any;
  disabled?: boolean;
  name?: string;
  defaultValue?: any;
}

export const RadioButtonDiv = styled.div`
  input {
    display: none;
  }
  input:checked + button {
    background-color: ${colors.accent.CIVIL_BLUE};
    border: 1px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.basic.WHITE};
  }
`;
export const RadioButton: React.FunctionComponent<RadioButtonProps> = props => {
  let input: any;
  const { onChange, children, name } = props;
  const clickHandler = () => {
    input.checked = true;
    if (onChange) {
      onChange(props.name, input.value);
    }
  };
  const defaultChecked = props.defaultValue === props.value;

  return (
    <RadioButtonDiv>
      <input type="radio" value={props.value} defaultChecked={defaultChecked} name={name} ref={ref => (input = ref)} />
      <SecondaryButton onClick={clickHandler} disabled={props.disabled}>
        {children}
      </SecondaryButton>
    </RadioButtonDiv>
  );
};

export interface RadioInputProps {
  name: string;
  label?: string;
  defaultValue?: any;
  onChange?: any;
  inputRef?: any;
  className?: any;
  children?: any;
}

const RadioDiv = styled.div`
  > div {
    display: flex;
    flex-direction: rows;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
`;
export const RadioInput = (props: RadioInputProps) => {
  const { defaultValue, onChange, label, name, inputRef, children } = props;

  const childrenWithProps = React.Children.map(children, (child: React.ReactChild) =>
    React.cloneElement(child as React.ReactElement, { name, onChange, defaultValue }),
  );

  return (
    <RadioDiv ref={inputRef}>
      {label ? <InputLabel>{label}</InputLabel> : null}
      <div>{childrenWithProps}</div>
    </RadioDiv>
  );
};
export const RadioGroup = RadioInput;

export interface RadioCardInputProps {
  heading: string;
  subheading?: string;
  value: any;
  image?: any;
  className?: string;
  inputRef?: any;
  onChange?: any;
  name?: string;
  disabled?: boolean;
  defaultValue?: any;
  prioritized?: boolean;
}

const StyledRadioCardInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 #e6e6e6;
  width: 311px;
  height: 117px;
  margin-top: 15px;
  cursor: pointer;
  > div:nth-child(2) {
    margin: 18px;
  }
  > div:nth-child(3) {
    flex-grow: 1;
  }
  > input {
    display: none;
  }
`;

const EnabledStyledRadioCardInput = styled(StyledRadioCardInput)`
  :hover {
    border: 1px solid #2b56ff;
  }
`;

const PrioritizedStyledRadioCardInput = styled(EnabledStyledRadioCardInput)`
  box-shadow: 0px 0px 2px 2px ${colors.accent.CIVIL_BLUE_FADED};
`;

const DisabledStyledRadioCardInput = styled(StyledRadioCardInput)`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  cursor: not-allowed;
`;

export const RadioCardInput: React.FC<RadioCardInputProps> = props => {
  let input: any;
  const { onChange, name, image, heading, subheading, disabled, prioritized } = props;
  const clickHandler = () => {
    input.checked = true;
    if (onChange) {
      onChange(props.name, input.value);
    }
  };
  const defaultChecked = props.defaultValue === props.value;

  let SelectedStyledRadioCardInput = EnabledStyledRadioCardInput;
  if (disabled) {
    SelectedStyledRadioCardInput = DisabledStyledRadioCardInput;
  } else if (prioritized) {
    SelectedStyledRadioCardInput = PrioritizedStyledRadioCardInput;
  }

  return (
    <SelectedStyledRadioCardInput onClick={disabled ? undefined : clickHandler}>
      <input type="radio" value={props.value} defaultChecked={defaultChecked} name={name} ref={ref => (input = ref)} />
      <OvalImage>{image}</OvalImage>
      <div>
        <Heading>{heading}</Heading>
        <SubHeading>{subheading}</SubHeading>
      </div>
    </SelectedStyledRadioCardInput>
  );
};
