import { Civil } from "../src";

const civil = new Civil();
const newsroom = civil.newsroomAtUntrusted("0x1234566789..");

newsroom
  .proposedContent()
  .subscribe((article) => console.log("Proposed article, uri:" + article.uri));

(async () => {
  console.log("Proposing a new article...");
  try {
    const id = await newsroom.propose("This is example content that I want to post");
    console.log("Article proposed: ", id);
  } catch (e) {
    console.error("Failed to propose article:", e);
  }
})();
