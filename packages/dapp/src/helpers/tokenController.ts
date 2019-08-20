import { EthAddress } from "@joincivil/core";
import { getTCR } from "./civilInstance";

export async function getCivilianWhitelist(user: EthAddress): Promise<boolean> {
  const tcr = await getTCR();
  const token = await tcr.getToken();
  return token.isCivilian(user);
}

export async function getUnlockedWhitelist(user: EthAddress): Promise<boolean> {
  const tcr = await getTCR();
  const token = await tcr.getToken();
  return token.isUnlocked(user);
}
