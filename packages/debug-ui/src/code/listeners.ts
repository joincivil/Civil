import { deployNewsroom } from "../../scripts/deploy-newsroom";
import { apply, updateStatus } from "../../scripts/tcrActions";
// import * as fs from "fs";
import { Civil } from "@joincivil/core";

export function setIndexListeners(): void {
  const deployButton = document.getElementById("param-deployNewsroom")!;
  deployButton.onclick = async (event) => {
    const newsroomAddress = await deployNewsroom();
    window.location.assign("/newsroom.html?address=" + newsroomAddress);
  };
}

export function setNewsroomListeners(): void {
  const urlString = window.location.href;
  const url = new URL(urlString);
  const address = url.searchParams.get("address");
  const civil = new Civil({ debug: true });

  const applyButton = document.getElementById("param-applyToTCR")!;
  applyButton.onclick = async (event) => {
    if (address) {
      // TODO(nickreynolds): turn off button, display "deploying..."
      await apply(address, civil);
      // TODO(nickreynolds): show success
    } else {
      console.error("newsroom address not found in params");
    }
  };

  const updateStatusButton = document.getElementById("param-updateListingStatus")!;
  updateStatusButton.onclick = async (event) => {
    if (address) {
      // TODO(nickreynolds): turn off button, display "updating..."
      await updateStatus(address, civil);
      // TODO(nickreynolds): show success
    } else {
      console.error("newsroom address not found in params");
    }
  };

  const proposeAndApproveButton = document.getElementById("param-proposeAndApprove")!;
  proposeAndApproveButton.onclick = async (event) => {
    // TODO(nickreynolds): fix fs
    // TODO(ritave): extract into scripts
    // const article = fs.readFileSync("assets/article.md").toString();
    const article = "This is article.";
    if (address) {
      console.log("Deploying newsroom");
      const deployedNewsroom = await civil.newsroomAtUntrusted(address);
      console.log("Proposing content");
      const articleId = await deployedNewsroom.proposeContent(article);
      console.log(`\tContent id: ${articleId}`);

      console.log("Approving content");
      // console.debug(await deployedNewsroom.approveContent(articleId).awaitReceipt());
      console.log("Done");

      window.location.assign("/article.html?newsroomAddress=" + address + "&articleId=" + articleId);

    } else {
      console.error("newsroom address not found in params");
    }
  };
}
