import * as React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import { UserTokenAccount } from "@joincivil/components";
import ScrollToTopOnMount from "../utility/ScrollToTop";

export const Tokens: React.SFC = props => {
  return (
    <>
      <Helmet>
        <title>Token Account - The Civil Registry</title>
      </Helmet>
      <ScrollToTopOnMount />
      <UserTokenAccount />
    </>
  );
};
