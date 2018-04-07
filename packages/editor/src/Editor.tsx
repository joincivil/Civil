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
  width: 805px;
`;

const StyledEditor = styled(Editor)`
  width: 585px;
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
