import * as React from "react";
import { TokenRequirement } from "./TokensStyledComponents";

export const UserTokenAccountRequirement: React.StatelessComponent = props => {
  return <TokenRequirement>{props.children}</TokenRequirement>;
};
