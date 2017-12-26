import { ContentHeader, NewsroomContent } from "../../types";

export interface ContentProvider {
  scheme(): string;
  get(what: string|ContentHeader): Promise<NewsroomContent>;
  put(what: NewsroomContent): Promise<string>;
}
