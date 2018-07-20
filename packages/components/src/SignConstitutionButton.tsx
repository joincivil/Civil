import { EthAddress } from "@joincivil/core";
import * as React from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { DetailsButtonComponent } from "./DetailsButtonComponent";
import { colors, fonts } from "./styleConstants";

export interface SignConstitutionButtonProps {
  currentNetwork?: string;
  currentAccount?: EthAddress;
  requiredNetwork: string;
  isNewsroomOwner: boolean | undefined;
  signConstitution(): Promise<void>;
}

const SmallHeader = styled.h4`
  font-family: ${fonts.SANS_SERIF};
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 10px;
`;

const SmallText = styled.p`
  font-family: ${fonts.SANS_SERIF};
  font-size: 11px;
  line-height: 18px;
`;

const Link = styled.a`
  font-family: ${fonts.SANS_SERIF};
  font-size: 11px;
  text-decoration: none;
  font-weight: 600;
  color: ${colors.primary.CIVIL_BLUE_1};
`;

export class SignConstitutionButton extends React.Component<SignConstitutionButtonProps> {
  constructor(props: SignConstitutionButtonProps) {
    super(props);
  }

  public render(): JSX.Element {
    const detailsComponent = this.renderDetails();
    const buttonComponent = this.renderButtonComponent();
    return <DetailsButtonComponent detailsComponent={detailsComponent} buttonComponent={buttonComponent} />;
  }

  public isDisabled(): boolean {
    return (
      !this.props.currentAccount ||
      this.props.requiredNetwork !== this.props.currentNetwork ||
      !this.props.isNewsroomOwner
    );
  }

  public renderNoMetaMask(): JSX.Element {
    return (
      <>
        <SmallHeader>Set up your MetaMask wallet</SmallHeader>
        <SmallText>Download the MetaMask browser plugin and follow the instructions to set up your wallet.</SmallText>
        <Link href="https://metamask.io/" target="_blank">
          Get MetaMask >
        </Link>
      </>
    );
  }

  public renderMetaMaskLocked(): JSX.Element {
    return (
      <>
        <SmallHeader>MetaMask is locked</SmallHeader>
        <SmallText>Please unlock MetaMask to create a newsroom contract</SmallText>
      </>
    );
  }

  public renderWrongNetwork(): JSX.Element {
    return (
      <>
        <SmallHeader>MetaMask is on the wrong network</SmallHeader>
        <SmallText>
          Please change your network to the {this.props.requiredNetwork.replace(/^\w/, c => c.toUpperCase())} Network
          before proceeding
        </SmallText>
      </>
    );
  }

  public renderTransactionDetails(): JSX.Element {
    return (
      <>
        <SmallHeader>Wallet Connected</SmallHeader>
        <SmallText>Signing the Civil Constitution does not incur a gas cost.</SmallText>
      </>
    );
  }

  public renderIsNotOwner(): JSX.Element {
    return (
      <>
        <SmallHeader>Your current wallet address is not an owner of this contract</SmallHeader>
        <SmallText>Please switch to the wallet associated with this newsroom contract on Metamask.</SmallText>
      </>
    );
  }

  public renderDetails(): JSX.Element {
    if (!this.props.currentNetwork) {
      return this.renderNoMetaMask();
    } else if (!this.props.currentAccount) {
      return this.renderMetaMaskLocked();
    } else if (this.props.requiredNetwork !== this.props.currentNetwork) {
      return this.renderWrongNetwork();
    } else if (!this.props.isNewsroomOwner) {
      return this.renderIsNotOwner();
    } else {
      return this.renderTransactionDetails();
    }
  }

  private handleOnClick = async (event: any): Promise<void> => {
    return this.props.signConstitution();
  };

  private renderButtonComponent = (): JSX.Element => {
    return (
      <Button onClick={this.handleOnClick} disabled={this.isDisabled()}>
        Sign Constitution
      </Button>
    );
  };
}
