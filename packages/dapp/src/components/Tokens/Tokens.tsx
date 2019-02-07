import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { State } from "../../redux/reducers";
import { Helmet } from "react-helmet";
import { EthAddress } from "@joincivil/core";
import { getFormattedEthAddress } from "@joincivil/utils";

import { UserTokenAccount } from "@joincivil/components";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { LoadUser } from "../Account/LoadUser";

export interface TokensProps {
  userAccount: EthAddress;
}

export const TokensComponent: React.SFC<TokensProps> = props => {
  // TODO:Sarah foundationAddress to @joincivil/utils
  return (
    <>
      <Helmet>
        <title>Token Account - The Civil Registry</title>
      </Helmet>
      <ScrollToTopOnMount />
      <LoadUser>
        {({ loading, user }: any) => {
          if (loading) {
            return "loading..";
          }

          return (
            <UserTokenAccount
              userTutorialComplete={false}
              userAccount={props.userAccount}
              supportEmailAddress={"support@civil.co"}
              faqUrl={"https://cvlconsensys.zendesk.com/hc/en-us"}
              foundationAddress={"0xf1176B0aeb7914B5472B61c97A4CF0E0bcacB579"}
            />
          );
        }}
      </LoadUser>
    </>
  );
};

const mapStateToProps = (state: State): TokensProps => {
  const { user } = state.networkDependent;

  let userAccount = "";
  if (user && user.account.account) {
    userAccount = getFormattedEthAddress(user.account.account);
  }

  return {
    userAccount,
  };
};

export const Tokens = connect(mapStateToProps)(TokensComponent);
