import * as React from "react";

import { SnackBar, InsufficientCVLForChallenge } from "@joincivil/components";

export interface InsufficientBalanceSnackBarProps {
  buyCVLURL: string;
  minDeposit: string;
}

const InsufficientBalanceSnackBar: React.FunctionComponent<InsufficientBalanceSnackBarProps> = props => {
  return (
    <SnackBar>
      <InsufficientCVLForChallenge minDeposit={props.minDeposit} buyCVLURL={props.buyCVLURL} />
    </SnackBar>
  );
};

export default InsufficientBalanceSnackBar;
