import { ButtonTheme } from "./Button";
import { LinkTheme } from "./ViewTransactionLink";

export interface Theme extends ButtonTheme, LinkTheme {
  sansSerifFont: string;
}
