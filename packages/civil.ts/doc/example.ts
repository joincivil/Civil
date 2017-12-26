import { Civil } from "../src";

const civil = new Civil();
const newsroom = civil.newsroomAtUntrusted("0x1234566789..");

newsroom
  .proposedContent()
  .subscribe((article) => console.log("Proposed article, uri:" + article.uri));

(async () => {
  console.log("Proposing a new article...");
  try {
    const tx = await newsroom.propose("http://mycontent.data");
    console.log("Article proposed: ", tx);
  } catch (e) {
    console.error("Failed to propose article:", e);
  }
})();
