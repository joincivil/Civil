import * as React from "react";
// import {} from "./TokensTextComponents";
import { PaypalDonate, FlexColumnsSecondaryModule } from "./TokensStyledComponents";
import { PaypalLogoIcon } from "../icons/logos";

export const UserTokenAccountPaypal: React.StatelessComponent = props => {
  return (
    <FlexColumnsSecondaryModule>
      <PaypalDonate />
    </FlexColumnsSecondaryModule>
  );
};
