import { ContentHeader, Uri } from "../types";

export interface ContentProvider {
  scheme(): string;
  get(what: Uri|ContentHeader): Promise<string>;
  put(content: string): Promise<Uri>;
}
