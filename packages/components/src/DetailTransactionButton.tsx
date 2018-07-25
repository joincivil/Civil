import { Civil, EthAddress } from "@joincivil/core";
import { debounce } from "lodash";
import * as React from "react";
import { Subscription } from "rxjs/Subscription";
import styled from "styled-components";
import {
  TransactionButton,
  Transaction,
  TransactionButtonNoModal,
  TransactionButtonInnerProps,
} from "./TransactionButton";
import { fonts, colors } from "./styleConstants";
import { QuestionToolTip } from "./QuestionToolTip";

export interface DetailTransactionButtonProps {
  civil?: Civil;
  transactions: Transaction[];
  estimateFunctions?: Array<() => Promise<number>>;
  requiredNetwork: string;
  Button?: React.StatelessComponent<TransactionButtonInnerProps>;
  noModal?: boolean;
  preExecuteTransactions?(): any;
}

export interface DetailTransactionButtonState {
  price: number;
  priceFailed: boolean;
  isProgressModalVisible: boolean;
  currentNetwork: string;
  currentAccount?: EthAddress;
  ethereumUpdates?: Subscription;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: top;
  margin-bottom: 15px;
`;

const DetailSection = styled.div`
  width: 50%;
`;

const SmallHeader = styled.h4`
  font-family: ${fonts.SANS_SERIF};
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 10px;
  margin-top: 0px;
`;

const SmallText = styled.p`
  font-family: ${fonts.SANS_SERIF};
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 13px;
  line-height: 18px;
  display: flex;
  align-items: center;
  margin: 0;
`;

const Link = styled.a`
  font-family: ${fonts.SANS_SERIF};
  font-size: 11px;
  text-decoration: none;
  font-weight: 600;
  color: ${colors.primary.CIVIL_BLUE_1};
`;

const ToolTipLink = styled.a`
  color: ${colors.basic.WHITE};
`;

const PopUpWarning = styled.p`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 12px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  max-width: 200px;
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
      currentNetwork: "",
    };
    this.divinePrice = debounce(this.divinePrice.bind(this), 1000);
  }

  public async componentWillReceiveProps(nextProps: DetailTransactionButtonProps): Promise<void> {
    await this.divinePrice(nextProps.estimateFunctions);
  }

  public async divinePrice(estimateFunctions?: Array<() => Promise<number>>): Promise<void> {
    if (!this.isDisabled() && estimateFunctions && estimateFunctions.length) {
      try {
        const gas = (await Promise.all(estimateFunctions.map(async item => item()))).reduce(
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
    this.createEthereumSubscription(this.props.civil);
    await this.divinePrice(this.props.estimateFunctions);
  }

  public async componentWillUnmount(): Promise<void> {
    this.unbscribeEthereum();
  }

  public createEthereumSubscription(civil?: Civil): void {
    this.unbscribeEthereum();
    let subscription: Subscription | undefined;
    if (civil) {
      subscription = civil.accountStream
        .subscribe(currentAccount => this.setState({ currentAccount }))
        .add(civil.networkNameStream.subscribe(currentNetwork => this.setState({ currentNetwork })));
    }
    this.setState({
      ethereumUpdates: subscription,
    });
  }

  public unbscribeEthereum(): void {
    if (this.state.ethereumUpdates) {
      this.state.ethereumUpdates.unsubscribe();
    }
  }

  public render(): JSX.Element {
    const TransactionButtonComponent = this.props.noModal ? TransactionButtonNoModal : TransactionButton;
    return (
      <Wrapper>
        {this.renderDetails()}
        <ButtonWrapper>
          <TransactionButtonComponent
            preExecuteTransactions={this.props.preExecuteTransactions}
            disabled={this.isDisabled()}
            transactions={this.props.transactions}
            Button={this.props.Button}
          >
            {this.props.children}
          </TransactionButtonComponent>
          <PopUpWarning>This will open a pop-up to confirm your transaction.</PopUpWarning>
        </ButtonWrapper>
      </Wrapper>
    );
  }

  public isDisabled(): boolean {
    return !this.props.civil || !this.state.currentAccount || this.props.requiredNetwork !== this.state.currentNetwork;
  }

  public renderNoMetaMask(): JSX.Element {
    return (
      <DetailSection>
        <SmallHeader>Set up your MetaMask wallet</SmallHeader>
        <SmallText>Download the MetaMask browser plugin and follow the instructions to set up your wallet.</SmallText>
        <Link href="https://metamask.io/" target="_blank">
          Get MetaMask
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
      return <SmallText>ETH: {this.state.price.toFixed(5)}</SmallText>;
    }
  }

  public renderTransactionDetails(): JSX.Element {
    return (
      <DetailSection>
        <SmallHeader>Wallet Connected</SmallHeader>
        <SmallText>
          Estimated Cost{" "}
          <QuestionToolTip
            explainerText={
              <>
                Current Prices based on{" "}
                <ToolTipLink href="https://ethgasstation.info/" target="_blank">
                  {"https://ethgasstation.info/"}
                </ToolTipLink>
              </>
            }
          />
        </SmallText>
        {this.renderCostsEstimates()}
      </DetailSection>
    );
  }

  public renderDetails(): JSX.Element {
    if (!this.props.civil) {
      return this.renderNoMetaMask();
    } else if (!this.state.currentAccount) {
      return this.renderMetaMaskLocked();
    } else if (this.props.requiredNetwork !== this.state.currentNetwork) {
      return this.renderWrongNetwork();
    } else {
      return this.renderTransactionDetails();
    }
  }
}
