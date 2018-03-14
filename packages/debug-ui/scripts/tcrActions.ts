import { Civil } from "@joincivil/core";
import BN from "bignumber.js";
import { EthAddress } from "../../core/build/src/types";

export async function apply(address: EthAddress, _civil?: Civil): Promise<void> {
  const civil = _civil || new Civil();

  console.log("Apply to TCR");
  const tcrAddress = civil.getDeployedTCRAddressForCurrentNetwork();
  const tcr = await civil.ownedAddressTCRWithAppealsAtUntrusted(tcrAddress);

  const { awaitReceipt } = await tcr.apply(address, new BN(1000, 10), "test");
  const applyReceipt = await awaitReceipt;
  console.log("Applied to TCR");
}

export async function updateStatus(address: EthAddress, _civil?: Civil): Promise<void> {
  const civil = _civil || new Civil();

  console.log("Apply to TCR");
  const tcrAddress = civil.getDeployedTCRAddressForCurrentNetwork();
  const tcr = await civil.ownedAddressTCRWithAppealsAtUntrusted(tcrAddress);

  const { awaitReceipt } = await tcr.updateListing(address);
  const applyReceipt = await awaitReceipt;
  console.log("Applied to TCR");
}
