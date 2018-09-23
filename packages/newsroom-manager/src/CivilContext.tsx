import { Civil } from "@joincivil/core";
import * as React from "react";

export interface CivilContextValue {
  civil: Civil | undefined;
  account?: string;
  requiredNetwork: string;
  currentNetwork?: string;
}

const defaultContext: CivilContextValue = {
  civil: undefined,
  account: undefined,
  currentNetwork: undefined,
  requiredNetwork: "rinkeby",
};

export const CivilContext = React.createContext(defaultContext);
