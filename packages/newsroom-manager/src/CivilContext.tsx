import * as React from "react";
import { Civil } from "@joincivil/core";

export interface CivilContextValue {
  civil: Civil | undefined;
  network: string;
}

const defaultContext: CivilContextValue = { civil: undefined, network: "rinkeby"};

export const CivilContext = React.createContext(defaultContext);
