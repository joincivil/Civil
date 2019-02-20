import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { State } from "../../redux/reducers";
import { Helmet } from "react-helmet";

import { UserTokenAccount } from "@joincivil/components";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { LoadUser } from "../Account/LoadUser";

export interface TokensProps {
  network: string;
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
        {({ loading, user }) => {
          if (loading) {
            return "loading..";
          }

          return (
            <UserTokenAccount
              supportEmailAddress={"support@civil.co"}
              faqUrl={"https://cvlconsensys.zendesk.com/hc/en-us"}
              foundationAddress={"0xf1176B0aeb7914B5472B61c97A4CF0E0bcacB579"}
              network={props.network}
              user={user}
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
