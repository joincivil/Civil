import * as React from "react";
import styled from "styled-components";
import { buttonSizes } from "./Button";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DetailsSection = styled.div`
  width: 50%;
`;

export interface DetailsButtonComponentProps {
  detailsComponent: JSX.Element | undefined;
  buttonComponent: JSX.Element | undefined;
}

export class DetailsButtonComponent extends React.Component<DetailsButtonComponentProps> {
  public render(): JSX.Element {
    return (
      <Wrapper>
        <DetailsSection>{this.props.detailsComponent}</DetailsSection>
        {this.renderButtonComponent()}
      </Wrapper>
    );
  }

  private renderButtonComponent = (): JSX.Element => {
    return React.cloneElement(this.props.buttonComponent as React.ReactElement, {
      size: buttonSizes.SMALL,
    });
  };
}
