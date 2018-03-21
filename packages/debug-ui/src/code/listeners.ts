import { deployNewsroom } from "../../scripts/deploy-newsroom";
// import * as fs from "fs";
import { Civil } from "@joincivil/core";

export function setIndexListeners(): void {
  const deployButton = document.getElementById("param-deployNewsroom")!;
  deployButton.onclick = async (event) => {
    const newsroomAddress = await deployNewsroom("Test name");
    window.location.assign("/newsroom.html?address=" + newsroomAddress);
  };
}
