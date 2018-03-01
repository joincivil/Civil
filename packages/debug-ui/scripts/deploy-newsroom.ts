import { Civil } from "@joincivil/core";
import * as fs from "fs";

(async () => {
    const article = fs
        .readFileSync("assets/article.md")
        .toString();

    const civil = new Civil();
    console.log("Deploying newsroom");
    const newsroom = await civil.newsroomDeployTrusted();
    console.log(`\tNewsroom at: ${newsroom.address}`);

    console.log("Proposing content");
    const articleId = await newsroom.proposeContent(article);
    console.log(`\tContent id: ${articleId}`);

    console.log("Approving content");
    console.debug(await newsroom.approveContent(articleId));
    console.log("Done");
})()
.catch((...params: any[]) => console.error(...params));
