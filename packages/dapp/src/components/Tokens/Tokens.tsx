import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../redux/reducers";
import { Helmet } from "react-helmet";
import { UserTokenAccount, LoadUser } from "@joincivil/components";
import ScrollToTopOnMount from "../utility/ScrollToTop";

export interface TokensProps {
  network: string;
}

export const TokensComponent = ({ network }: TokensProps) => {
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
