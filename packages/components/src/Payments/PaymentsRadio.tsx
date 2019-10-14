import * as React from "react";
import { PaymentsRadioBtnContain, PaymentsRadioBtn } from "./PaymentsStyledComponents";

export interface PaymentsRadioProps {
  onChange?: any;
  value: any;
  name?: string;
}

export const PaymentsRadio: React.FunctionComponent<PaymentsRadioProps> = props => {
  let input: any;
  const { onChange, children, value, name } = props;
  const clickHandler = () => {
    input.checked = true;
    if (onChange) {
      onChange(name, input.value);
    }
  };

  return (
    <PaymentsRadioBtnContain>
      <input type="radio" value={value} onChange={onChange} name={name} ref={ref => (input = ref)} />
      <PaymentsRadioBtn onClick={clickHandler}>
        {children}
      </PaymentsRadioBtn>
    </PaymentsRadioBtnContain>
  );
};
