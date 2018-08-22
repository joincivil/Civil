import { ButtonTheme } from "./Button";
import { LinkTheme } from "./ViewTransactionLink";
import { StepHeaderTheme } from "./StepProcess";

export interface Theme extends ButtonTheme, LinkTheme, StepHeaderTheme {
  sansSerifFont: string;
  serifFont: string;
}
