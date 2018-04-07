/**
 * Checks for the # part of the url and if the parametrs of newsroom and the article are there,
 * use them.
 * Otherwise open a html form and request that data from the user
 */

export interface ArticleParams {
    newsroomAddress: string;
    articleId: number;
}
export async function getParameters(): Promise<ArticleParams> {
    return new Promise<ArticleParams>((resolve, reject) => {
        const content = document.getElementById("content")!;
        content.classList.add("hidden");
        const inputDiv = document.getElementById("param-input")!;
        inputDiv.classList.remove("hidden");
        const submitButton = document.getElementById("param-submit")!;
        submitButton.onclick = (event) => {
            const newsroomAddress = (document.getElementById("newsroom-address") as any).value;
            const articleId = +((document.getElementById("article-id") as any).value);
            inputDiv.classList.add("hidden");
            content.classList.remove("hidden");
            resolve({
                newsroomAddress,
                articleId,
            });
        };
    });
}
