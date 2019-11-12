import * as React from "react";
import { PaymentRadioBtnContain, PaymentRadioBtn } from "./PaymentsStyledComponents";

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
    <PaymentRadioBtnContain>
      <input type="radio" value={value} onChange={onChange} name={name} ref={ref => (input = ref)} />
      <PaymentRadioBtn onClick={clickHandler}>{children}</PaymentRadioBtn>
    </PaymentRadioBtnContain>
  );
};
