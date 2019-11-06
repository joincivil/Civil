import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";

export interface OpenProps {
  isOpen?: boolean;
}

export interface CollapsibleContainerProps extends OpenProps {
  index?: number;
  children: React.ReactChild;
  Header?: any;
  Title: any;
}

export interface CollapsibleContainerState {
  isOpen?: boolean;
}

const CollapsibleContainerDiv = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  background-color: ${colors.basic.WHITE};
  margin-bottom: 10px;
`;

export const Arrow2 = styled.div<OpenProps>`
  width: 8px;
  height: 8px;
  border-left: 3px solid ${colors.primary.CIVIL_GRAY_1};
  border-bottom: 3px solid ${colors.primary.CIVIL_GRAY_1};
  transform: ${props => (props.isOpen ? "rotate(135deg)" : "rotate(-45deg)")};
  transition: transform 1s;
  position: absolute;
  right: 0;
  top: 10px;
`;

const DefaultHeader = styled.div``;

export class CollapsibleContainer extends React.Component<CollapsibleContainerProps, CollapsibleContainerState> {
  constructor(props: CollapsibleContainerProps) {
    super(props);
    this.state = {
      isOpen: props.isOpen,
    };
  }
  public render(): JSX.Element {
    const { Title } = this.props;
    let { Header } = this.props;
    if (!Header) {
      Header = DefaultHeader;
    }
    return (
      <CollapsibleContainerDiv>
        <Header onClick={this.onClick} isOpen={this.state.isOpen}>
          <Title isOpen={this.state.isOpen} />
          <Arrow2 isOpen={this.state.isOpen} />
        </Header>
        {this.state.isOpen && <>{this.props.children}</>}
      </CollapsibleContainerDiv>
    );
  }
  private onClick = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
}
