import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../../redux/reducers";
import { Helmet } from "react-helmet";
import { UserTokenAccount, LoadUser } from "@joincivil/components";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import {
  tutorialBegin,
  tutorialComplete,
  tokenPurchase,
  TokenPurchaseType,
} from "../../redux/actionCreators/tokenSaleAnalytics";

export interface TokensProps {
  network: string;
}

export const TokensComponent: React.SFC<TokensProps & DispatchProp<any>> = ({ network, dispatch }) => {
  // TODO(jorgelo): Figure a way to pass these in here without busting typescript.
  const addWalletPath = "/auth/wallet";
  const signupPath = "/auth/signup";

  return (
    <>
      <Helmet title="Token Account - The Civil Registry" />
      <ScrollToTopOnMount />
      <LoadUser>
        {({ loading, user }) => {
          if (loading) {
            // TODO(jorgelo): Should we have a loading state here?
            return null;
          }

          return (
            <UserTokenAccount
              foundationAddress={"0xf1176B0aeb7914B5472B61c97A4CF0E0bcacB579"}
              network={network}
              user={user}
              addWalletPath={addWalletPath}
              signupPath={signupPath}
              onQuizBegin={() => dispatch!(tutorialBegin())}
              onQuizComplete={() => dispatch!(tutorialComplete())}
              onBuyComplete={(isFromFoundation: boolean, eth: number) =>
                dispatch!(
                  tokenPurchase(isFromFoundation ? TokenPurchaseType.FOUNDATION : TokenPurchaseType.OPEN_MARKET, eth),
                )
              }
            />
          );
        }}
      </LoadUser>
    </>
  );
};

const mapStateToProps = (state: State): TokensProps => {
  const { network } = state;

  return { network };
};

export const Tokens = connect(mapStateToProps)(TokensComponent);
