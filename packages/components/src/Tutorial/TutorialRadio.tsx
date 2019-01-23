import * as React from "react";
import { TutorialOptionBox } from "./TutorialStyledComponents";

export interface TutorialOptionProps {
  onChange?: any;
  value?: any;
  name?: string;
}

export const TutorialRadio: React.StatelessComponent<TutorialOptionProps> = props => {
  return (
    <TutorialOptionBox>
      <input type="radio" value={props.value} name={props.name} />
      <span>{props.children}</span>
    </TutorialOptionBox>
  );
};
