import { storiesOf } from "@storybook/react";
import * as React from "react";
import { SlideCheckbox } from "./SlideCheckbox";
import { Checkbox, CheckboxSizes } from "./Checkbox";

interface TestComponentState {
  checked: boolean;
}

class TestSlideComponent extends React.Component<any, TestComponentState> {
  constructor(props: any) {
    super(props);
    this.state = {
      checked: false,
    };
  }
  public render(): JSX.Element {
    return <SlideCheckbox onClick={this.onClick} checked={this.state.checked} />;
  }
  private onClick = (): void => {
    this.setState({ checked: !this.state.checked });
  };
}

class TestComponent extends React.Component<
  { id?: string; checked?: boolean; size?: CheckboxSizes },
  TestComponentState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      checked: this.props.checked || false,
    };
  }
  public render(): JSX.Element {
    return <Checkbox onClick={this.onClick} checked={this.state.checked} size={this.props.size} id={this.props.id} />;
  }
  private onClick = (): void => {
    this.setState({ checked: !this.state.checked });
  };
}

storiesOf("Pattern Library / inputs / check box", module)
  .add("slide check box", () => {
    return <TestSlideComponent />;
  })
  .add("checkboxes", () => (
    <ul>
      <li>
        <label htmlFor="check1">Default:</label>
        <TestComponent id="check1" />
      </li>
      <li>
        <label htmlFor="check2">Default checked:</label>
        <TestComponent checked id="check2" />
      </li>
      <li>
        <label htmlFor="check3">Small:</label>
        <TestComponent size={CheckboxSizes.SMALL} id="check3" />
      </li>
      <li>
        <label htmlFor="check4">Small checked:</label>
        <TestComponent size={CheckboxSizes.SMALL} checked id="check4" />
      </li>
    </ul>
  ));
