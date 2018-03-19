import { Civil } from "@joincivil/core";
import * as marked from "marked";

import { getParameters } from "./parameters";

// Metamask is injected after full load
window.addEventListener("load", async () => {
  const urlString = window.location.href;
  const url = new URL(urlString);
  const address = url.searchParams.get("newsroomAddress");
  const articleId = url.searchParams.get("articleId");

  // TODO: fix article loading

  // const article = await newsroom.loadArticle(params.articleId);
  // console.log(article);

  // const parsedContent = marked(article.content);
  // document.getElementById('content')!.innerHTML = parsedContent;
  // console.log(parsedContent);
});
