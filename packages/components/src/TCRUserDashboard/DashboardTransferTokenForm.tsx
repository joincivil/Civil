import * as React from "react";
import {
  StyledTransferTokenForm,
  StyledTransferTokenFormElement,
  StyledTransferTokenDropdown,
  StyledDropdownArrow,
  StyledTransferTokenBalance,
  StyledFromBalance,
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

export enum BalanceType {
  AVAILABLE_BALANCE = "available balance",
  TOKEN_VOTING_BALANCE = "token voting balance",
}

export interface TransferTokenDropdownOptionProps {
  label: string | JSX.Element;
  cvl: number;
  value?: number;
}

export const TransferTokenBalance: React.StatelessComponent<TransferTokenDropdownOptionProps> = props => {
  return (
    <StyledTransferTokenBalance>
      <span>{props.label}</span>
      <span>{props.cvl} CVL</span>
    </StyledTransferTokenBalance>
  );
};

export interface TransferTokenDropdownSelectedProps {
  label: string | JSX.Element;
}

export const TransferTokenDropdownSelected: React.StatelessComponent<TransferTokenDropdownSelectedProps> = props => {
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
  dropdownValue: string | JSX.Element;
  fromValue: string | JSX.Element;
}

export class DashboardTransferTokenForm extends React.Component<
  DashboardTransferTokenFormProps,
  DashboardTransferTokenFormStates
> {
  constructor(props: DashboardTransferTokenFormProps) {
    super(props);
    this.state = {
      dropdownValue: <TransferTokenBalance cvl={this.props.cvlAvailableBalance} label={<BalanceLabelText />} />,
      fromValue: <TransferTokenBalance cvl={this.props.cvlVotingBalance} label={<TokenBalanceLabelText />} />,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <TransferTokenText />
        <StyledTransferTokenForm>
          <StyledTransferTokenFormElement>
            <label>From</label>
            <Dropdown position="left" target={<TransferTokenDropdownSelected label={this.state.dropdownValue} />}>
              <DropdownGroup>
                <DropdownItem>
                  <button onClick={() => this.onClick(BalanceType.AVAILABLE_BALANCE)}>
                    <TransferTokenBalance cvl={this.props.cvlAvailableBalance} label={<BalanceLabelText />} />
                  </button>
                </DropdownItem>
                <DropdownItem>
                  <button onClick={() => this.onClick(BalanceType.TOKEN_VOTING_BALANCE)}>
                    <TransferTokenBalance cvl={this.props.cvlVotingBalance} label={<TokenBalanceLabelText />} />
                  </button>
                </DropdownItem>
              </DropdownGroup>
            </Dropdown>
          </StyledTransferTokenFormElement>
          <StyledTransferTokenFormElement>
            <label>To</label>
            <StyledFromBalance>{this.state.fromValue}</StyledFromBalance>
          </StyledTransferTokenFormElement>
          <StyledTransferTokenFormElement>
            <CurrencyInput
              label="Enter amount"
              placeholder="0"
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

  private onClick = (value: string) => {
    if (value === BalanceType.AVAILABLE_BALANCE) {
      this.setState({
        dropdownValue: <TransferTokenBalance cvl={this.props.cvlAvailableBalance} label={<BalanceLabelText />} />,
        fromValue: <TransferTokenBalance cvl={this.props.cvlVotingBalance} label={<TokenBalanceLabelText />} />,
      });
    } else {
      this.setState({
        dropdownValue: <TransferTokenBalance cvl={this.props.cvlVotingBalance} label={<TokenBalanceLabelText />} />,
        fromValue: <TransferTokenBalance cvl={this.props.cvlAvailableBalance} label={<BalanceLabelText />} />,
      });
    }
  };
}
