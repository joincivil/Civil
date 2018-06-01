import * as React from "react";
import styled from "styled-components";
import { TransactionButton, Transaction } from "./TransactionButton";
import { Civil } from "@joincivil/core";
import { buttonSizes } from "./Button";
import { fonts, colors } from "./styleConstants";
import { debounce } from "lodash";

export interface DetailTransactionButtonProps {
  civil?: Civil;
  transactions: Transaction[];
  estimateFunctions?: Array<() => Promise<number>>;
  requiredNetwork: string;
  progressModal?: JSX.Element;
}

export interface DetailTransactionButtonState {
  price: number;
  priceFailed: boolean;
  isProgressModalVisible: boolean;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DetailSection = styled.div`
  width: 50%;
`;

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

export class DetailTransactionButton extends React.Component<
  DetailTransactionButtonProps,
  DetailTransactionButtonState
> {
  constructor(props: DetailTransactionButtonProps) {
    super(props);
    this.state = {
      price: 0,
      priceFailed: false,
      isProgressModalVisible: false,
    };
    this.devinePrice = debounce(this.devinePrice.bind(this), 1000);
  }

  public componentWillReceiveProps(nextProps: DetailTransactionButtonProps): void {
    this.devinePrice(nextProps.estimateFunctions);
  }

  public async devinePrice(estimateFunctions?: Array<() => Promise<number>>): Promise<void> {
    if (!this.isDisabled() && estimateFunctions && estimateFunctions.length) {
      try {
        const gas = (await Promise.all(estimateFunctions.map(item => item()))).reduce(
          (acc: number, item: number) => acc + item,
          0,
        );
        const gasPrice = await this.props.civil!.getGasPrice();
        this.setState({
          price: gasPrice
            .times(gas)
            .div(this.props.civil!.toBigNumber(10).pow(18))
            .toNumber(),
          priceFailed: false,
        });
      } catch (error) {
        this.setState({ priceFailed: true });
      }
    } else {
      this.setState({ priceFailed: true });
    }
  }

  public async componentDidMount(): Promise<void> {
    this.devinePrice(this.props.estimateFunctions);
  }

  public render(): JSX.Element {
    const details = this.renderDetails();
    return (
      <Wrapper>
        {this.renderDetails()}
        <TransactionButton size={buttonSizes.SMALL} disabled={this.isDisabled()} transactions={this.props.transactions}>
          {this.props.children}
        </TransactionButton>
      </Wrapper>
    );
  }

  public isDisabled(): boolean {
    return (
      !this.props.civil || !this.props.civil.userAccount || this.props.requiredNetwork !== this.props.civil.networkName
    );
  }

  public renderNoMetaMask(): JSX.Element {
    return (
      <DetailSection>
        <SmallHeader>Set up your MetaMask wallet</SmallHeader>
        <SmallText>Download the MetaMask browser plugin and follow the instructions to set up your wallet.</SmallText>
        <Link href="https://metamask.io/" target="_blank">
          Get MetaMask >
        </Link>
      </DetailSection>
    );
  }

  public renderMetaMaskLocked(): JSX.Element {
    return (
      <DetailSection>
        <SmallHeader>MetaMask is locked</SmallHeader>
        <SmallText>Please unlock MetaMask to create a newsroom contract</SmallText>
      </DetailSection>
    );
  }

  public renderWrongNetwork(): JSX.Element {
    return (
      <DetailSection>
        <SmallHeader>MetaMask is on the wrong network</SmallHeader>
        <SmallText>
          Please change your network to the {this.props.requiredNetwork.replace(/^\w/, c => c.toUpperCase())} Network
          before proceeding
        </SmallText>
      </DetailSection>
    );
  }

  public renderCostsEstimates(): JSX.Element {
    if (this.state.price === 0 && !this.state.priceFailed) {
      return <SmallText>Estimating cost.</SmallText>;
    } else if (this.state.priceFailed) {
      return <SmallText>Could not estimate cost.</SmallText>;
    } else {
      return <SmallText>Estimate Cost: {this.state.price.toFixed(5)} ETH</SmallText>;
    }
  }

  public renderTransactionDetails(): JSX.Element {
    return (
      <DetailSection>
        <SmallHeader>Wallet Connected</SmallHeader>
        {this.renderCostsEstimates()}
      </DetailSection>
    );
  }

  public renderDetails(): JSX.Element {
    if (!this.props.civil) {
      return this.renderNoMetaMask();
    } else if (!this.props.civil.userAccount) {
      return this.renderMetaMaskLocked();
    } else if (this.props.requiredNetwork !== this.props.civil.networkName) {
      return this.renderWrongNetwork();
    } else {
      return this.renderTransactionDetails();
    }
  }
}
