import * as React from "react";
import makeBlockie from "ethereum-blockies-base64";
import { UserAvatar } from "./styledComponents";
import { KirbyEthereum, KirbyEthereumContext } from "@kirby-web3/ethereum-react";

export interface UserMenuProps {
  did: string;
}
export const UserMenu: React.FunctionComponent<UserMenuProps> = ({ did }) => {
  const kirby = React.useContext<KirbyEthereum>(KirbyEthereumContext);
  const blockie = React.useMemo(() => makeBlockie(did), [did]);

  return (
    <div>
      <UserAvatar src={blockie} height="35" width="35" onClick={() => kirby.trustedweb.showHome()} />
    </div>
  );
};
