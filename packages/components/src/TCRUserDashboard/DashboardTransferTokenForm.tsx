import * as React from "react";
import {
  StyledTransferTokenForm,
  StyledTransferTokenFormElement,
  StyledTransferTokenDropdown,
  StyledDropdownArrow,
} from "./DashboardStyledComponents";
import {
  BalanceLabelText,
  TokenBalanceLabelText,
  TransferTokenText,
  TransferTokenTipsText,
  MetaMaskPopUpText,
} from "./DashboardTextComponents";
import { Dropdown, DropdownGroup, DropdownItem, TextInput } from "../input";
import { DropdownArrow } from "../icons";

export interface TransferTokenDropdownProps {
  label: string | JSX.Element;
}

export const TransferTokenDropdown: React.StatelessComponent<TransferTokenDropdownProps> = props => {
  return (
    <StyledTransferTokenDropdown>
      {props.label}
      <StyledDropdownArrow>
        <DropdownArrow />
      </StyledDropdownArrow>
    </StyledTransferTokenDropdown>
  );
};

export interface DashboardTransferTokenFormProps {
  onChange(): void;
}

export interface DashboardTransferTokenFormStates {
  onChange?: boolean;
}

export class DashboardTransferTokenForm extends React.Component<
  DashboardTransferTokenFormProps,
  DashboardTransferTokenFormStates
> {
  constructor(props: DashboardTransferTokenFormProps) {
    super(props);
    this.state = {
      onChange: true,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <TransferTokenText />
        <StyledTransferTokenForm>
          <StyledTransferTokenFormElement>
            <label>From</label>
            <Dropdown position="left" target={<TransferTokenDropdown label={<BalanceLabelText />} />}>
              <DropdownGroup>
                <DropdownItem>
                  <BalanceLabelText />
                </DropdownItem>
                <DropdownItem>
                  <TokenBalanceLabelText />
                </DropdownItem>
              </DropdownGroup>
            </Dropdown>
          </StyledTransferTokenFormElement>
          <StyledTransferTokenFormElement>
            <label>To</label>
            <Dropdown position="left" target={<TransferTokenDropdown label={<TokenBalanceLabelText />} />}>
              <DropdownGroup>
                <DropdownItem>
                  <BalanceLabelText />
                </DropdownItem>
                <DropdownItem>
                  <TokenBalanceLabelText />
                </DropdownItem>
              </DropdownGroup>
            </Dropdown>
          </StyledTransferTokenFormElement>
          <StyledTransferTokenFormElement>
            <TextInput label="Enter amount" placeholder="0" name="TextInput" onChange={this.props.onChange} />
            <TransferTokenTipsText />
          </StyledTransferTokenFormElement>
          {this.props.children}
          <MetaMaskPopUpText />
        </StyledTransferTokenForm>
      </>
    );
  }
}
