import { Civil } from "@joincivil/core";
import * as marked from "marked";

import { getParameters } from "./parameters";

// Metamask is injected after full load
window.addEventListener("load", async () => {
    const civil = new Civil();
    console.log(civil);

    const params = await getParameters();
    console.log(params);
    const newsroom = await civil.newsroomAtUntrusted(params.newsroomAddress);
    console.log(newsroom);
    const article = await newsroom.loadArticle(params.articleId);
    console.log(article);

    const parsedContent = marked(article.content);
    document.getElementById('content')!.innerHTML = parsedContent;
    console.log(parsedContent);
});
