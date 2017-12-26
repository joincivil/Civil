import { ContentHeader, NewsroomContent } from "../../types";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { ContentProvider } from "./contentprovider";

// TODO(ritave): Localstorage in node env
export class DebugProvider implements ContentProvider {
  private web3Wrapper: Web3Wrapper;

  constructor(web3Wrapper: Web3Wrapper) {
    this.web3Wrapper = web3Wrapper;
  }

  public scheme(): string {
    return "debug";
  }

  public get(what: string | ContentHeader): Promise<NewsroomContent> {
    return new Promise((resolve, reject) => {
      let uri = "";
      if (typeof what !== "string") {
        uri = what.uri;
      } else {
        uri = what;
      }
      const content = localStorage.getItem(uri);
      if (content === null) {
        return reject(new Error("No such content in DebugProvider"));
      } else {
        // TODO(ritave): Check JSON schema
        return resolve(JSON.parse(content));
      }
    });
  }

  public put(what: NewsroomContent): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = "content:" + this.web3Wrapper.web3.sha3(what.content);
      localStorage.setItem(url, JSON.stringify(what));
      resolve(url);
    });
  }
}
