import { Civil } from "@joincivil/core";
import BN from "bignumber.js";
import { EthAddress } from "../../core/build/src/types";

export async function apply(address: EthAddress, _civil?: Civil): Promise<void> {
    const civil = _civil || new Civil();

    console.log("Apply to TCR");
    const tcr = await civil.ownedAddressTCRWithAppealsAtUntrusted("0x5cf4114912d0b1eacF666E1c6b9fc91eb143956b");
    console.log("tcr address: " + tcr.address);
    console.log("tcr : " + await tcr.isWhitelisted("0x56078dA599a095B42806B4037FB7F682ba0DcE52"));
    const { awaitReceipt } = await tcr.apply(address + "", new BN(1000, 10), "test");
    // const { awaitReceipt } = await tcr.deposit(address, new BN(1000, 10));
    const applyReceipt = await awaitReceipt;
    console.log("Applied to TCR");
}
