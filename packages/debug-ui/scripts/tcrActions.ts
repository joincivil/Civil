import { Civil } from "@joincivil/core";
import BigNumber from "bignumber.js";
import { EthAddress } from "../../core/build/src/types";

export async function apply(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Apply to TCR");
  const tcr = await civil.getDeployedOwnedAddressTCRWithAppeals();

  const eip20Address = await tcr.getTokenAddress();
  const eip = await civil.eip20AtUntrusted(eip20Address);

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(tcr.address);
  if (approvedTokensForSpender.toNumber() < 1000) {
    await eip.approveSpender(tcr.address, new BigNumber(1000 - approvedTokensForSpender.toNumber()));
  }

  const { awaitReceipt } = await tcr.apply(address, new BigNumber(1000), "test");
  const applyReceipt = await awaitReceipt;
  console.log("Applied to TCR");
}

export async function challenge(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Challenging TCR Listing");
  const tcr = await civil.getDeployedOwnedAddressTCRWithAppeals();

  const eip20Address = await tcr.getTokenAddress();
  const eip = await civil.eip20AtUntrusted(eip20Address);

  const approvedTokensForSpender = await eip.getApprovedTokensForSpender(tcr.address);
  if (approvedTokensForSpender.toNumber() < 1000) {
    await eip.approveSpender(tcr.address, new BigNumber(1000 - approvedTokensForSpender.toNumber()));
  }

  const { awaitReceipt } = await tcr.challenge(address, "test");
  const applyReceipt = await awaitReceipt;
  console.log("Challenged TCR Listing");
}

export async function updateStatus(address: EthAddress, optionalCivil?: Civil): Promise<void> {
  const civil = optionalCivil || new Civil();

  console.log("Apply to TCR");
  const tcr = await civil.getDeployedOwnedAddressTCRWithAppeals();

  const { awaitReceipt } = await tcr.updateListing(address);
  const applyReceipt = await awaitReceipt;
  console.log("Applied to TCR");
}
