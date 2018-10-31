import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts } from "../styleConstants";
import { InvertedButton, buttonSizes } from "../Button";

import { NumericInput, TextInput, InputProps } from "./Input";

const StyledTextInputButton = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  border-radius: 3px;
  font-size: 21px;
  padding: 26px 20px;
  position: relative;

  & > div {
    margin: 0;
  }

  & > div > input,
  & > div > input:focus {
    border: none;
    margin: 0;
    padding: 0;
  }
`;

const StyledIcon = styled.div`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 18px;
  line-height: 21px;
  position: absolute;
  right: 40px;
  top: 29px;
`;

const StyledButtonContainer = styled.div`
  position: absolute;
  right: 40px;
  top: 22px;
`;

export interface InputWithButtonContainerProps {
  buttonText: string;
  icon?: JSX.Element;
  children(isFocused: boolean, setFocused: () => void, setUnfocused: (ev: any) => void, setInputRef: (el: any) => void): React.ReactNode;
  onButtonClick(ev: any): void;
}

export interface InputWithButtonProps extends InputProps {
  buttonText: string;
  icon?: JSX.Element;
  onButtonClick(ev: any): void;
}

export interface InputWithButtonState {
  isFocused: boolean;
}

class InputWithButtonContainer extends React.Component<InputWithButtonContainerProps, InputWithButtonState> {
  private inputElement: HTMLInputElement | undefined = undefined;
  private buttonElement: HTMLButtonElement | undefined = undefined;

  constructor(props: InputWithButtonContainerProps) {
    super(props);
    this.state = {
      isFocused: false,
    };
  }

  public render(): JSX.Element {
    return (
      <StyledTextInputButton>
        {this.props.children(this.state.isFocused, this.setFocused, this.setUnfocused, this.setInputRef)}
        {this.state.isFocused && (
          <StyledButtonContainer>
            <InvertedButton size={buttonSizes.SMALL} onClick={this.handleButtonClick} inputRef={this.setButtonRef}>
              {this.props.buttonText}
            </InvertedButton>
          </StyledButtonContainer>
        )}
        {!this.state.isFocused && this.props.icon && <StyledIcon>{this.props.icon}</StyledIcon>}
      </StyledTextInputButton>
    );
  }

  private handleButtonClick = (ev: any) => {
    this.props.onButtonClick(ev);
    if (this.inputElement) {
      this.inputElement.blur();
      this._setUnfocused();
    }
  };

  private setFocusState = (isFocused: boolean): void => {
    this.setState(() => ({ isFocused }));
  };

  private setFocused = () => this.setFocusState(true);

  private _setUnfocused = () => this.setFocusState(false);

  private setUnfocused = (ev: any) => {
    console.log(ev);
    if (ev.relatedTarget === this.buttonElement) {
      ev.preventDefault();
    } else {
      this._setUnfocused();
    }
  };

  private setInputRef = (el: HTMLInputElement) => this.inputElement = el;
  private setButtonRef = (el: HTMLButtonElement) => this.buttonElement = el;
}

export const TextInputWithButton: React.StatelessComponent<InputWithButtonProps> = props => {
  const { onButtonClick, icon, buttonText, ...restProps } = props;
  const inputProps = { ...restProps, noLabel: true };
  const containerProps = { onButtonClick, buttonText, icon };

  return (
    <InputWithButtonContainer {...containerProps}>
      {(isFocused: boolean, setFocused: () => void, setUnfocused: (ev: any) => void, setInputRef: (el: any) => void) => {
        return (
          <>
            <TextInput
              {...inputProps}
              onFocus={setFocused}
              onBlur={setUnfocused}
              inputRef={setInputRef}
            />
          </>
        );
      }}
    </InputWithButtonContainer>
  );
};

export const CurrencyInputWithButton: React.StatelessComponent<InputWithButtonProps> = props => {
  const { onButtonClick, icon, buttonText, ...restProps } = props;
  const inputProps = { ...restProps, noLabel: true };
  const containerProps = { onButtonClick, buttonText, icon };

  return (
    <InputWithButtonContainer {...containerProps}>
      {(isFocused: boolean, setFocused: () => void, setUnfocused: (ev: any) => void, setInputRef: (el: any) => void) => {
        return (
          <>
            <NumericInput
              {...inputProps}
              onFocus={setFocused}
              onBlur={setUnfocused}
              inputRef={setInputRef}
            />
          </>
        );
      }}
    </InputWithButtonContainer>
  );
};
