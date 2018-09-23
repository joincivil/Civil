import { ButtonTheme } from "./Button";
import { LinkTheme } from "./ViewTransactionLink";
import { StepHeaderTheme } from "./StepProcess";
import { CheckboxTheme } from "./input";
import { StepProcessTopNavTheme } from "./StepProcess/stepProccessTopNav";

export interface Theme extends ButtonTheme, LinkTheme, StepHeaderTheme, CheckboxTheme, StepProcessTopNavTheme {
  sansSerifFont: string;
  serifFont: string;
}
