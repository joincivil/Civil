import * as React from "react";
import { TokenDonateToCivilFoundationText } from "./TokensTextComponents";
import { PaypalDonate, FlexColumnsSecondaryModule } from "./TokensStyledComponents";

export const UserTokenAccountPaypal: React.FunctionComponent = props => {
  return (
    <FlexColumnsSecondaryModule>
      <TokenDonateToCivilFoundationText />
      <PaypalDonate />
    </FlexColumnsSecondaryModule>
  );
};
