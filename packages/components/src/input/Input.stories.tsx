import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { Dropdown, DropdownGroup, DropdownItem } from "./Dropdown";
import { TextInput, HeaderInput, CurrencyInput } from "./Input";
import { RadioInput, RadioButton } from "./RadioInput";

type changeCallback = (name: string, value: any) => any;
interface ControlProps {
  children(state: any, onChange: changeCallback): React.ReactNode;
}
class ControlComponent extends React.Component<ControlProps, any> {
  constructor(props: any) {
    super(props);

    this.state = {};
  }

  public render(): React.ReactNode {
    return this.props.children(this.state, this.onChange);
  }

  private onChange = (name: string, value: any): any => {
    console.log("change: ", name, value);
    this.setState({ [name]: value });
  };
}

const StyledDiv = styled.div`
  display: flex;
  div > * {
  }
`;

const Container: React.StatelessComponent<{}> = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("Inputs", module)
  .add("Text Input", () => {
    return (
      <ControlComponent>
        {(state: any, onChange: changeCallback) => (
          <TextInput label="Text Input" placeholder="Enter a value" name="TextInput" onChange={onChange} />
        )}
      </ControlComponent>
    );
  })
  .add("Header Input", () => {
    return (
      <ControlComponent>
        {(state: any, onChange: changeCallback) => (
          <HeaderInput label="Header Input" placeholder="I am a header input" name="HeaderInput" onChange={onChange} />
        )}
      </ControlComponent>
    );
  })

  .add("Currency Input", () => {
    return (
      <ControlComponent>
        {(state: any, onChange: changeCallback) => (
          <CurrencyInput label="Currency Input" placeholder="$0.00" name="CurrencyInput" onChange={onChange} />
        )}
      </ControlComponent>
    );
  })

  .add("Radio Input", () => {
    let result: any;
    const onChange = (name: string, value: any) => {
      console.log("Radio Input change", name, value, result.RadioGroup.value);
    };

    return (
      <div>
        <RadioInput
          onChange={onChange}
          label="Group of radio buttons"
          name="RadioGroup"
          inputRef={(ref: any) => (result = ref)}
        >
          <RadioButton value="daily">Daily</RadioButton>
          <RadioButton value="weekly">Weekly</RadioButton>
          <RadioButton value="monthly">Monthly</RadioButton>
          <RadioButton value="yearly">Yearly</RadioButton>
        </RadioInput>
      </div>
    );
  });
