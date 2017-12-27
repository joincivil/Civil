import { ContentHeader, MapObject, NewsroomContent, Uri} from "../../types";
import { Web3Wrapper } from "../../utils/web3wrapper";
import { ContentProvider } from "./contentprovider";

export class InMemoryProvider implements ContentProvider {
  private data: MapObject<string> = {};
  private web3Wrapper: Web3Wrapper;

  constructor(web3Wrapper: Web3Wrapper) {
    this.web3Wrapper = web3Wrapper;
  }

  public scheme(): string {
    return "memory";
  }

  public get(what: Uri|ContentHeader): Promise<string> {
    return new Promise((resolve, reject) => {
      let uri = "";
      if (typeof what !== "string") {
        uri = what.uri;
      } else {
        uri = what;
      }
      if (this.data.uri === undefined) {
        return reject(new Error("No such URI (" + uri + ") found in InMemoryProvider"));
      }
      return resolve(this.data.uri);
    });
  }

  public put(content: string): Promise<Uri> {
    return new Promise((resolve, reject) => {
      const hash = this.web3Wrapper.web3.sha3(content);
      const uri = this.scheme() + "://" + hash;
      this.data.uri = content;
      resolve(uri);
    });
  }
}
