import * as React from "react";
import { UniswapSell } from "./UniswapSell";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { UniswapCvlEthConverter } from "./UniswapCvlEthConverter";

const ethPriceQuery = gql`
  query {
    storefrontEthPrice
  }
`;

export interface UniswapSellSectionProps {
  onComplete(): void;
}
export interface UniswapSellSectionState {
  cvlToSell: number;
  etherToReceive: number;
}
export class UniswapSellSection extends React.Component<UniswapSellSectionProps, UniswapSellSectionState> {
  constructor(props: UniswapSellSectionProps) {
    super(props);
    this.state = { cvlToSell: 0, etherToReceive: 0 };
  }

  public render(): JSX.Element {
    const updatePrice = this.updatePrice.bind(this);
    return (
      <Query query={ethPriceQuery}>
        {({ loading, error, data }) => {
          if (loading) {
            return null;
          }
          return (
            <>
              <UniswapCvlEthConverter onConversion={updatePrice} />
              <UniswapSell
                cvlToSell={this.state.cvlToSell}
                ethExchangeRate={data.storefrontEthPrice}
                onSellComplete={this.props.onComplete}
              />
            </>
          );
        }}
      </Query>
    );
  }

  private async updatePrice(cvlToSell: number, etherToReceive: number): Promise<void> {
    this.setState({ cvlToSell, etherToReceive });
  }
}
