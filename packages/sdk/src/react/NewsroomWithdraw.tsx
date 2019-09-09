import * as React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { EthAddress, NewsroomInstance, TwoStepEthTransaction } from "@joincivil/core";
import {
  LoadingIndicator,
  CivilContext,
  ICivilContext,
  colors,
  fonts,
  mediaQueries,
  Button,
  TransactionButton,
} from "@joincivil/components";
import { BoostButton } from "./boosts/BoostStyledComponents";
import { urlConstants } from "./urlConstants";

const ethPriceQuery = gql`
  query {
    storefrontEthPrice
  }
`;

const Wrapper = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  display: flex;
  justify-content: space-between;
  margin: 36px 0;
  padding: 32px 0 16px;

  ${mediaQueries.MOBILE} {
    display: block;
    padding: 16px 0 8px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 14px;
    line-height: 20px;
    margin: 0 0 16px;
  }
`;
const Heading = styled.div`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 17px;
  font-weight: bold;
  line-height: 23px;
  margin-bottom: 18px;
`;
const Copy = styled.div`
  max-width: 500px;

  ${mediaQueries.MOBILE} {
    margin-bottom: 24px;
  }
`;
const BalanceAndButton = styled.div`
  text-align: right;

  p {
    font-size: 16px;
  }

  ${Button} {
    margin-top: 8px;
  }

  svg {
    vertical-align: middle;
  }
`;

// Component requires either instance or newsroom address:
export interface NewsroomWithdrawProps {
  newsroom?: NewsroomInstance;
  newsroomAddress?: EthAddress;
  isStripeConnected: boolean;
}

export interface NewsroomWithdrawState {
  newsroom?: NewsroomInstance;
  userAccount?: EthAddress;
  multisigBalance?: number;
}

export class NewsroomWithdraw extends React.Component<NewsroomWithdrawProps, NewsroomWithdrawState> {
  public static contextType: React.Context<ICivilContext> = CivilContext;
  public context!: React.ContextType<typeof CivilContext>;

  public constructor(props: NewsroomWithdrawProps) {
    super(props);
    if (!props.newsroom && !props.newsroomAddress) {
      throw Error("NewsroomWithdraw: Must supply either newsroom instance or newsroom address");
    }
    this.state = {
      newsroom: props.newsroom,
    };
  }

  public async componentDidMount(): Promise<void> {
    const userAccount = await this.context.civil!.accountStream.first().toPromise();
    let newsroom = this.props.newsroom;
    if (!newsroom) {
      newsroom = await this.context.civil!.newsroomAtUntrusted(this.props.newsroomAddress!);
    }

    const multisigAddress = await newsroom.getMultisigAddress();
    if (!multisigAddress) {
      // This can only happen if user created contract manually.
      alert(
        `This newsroom is owned by ${multisigAddress}, which is not a multisig wallet. You'll have to withdraw using another method.`,
      );
      return;
    }

    this.setState({
      // @TODO Would be nice if this auto updated
      multisigBalance: await this.context.civil!.accountBalance(multisigAddress),
      userAccount,
      newsroom,
    });
  }

  public render(): JSX.Element {
    return (
      <Wrapper>
        <Copy>
          <Heading>Withdraw funds</Heading>
          <p>
            Transfer or withdraw funds from your Newsroom Wallet to collect proceeds from Boosts. You’ll be able to
            exchange ETH for fiat currency. Reminder: only Newsroom Officers can access the Newsroom Wallet.
          </p>
          {this.props.isStripeConnected && (
            <p>
              You may have additional funds in your{" "}
              <a href="https://dashboard.stripe.com" target="_blank">
                Stripe account
              </a>
              .
            </p>
          )}
          <p>
            <a target="_blank" href={urlConstants.FAQ_BOOST_WITHDRAWL}>
              Learn&nbsp;More&nbsp;&gt;
            </a>
          </p>
        </Copy>
        <BalanceAndButton>
          <p>
            Newsroom balance:{" "}
            <Query query={ethPriceQuery}>
              {({ loading, error, data }) => {
                if (loading || typeof this.state.multisigBalance === "undefined") {
                  return <LoadingIndicator />;
                }
                return <b>${(data.storefrontEthPrice * this.state.multisigBalance).toFixed(2)}</b>;
              }}
            </Query>
            <br />
            {typeof this.state.multisigBalance !== "undefined" && <>({this.state.multisigBalance.toFixed(4)} ETH)</>}
          </p>
          {this.renderButton()}
        </BalanceAndButton>
      </Wrapper>
    );
  }

  private renderButton = (): JSX.Element => {
    if (!this.state.newsroom) {
      return <LoadingIndicator />;
    }
    return (
      <TransactionButton
        Button={props => (
          <BoostButton disabled={props.disabled} onClick={props.onClick}>
            Withdraw
          </BoostButton>
        )}
        disabled={!this.state.multisigBalance || !this.state.userAccount}
        transactions={[
          {
            transaction: this.withdrawTx,
            postTransaction: this.postTransaction,
          },
        ]}
      >
        Withdraw
      </TransactionButton>
    );
  };

  private withdrawTx = async (): Promise<TwoStepEthTransaction<any> | void> => {
    if (
      !this.state.multisigBalance ||
      !this.state.userAccount ||
      !this.context.civil ||
      !(window as any).ethereum ||
      !this.state.newsroom
    ) {
      // @TODO/loginV2 migrate away from window.ethereum
      // Currently, everywhere we might use this component already checks and prompts user to connect web3, so we don't need any special handling in this case at the moment.
      return;
    }

    const eth = this.context.civil!.toBigNumber(this.state.multisigBalance);
    return this.state.newsroom.transferEthFromMultisig(eth, this.state.userAccount);
  };

  private postTransaction = (): void => {
    // @TODO If this updated automatically that would be better.
    this.setState({ multisigBalance: 0 });
  };
}
