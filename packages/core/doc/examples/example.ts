import * as process from "process";

import { Civil } from "../../src";

(async () => {
  const civil = new Civil();

  console.log("Deploying newsroom...");
  const newsroom = await (await civil.newsroomDeployTrusted("My new newsroom")).awaitReceipt();
  console.log("Newsroom at: ", newsroom.address);

  console.log("Subscribing to new articles");
  const articleSubscription = newsroom
    .proposedContent()
    .do((header) => console.log("\tProposed article, uri: " + header.uri))
    .flatMap(async (header) => newsroom.resolveContent(header))
    .subscribe((article) => {
      console.log("\tContent for article id: " + article.id, article.content);
      console.log("\tUnsubscribing");
      articleSubscription.unsubscribe();
    });

  console.log("Subscribing to latest name changes");
  const nameSubscription = newsroom
    .nameChanges("latest")
    .subscribe((name) => {
      console.log("\tThe name of the Newsroom changed to", name);
    });

  console.log("Am I the owner:", await newsroom.isOwner());

  console.log("Proposing a new article...");
  try {
    const id = await (await newsroom.proposeContent("This is example content that I want to post")).awaitReceipt();
    console.log("Article proposed: ", id);
  } catch (e) {
    console.error("Failed to propose article:", e);
  }

  console.log("Changing names");
  await Promise.all(
    ["Second name", "Third name", "Last name"].map(async (name) => {
      console.log("Changing name to:", name);
      await (await newsroom.setName(name)).awaitReceipt();
    }),
  );
  nameSubscription.unsubscribe();
})()
.catch((err) => {
  console.error(err);
  process.exit(1);
});
