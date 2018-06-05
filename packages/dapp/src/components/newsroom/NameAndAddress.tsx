import * as React from "react";
import { StepHeader, StepProps, StepStyled, TextInput, DetailTransactionButton, Collapsable, fonts, AddressWithCopyButton } from "@joincivil/components";
import { TwoStepEthTransaction } from "@joincivil/core";
import { getCivil } from "../../helpers/civilInstance";
import styled, { StyledComponentClass } from "styled-components";
import { connect, DispatchProp } from "react-redux";
import { updateNewsroom } from "../../actionCreators/newsrooms";

export interface NameAndAddressProps extends StepProps {
  address?: string;
  name?: string;
  onNewsroomCreated?(result: any): void;
}

export const Label: StyledComponentClass<any, "div"> = styled.div`
  font-size: 15px;
  color: #000;
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 10px;
`;

class NameAndAddressComponent extends React.Component<NameAndAddressProps & DispatchProp<any>> {

  public onChange(name: string, value: string | void): void {
    this.props.dispatch!(updateNewsroom(this.props.address || "", {wrapper: {data: {name: value || ""}}}));
  }

  public renderNoContract(): JSX.Element {
    const civil = getCivil();
    return <>
      <TextInput label="Newsroom Name" placeholder="Enter your newsroom's name" name="NameInput" value={this.props.name || ""} onChange={(name, val) => this.onChange(name, val)} />
      <DetailTransactionButton
        transactions={[{ transaction: this.createNewsroom, postTransaction: this.props.onNewsroomCreated }]}
        civil={civil}
        estimateFunctions={[civil.estimateNewsroomDeployTrusted.bind(civil, this.props.name)]}
        requiredNetwork="rinkeby"
      >
        Create Newsroom
      </DetailTransactionButton>
    </>;
  }

  public renderContract(): JSX.Element {
    return <>
      <TextInput label="Newsroom Name" placeholder="Enter your newsroom's name" name="NameInput" value={this.props.name || ""} onChange={(name, val) => this.onChange(name, val)} />
      <div>
        <Label>Newsroom Contract Address</Label>
        <AddressWithCopyButton address={this.props.address || ""}/>
      </div>
    </>;
  }

  public render(): JSX.Element {
    const body = this.props.address ? this.renderContract() : this.renderNoContract();
    return (<StepStyled index={this.props.index || 0}>
      <Collapsable
        open={true}
        header={<>
          <StepHeader el={this.props.el} isActive={this.props.active === this.props.index}>
            Set up a newsroom
          </StepHeader>
          <p>Enter your newsroom name to create your newsroom smart contract.</p>
        </>}
      >
        {body}
      </Collapsable>
    </StepStyled>)
  }

  private createNewsroom = async (): Promise<TwoStepEthTransaction<any>> => {
    const civil = getCivil();
    return civil.newsroomDeployTrusted(this.props.name!);
  };
}

export const NameAndAddress = connect()(NameAndAddressComponent);
