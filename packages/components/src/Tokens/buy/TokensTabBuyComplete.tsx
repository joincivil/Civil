import * as React from "react";
import { TokenBuySellComplete } from "../TokensStyledComponents";
import { TokenBuyCompleteText } from "../TokensTextComponents";
import { TokensUnlockMessage } from "../TokensUnlockMessage";
import { HollowGreenCheck } from "../../icons";
import { CivilContext, ICivilContext } from "../../context";
import { useAsyncEffect } from "../../hooks/useAsyncEffect";

export const TokensTabBuyComplete = () => {
  const [unlocked, setUnlocked] = React.useState<boolean | null>(null);
  const civilContext = React.useContext<ICivilContext>(CivilContext);

  useAsyncEffect(async () => {
    const civil = civilContext.civil!;
    const account = await civil.accountStream.first().toPromise();
    if (!account) {
      setUnlocked(false);
      return;
    }
    const tcr = await civil.tcrSingletonTrusted();
    const token = await tcr.getToken();
    const isUnlocked = await token.isUnlocked(account);
    setUnlocked(isUnlocked);
  }, []);

  return (
    <>
      <TokenBuySellComplete>
        <HollowGreenCheck width={48} height={48} />
        <TokenBuyCompleteText />
      </TokenBuySellComplete>
      {unlocked === false ? <TokensUnlockMessage /> : null}
    </>
  );
};
