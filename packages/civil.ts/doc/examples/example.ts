import { Civil } from "../../src";
import { Roles } from "../../src/contracts/newsroom";

(async () => {

  const civil = new Civil();

  console.log("Deploying newsroom...");
  const newsroom = await civil.newsroomDeployTrusted();
  console.log("Newsroom at: ", newsroom.address);

  console.log("Subscribing to new articles");
  const subscription = newsroom
    .proposedContent()
    .do((header) => console.log("\tProposed article, uri: " + header.uri))
    .flatMap(newsroom.resolveContent)
    .subscribe((article) => {
      console.log("\tContent for article id: " + article.id, article.content);
      console.log("\tUnsubscribing");
      subscription.unsubscribe();
    });

  console.log("Am I a director:", await newsroom.isDirector());

  console.log("Proposing a new article...");
  try {
    const id = await newsroom.propose("This is example content that I want to post");
    console.log("Article proposed: ", id);
  } catch (e) {
    console.error("Failed to propose article:", e);
  }
})();
