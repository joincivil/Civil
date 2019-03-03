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
import { Dropdown, DropdownGroup, DropdownItem, CurrencyInput } from "../input";
import { DropdownArrow } from "../icons";

export interface TransferTokenDropdownOptionProps {
  label: string | JSX.Element;
  cvl: number;
}

export const TransferTokenDropdownOption: React.StatelessComponent<TransferTokenDropdownOptionProps> = props => {
  return (
    <>
      <span>{props.label}</span>
      <span>{props.cvl} CVL</span>
    </>
  );
};

export interface TransferTokenDropdownOptionsProps {
  label?: string | JSX.Element;
}

export const TransferTokenDropdownOptions: React.StatelessComponent<TransferTokenDropdownOptionsProps> = props => {
  return (
    <DropdownGroup>
      <DropdownItem>
        <TransferTokenDropdownOption cvl={500.005} label={<BalanceLabelText />} />
      </DropdownItem>
      <DropdownItem>
        <TransferTokenDropdownOption cvl={500.005} label={<TokenBalanceLabelText />} />
      </DropdownItem>
    </DropdownGroup>
  );
};

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
  cvlAvailableBalance: number;
  cvlVotingBalance: number;
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
            <Dropdown
              position="left"
              target={
                <TransferTokenDropdown
                  label={
                    <TransferTokenDropdownOption cvl={this.props.cvlAvailableBalance} label={<BalanceLabelText />} />
                  }
                />
              }
            >
              <TransferTokenDropdownOptions />
            </Dropdown>
          </StyledTransferTokenFormElement>
          <StyledTransferTokenFormElement>
            <label>To</label>
            <Dropdown
              position="left"
              target={
                <TransferTokenDropdown
                  label={
                    <TransferTokenDropdownOption cvl={this.props.cvlVotingBalance} label={<TokenBalanceLabelText />} />
                  }
                />
              }
            >
              <TransferTokenDropdownOptions />
            </Dropdown>
          </StyledTransferTokenFormElement>
          <StyledTransferTokenFormElement>
            <CurrencyInput
              label="Enter amount"
              placeholder="0.0000"
              name="CurrencyInput"
              icon={<>CVL</>}
              onChange={this.props.onChange}
            />
            <TransferTokenTipsText />
          </StyledTransferTokenFormElement>
          {this.props.children}
          <MetaMaskPopUpText />
        </StyledTransferTokenForm>
      </>
    );
  }
}
