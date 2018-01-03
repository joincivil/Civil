import { Civil } from "../../src";

(async () => {

  const civil = new Civil();

  console.log("Deploying newsroom...");
  const newsroom = await civil.newsroomDeployTrusted();
  console.log("Newsroom at: ", newsroom.address);

  console.log("Subscribing to new articles");
  newsroom
    .proposedContent()
    .do((header) => console.log("Proposed article, uri: " + header.uri))
    .flatMap(newsroom.resolveContent)
    .subscribe((article) => console.log("Content for article id: " + article.id, article.content));

  console.log("Proposing a new article...");
  try {
    const id = await newsroom.propose("This is example content that I want to post");
    console.log("Article proposed: ", id);
  } catch (e) {
    console.error("Failed to propose article:", e);
  }
})();
