import { storiesOf } from "@storybook/react";
import * as React from "react";
import { TextInput, HeaderInput, CurrencyInput, TextareaInput } from "./Input";
import { InputGroup } from "./InputGroup";
import { RadioInput, RadioButton } from "./RadioInput";
import { CurrencyInputWithButton, TextInputWithButton } from "./InputWithButton";

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

storiesOf("Pattern Library / Inputs", module)
  .add("Text Input", () => {
    return (
      <ControlComponent>
        {(state: any, onChange: changeCallback) => (
          <TextInput label="Text Input" placeholder="Enter a value" name="TextInput" onChange={onChange} />
        )}
      </ControlComponent>
    );
  })

  .add("Input Group", () => {
    return (
      <ControlComponent>
        {(state: any, onChange: changeCallback) => (
          <InputGroup
            prepend="CVL"
            label="Input Group with Prepend Text"
            placeholder="Enter a value"
            name="TextInput"
            onChange={onChange}
          />
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
  })

  .add("Textarea Input", () => {
    return (
      <ControlComponent>
        {(state: any, onChange: changeCallback) => (
          <TextareaInput
            label="Textarea Input"
            placeholder="Input your long text"
            name="TextareaInput"
            onChange={onChange}
          />
        )}
      </ControlComponent>
    );
  })

  .add("Text Input With Button", () => {
    return (
      <ControlComponent>
        {(state: any, onChange: changeCallback) => (
          <TextInputWithButton
            placeholder="Enter a thing"
            name="TextInputWithButton"
            onChange={onChange}
            buttonText="Click Me"
            onButtonClick={() => console.log("TextInputWithButton button was clicked")}
          />
        )}
      </ControlComponent>
    );
  })

  .add("Currency Input With Button", () => {
    return (
      <ControlComponent>
        {(state: any, onChange: changeCallback) => (
          <CurrencyInputWithButton
            placeholder="Enter an amount"
            name="CurrencyInputWithButton"
            onChange={onChange}
            buttonText="Click Me"
            icon={<>CVL</>}
            onButtonClick={() => console.log("CurrencyInputWithButton button was clicked")}
          />
        )}
      </ControlComponent>
    );
  });
