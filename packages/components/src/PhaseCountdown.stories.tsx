import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { CountdownTimer } from "./PhaseCountdown";
import { Button, buttonSizes } from "./Button";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`;

interface ContainerState {
  initialized: boolean;
}

class Container extends React.Component<{}, ContainerState> {
  constructor(props: any) {
    super(props);
    this.state = { initialized: false };
  }

  // TODO(jon): This is a total kludge for the fact that Storyshots doesn't like
  // our dynamically generated dates for these timers, and Storyshots doesn't seem
  // to support Jest Property Matchers (which would solve this problem)
  // https://facebook.github.io/jest/docs/en/snapshot-testing.html#property-matchers
  public render(): JSX.Element {
    if (this.state.initialized) {
      return <StyledDiv>{this.props.children}</StyledDiv>;
    }
    return (
      <StyledDiv>
        <Button onClick={this.initialize} size={buttonSizes.MEDIUM}>
          Initialize Timers
        </Button>
      </StyledDiv>
    );
  }

  private initialize = (event: any): void => {
    this.setState({ initialized: true });
  };
}

const now = Date.now() / 1000;
const eightDaysFromNow = now + 86400 * 8;

storiesOf("Application Phase Countdown Timer", module).add("Timers", () => {
  return (
    <Container>
      <h3>Base style</h3>
      <CountdownTimer endTime={eightDaysFromNow} />

      <h3>Warning style</h3>
      <CountdownTimer endTime={eightDaysFromNow} warn={true} />

      <h3>Ended</h3>
      <CountdownTimer endTime={now} />
    </Container>
  );
});
