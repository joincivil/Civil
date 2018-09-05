import { ButtonTheme } from "./Button";
import { LinkTheme } from "./ViewTransactionLink";
import { StepHeaderTheme } from "./StepProcess";
import { CheckboxTheme } from "./input";

export interface Theme extends ButtonTheme, LinkTheme, StepHeaderTheme, CheckboxTheme {
  sansSerifFont: string;
  serifFont: string;
}
