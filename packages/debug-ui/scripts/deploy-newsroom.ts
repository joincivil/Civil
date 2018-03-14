import { Civil } from "@joincivil/core";
import { EthAddress } from "../../core/build/src/types";

export async function deployNewsroom(): Promise<EthAddress> {
    const civil = new Civil();
    console.log("Deploying newsroom");
    const newsroomDeploy = await civil.newsroomDeployTrusted();
    const newsroom = await newsroomDeploy.awaitReceipt();
    const address = newsroom.address;
    console.log(`\tNewsroom at: ${address}`);

    return address;
}
