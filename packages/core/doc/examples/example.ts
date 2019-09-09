// import * as process from "process";

(() => {
  console.log("done");
})();

// import { Civil } from "../../src";
// import { NewsroomRoles } from "../../src/types";
// import { InMemoryProvider } from "../../src/content/inmemoryprovider";

// (async () => {
//   const civil = new Civil({ ContentProvider: InMemoryProvider });

//   console.log("Deploying newsroom...");
//   const newsroom = await (await civil.newsroomDeployTrusted("My new newsroom")).awaitReceipt();
//   console.log("Newsroom at: ", newsroom.address);

//   console.log("Subscribing to new articles");
//   const articleSubscription = newsroom
//     .revisions()
//     .do(header => console.log("\tProposed article, uri: " + header.uri))
//     .flatMap(async header => newsroom.resolveContent(header))
//     .subscribe(article => {
//       console.log("\tContent for article id: " + article.id, article.content);
//       console.log("\tUnsubscribing");
//       articleSubscription.unsubscribe();
//     });

//   console.log("Subscribing to latest name changes");
//   const nameSubscription = newsroom.nameChanges("latest").subscribe(name => {
//     console.log("\tThe name of the Newsroom changed to", name);
//   });

//   console.log("Am I the owner:", await newsroom.isOwner());

//   console.log("Setting myself to be editor");
//   await (await newsroom.addRole(civil.userAccount!, NewsroomRoles.Editor)).awaitReceipt();

//   console.log("publishing a new article...");
//   const id = await (await newsroom.publishRevision("This is example content that I want to post")).awaitReceipt();
//   console.log("Article proposed: ", id);

//   console.log("Changing names");
//   await Promise.all(
//     ["Second name", "Third name", "Last name"].map(async name => {
//       console.log("Changing name to:", name);
//       await (await newsroom.setName(name)).awaitReceipt();
//     }),
//   );
//   nameSubscription.unsubscribe();
// })().catch(err => {
//   console.trace(err);
//   process.exit(1);
// });
