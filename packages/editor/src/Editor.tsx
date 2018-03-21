// Import the `Value` model.
import * as React from "react";
import { Editor } from "slate-react";
import styled from "styled-components";
import { OnChangeFunc, Plugin } from "./plugins";

export interface EditorProps {
    value: any;
    onChange: OnChangeFunc;
    readOnly: boolean;
    plugins: Plugin[];
}

export interface EditorState {
  value?: any;
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
  position: relative;
`;

export class CivilEditor extends React.Component<EditorProps, EditorState> {
    constructor(props: EditorProps) {
        super(props);
        this.state = {
            value: props.value,
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
              readOnly={ this.props.readOnly }
            />
          </CenterDiv>
       );
    }
}
