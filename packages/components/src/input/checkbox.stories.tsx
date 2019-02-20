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

class TestComponent extends React.Component<{ checked?: boolean; size?: CheckboxSizes }, TestComponentState> {
  constructor(props: any) {
    super(props);
    this.state = {
      checked: this.props.checked || false,
    };
  }
  public render(): JSX.Element {
    return <Checkbox onClick={this.onClick} checked={this.state.checked} size={this.props.size} />;
  }
  private onClick = (): void => {
    this.setState({ checked: !this.state.checked });
  };
}

storiesOf("check box", module)
  .add("slide check box", () => {
    return <TestSlideComponent />;
  })
  .add("checkboxes", () => (
    <ul>
      <li>
        Default: <TestComponent />
      </li>
      <li>
        Default checked: <TestComponent checked />
      </li>
      <li>
        Small: <TestComponent size={CheckboxSizes.SMALL} />
      </li>
      <li>
        Small checked: <TestComponent size={CheckboxSizes.SMALL} checked />
      </li>
    </ul>
  ));
