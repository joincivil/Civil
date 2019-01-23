import * as React from "react";
import { TokenRequirement } from "./TokensStyledComponents";

export interface TokenAccountRequirementProps {
  step?: string;
}

export const UserTokenAccountRequirement: React.StatelessComponent<TokenAccountRequirementProps> = props => {
  return <TokenRequirement step={props.step}>{props.children}</TokenRequirement>;
};
