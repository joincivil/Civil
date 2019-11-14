import * as React from "react";
import { CurrencyConverterSection } from "../../CurrencyConverter";
import { CivilContext, ICivilContext } from "../../context";
import { TokenPurchaseSummary } from "../TokenPurchaseSummary";
import { EthereumTransactionButton } from "../EthereumTransactionButton";
import { BigNumber } from "@joincivil/typescript-types";

export interface UniswapBuyProps {
  usdToSpend: number;
  ethToSpend: number;
  ethExchangeRate: number;
  onBuyComplete(): void;
}

export const UniswapBuy: React.FunctionComponent<UniswapBuyProps> = ({
  ethToSpend,
  ethExchangeRate,
  usdToSpend,
  onBuyComplete,
}) => {
  const context = React.useContext<ICivilContext>(CivilContext);
  const uniswap = context.uniswap;
  const [cvlToReceive, setCvlToReceive] = React.useState<BigNumber | null>(null);

  React.useEffect(() => {
    async function updatePrice(): Promise<void> {
      await context.civil!.currentProviderEnable();
      const weiToSpend = uniswap.parseEther(ethToSpend.toString());
      const result = await uniswap.quoteETHToCVL(weiToSpend);
      setCvlToReceive(result);
    }

    updatePrice().catch(err => {
      // TODO(dankins): commenting out this error to prevent storyshots from complaining.
      // this was silently failing before due to the way the component was set up
      // there are definitely more components that suffer the same fate
      // see UnhandledPromiseRejectionWarning: Error: Invalid JSON RPC response: "" at the end of the test run
      // console.log("error updating price", err);
    });
  }, [context, ethToSpend]);

  async function buyCVL(): Promise<any> {
    const weiToSpend = uniswap.parseEther(ethToSpend.toString());
    return uniswap.executeETHToCVL(weiToSpend, cvlToReceive!);
  }

  if (!cvlToReceive) {
    return <div>loading price...</div>;
  }
  const cvl = uniswap.weiToEtherNumber(cvlToReceive);

  let pricePerCVL;
  if (ethToSpend === 0) {
    pricePerCVL = 0;
  } else {
    pricePerCVL = (ethExchangeRate * ethToSpend) / cvl;
  }

  return (
    <CurrencyConverterSection>
      <TokenPurchaseSummary
        mode="buy"
        currencyCode="CVL"
        pricePer={pricePerCVL}
        totalTokens={cvl}
        totalPrice={pricePerCVL * cvl}
      />
      <div>
        <EthereumTransactionButton
          modalHeading={`Confirm in Metamask to complete your purchase of ${cvl} CVL`}
          execute={async () => buyCVL()}
          disabled={usdToSpend === 0}
          onComplete={onBuyComplete}
        >
          Buy CVL on the open market from Uniswap
        </EthereumTransactionButton>
      </div>
    </CurrencyConverterSection>
  );
};
