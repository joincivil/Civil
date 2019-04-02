import * as React from "react";
import {
  StyledTransferTokenForm,
  StyledTransferTokenFormGroup,
  StyledTransferTokenFormElement,
  StyledTransferTokenDropdown,
  StyledDropdownArrow,
  StyledTransferTokenBalance,
  StyledFromBalance,
} from "./DashboardStyledComponents";
import {
  BalanceLabelText,
  VotingBalanceLabelText,
  TransferTokenText,
  MetaMaskPopUpText,
} from "./DashboardTextComponents";
import { Dropdown, DropdownGroup, DropdownItem } from "../input";
import { DropdownArrow } from "../icons";

export enum BalanceType {
  AVAILABLE_BALANCE = 0,
  TOKEN_VOTING_BALANCE = 1,
}

export interface TransferTokenDropdownOptionProps {
  label: string | JSX.Element;
  cvl: string;
}

export const TransferTokenBalance: React.FunctionComponent<TransferTokenDropdownOptionProps> = props => {
  return (
    <StyledTransferTokenBalance>
      <span>{props.label}</span>
      <span>{props.cvl}</span>
    </StyledTransferTokenBalance>
  );
};

export interface TransferTokenDropdownSelectedProps {
  label: string | JSX.Element;
}

export const TransferTokenDropdownSelected: React.FunctionComponent<TransferTokenDropdownSelectedProps> = props => {
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
  cvlAvailableBalance: string;
  cvlVotingBalance: string;
  renderTransferBalance(value: number): void;
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
      fromValue: <TransferTokenBalance cvl={this.props.cvlVotingBalance} label={<VotingBalanceLabelText />} />,
    };
  }

  public render(): JSX.Element {
    return (
      <StyledTransferTokenForm>
        <TransferTokenText />
        <StyledTransferTokenFormGroup>
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
                    <TransferTokenBalance cvl={this.props.cvlVotingBalance} label={<VotingBalanceLabelText />} />
                  </button>
                </DropdownItem>
              </DropdownGroup>
            </Dropdown>
          </StyledTransferTokenFormElement>
          <StyledTransferTokenFormElement>
            <label>To</label>
            <StyledFromBalance>{this.state.fromValue}</StyledFromBalance>
          </StyledTransferTokenFormElement>
          {this.props.children}
          <MetaMaskPopUpText />
        </StyledTransferTokenFormGroup>
      </StyledTransferTokenForm>
    );
  }

  private onClick = (value: number) => {
    if (value === BalanceType.AVAILABLE_BALANCE) {
      this.setState({
        dropdownValue: <TransferTokenBalance cvl={this.props.cvlAvailableBalance} label={<BalanceLabelText />} />,
        fromValue: <TransferTokenBalance cvl={this.props.cvlVotingBalance} label={<VotingBalanceLabelText />} />,
      });
    } else {
      this.setState({
        dropdownValue: <TransferTokenBalance cvl={this.props.cvlVotingBalance} label={<VotingBalanceLabelText />} />,
        fromValue: <TransferTokenBalance cvl={this.props.cvlAvailableBalance} label={<BalanceLabelText />} />,
      });
    }
    this.props.renderTransferBalance(value);
  };
}
