import * as React from "react";
import { TutorialRadioBtnCircle, TutorialRadioBtnContain, TutorialRadioBtn } from "./TutorialStyledComponents";

export interface TutorialOptionProps {
  onChange?: any;
  value: any;
  name?: string;
}

export const TutorialRadio: React.StatelessComponent<TutorialOptionProps> = props => {
  let input: any;
  const { onChange, children, value, name } = props;
  const clickHandler = () => {
    input.checked = true;
    if (onChange) {
      onChange(name, input.value);
    }
  };

  return (
    <TutorialRadioBtnContain>
      <input type="radio" value={value} onChange={onChange} name={name} ref={ref => (input = ref)} />
      <TutorialRadioBtn onClick={clickHandler}>
        <TutorialRadioBtnCircle />
        {children}
      </TutorialRadioBtn>
    </TutorialRadioBtnContain>
  );
};
