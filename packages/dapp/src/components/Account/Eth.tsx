import * as React from "react";
import { AccountEthAuth } from "@joincivil/components";
import { getCivil } from "../../helpers/civilInstance";

export class AccountEth extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <AccountEthAuth
          civil={getCivil()}
          onAuthenticated={d => {
            console.log("AccountEthAuth", d);
          }}
        />
      </>
    );
  }
}
