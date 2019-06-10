import * as React from "react";
import Portis from "@portis/web3";
import gql from "graphql-tag";
import { Mutation, MutationFn } from "react-apollo";
import { Button, CivilContext, ICivilContext } from "@joincivil/components";
import { Civil } from "@joincivil/core";

const portis = new Portis("1a382335-7ba0-4834-a3cd-dd1eff365f98", "rinkeby");

// function initPortis() {
//     const portis = new Portis("1a382335-7ba0-4834-a3cd-dd1eff365f98", "rinkeby");
//     portisWeb3 = new Web3(portis.provider);

//     +
//         portisWeb3.eth.getAccounts((error, accounts) => {
//             console.log(accounts);
//         });
// }

const signupMutation = gql`
  mutation($input: UserSignatureInput!) {
    authSignupEth(input: $input) {
      token
      refreshToken
      uid
    }
  }
`;

export const PortisSignup = () => {
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  React.useEffect(() => {
    portis.onLogin((walletAddress, email) => {});
  }, []);

  return (
    <div>
      <Mutation mutation={signupMutation}>
        {doSignup => {
          return <Button onClick={async () => doStuff(doSignup)}>Sign up With Portis</Button>;
        }}
      </Mutation>
    </div>
  );

  async function doStuff(doSignup: MutationFn): Promise<any> {
    const ethAPI = civilContext.civil.getEthAPI();
    ethAPI.currentProvider = portis.provider;
    const result = await ethAPI.signMessage("Sign up with Civil @ " + new Date().toISOString());
    const input = {
      message: result.message,
      messageHash: result.messageHash,
      signature: result.signature,
      signer: result.signer,
      r: result.r,
      s: result.s,
      v: result.v,
    };
    console.log("hi", result);
    const signup = doSignup({ variables: { input } });

    console.log("HEY", signup);
  }
};
