import { Civil, EthAddress } from "@joincivil/core";

export async function deployNewsroom(newsroomName: string): Promise<EthAddress> {
    const civil = new Civil();
    console.log("Deploying newsroom");
    const newsroomDeploy = await civil.newsroomDeployTrusted(newsroomName);
    const newsroom = await newsroomDeploy.awaitReceipt();
    const address = newsroom.address;
    console.log(`\tNewsroom at: ${address}`);

    return address;
}
