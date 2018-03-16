// Import the `Value` model.
import * as React from "react";
import { Value } from "slate";
import { Editor } from "slate-react";
import styled from "styled-components";
import { OnChangeFunc, Plugin } from "./plugins";

export interface EditorProps {
    value: any;
    onChange: OnChangeFunc;
    plugins: Plugin[];
}

export interface EditorState {
  value?: any;
  currentBlock: string;
}

const CenterDiv = styled.div`
  margin: auto;
  max-width: 805px;
  display: flex;
  flex-direction: row;
  justify-content: start;
`;

const StyledEditor = styled(Editor)`
  max-width: 585px;
  position: relative;
`;

const PullQuoteDiv = styled.div`
  box-sizing: border-box;
  width: 220px;
  padding-right: 30px;
`;

export class CivilEditor extends React.Component<EditorProps, EditorState> {
    constructor(props: EditorProps) {
        super(props);
        this.state = {
            value: props.value,
            currentBlock: "paragraph",
        };
    }

    public onChange = ({ value }: { value: any; }): void => {
      this.setState({
        value,
      });
      this.props.onChange(value);
    }

    public render(): any {
        return (
          <CenterDiv>
            <PullQuoteDiv id="civil-pull-quotes"/>
            <StyledEditor
              value={ this.state.value }
              onChange={ this.onChange }
              plugins={ this.props.plugins }
            />
          </CenterDiv>
       );
    }
}
