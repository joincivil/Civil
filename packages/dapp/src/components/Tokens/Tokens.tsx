import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { State } from "../../redux/reducers";
import { Helmet } from "react-helmet";
import { EthAddress } from "@joincivil/core";
import { getFormattedEthAddress } from "@joincivil/utils";

import { UserTokenAccount } from "@joincivil/components";
import ScrollToTopOnMount from "../utility/ScrollToTop";

export interface TokensProps {
  userAccount: EthAddress;
}

export const TokensComponent: React.SFC<TokensProps> = props => {
  return (
    <>
      <Helmet>
        <title>Token Account - The Civil Registry</title>
      </Helmet>
      <ScrollToTopOnMount />
      <UserTokenAccount
        userLoggedIn={true}
        userTutorialComplete={false}
        userAccount={props.userAccount}
        supportEmailAddress={"support@civil.co"}
        faqUrl={"https://cvlconsensys.zendesk.com/hc/en-us"}
      />
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
