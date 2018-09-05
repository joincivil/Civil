import { storiesOf } from "@storybook/react";
import * as React from "react";
import { SlideCheckbox } from "./SlideCheckbox";
import { Checkbox } from "./Checkbox";

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
    return <SlideCheckbox onClick={this.onClick} checked={this.state.checked}/>;
  }
  private onClick = (): void => {
    this.setState({checked: !this.state.checked});
  }
}

class TestComponent extends React.Component<any, TestComponentState> {
  constructor(props: any) {
    super(props);
    this.state = {
      checked: false,
    };
  }
  public render(): JSX.Element {
    return <Checkbox onClick={this.onClick} checked={this.state.checked}/>;
  }
  private onClick = (): void => {
    this.setState({checked: !this.state.checked});
  }
}

storiesOf("check box", module).add("slide check box", () => {
  return (
    <TestSlideComponent/>
  );
}).add("checkbox", () => {
  return (
    <TestComponent/>
  );
});
