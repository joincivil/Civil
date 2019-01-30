import * as React from "react";
import { Helmet } from "react-helmet";
import { UserTokenAccount } from "@joincivil/components";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { LoadUser } from "../Account/LoadUser";

export const Tokens: React.SFC = props => {
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

          return <UserTokenAccount user={user} />;
        }}
      </LoadUser>
    </>
  );
};
