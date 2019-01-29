import * as React from "react";
import { TutorialOptionBox } from "./TutorialStyledComponents";

export interface TutorialOptionProps {
  onChange?: any;
  value: any;
  id: string;
  name?: string;
}

export const TutorialRadio: React.StatelessComponent<TutorialOptionProps> = props => {
  return (
    <TutorialOptionBox>
      <input type="radio" id={props.id} value={props.value} onChange={props.onChange} name={props.name} />
      <label htmlFor={props.id}>{props.children}</label>
    </TutorialOptionBox>
  );
};
