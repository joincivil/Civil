import * as React from "react";
// tslint:disable-next-line
import styled, { StyledComponentClass } from "styled-components";
import { colorConstants } from "../../colorConstants";

export interface TitleProps {
  readOnly: boolean;
  value: any;
  onChange: any;
}

export interface H1Props {
  contenteditable: string;
}

const H1 = styled.h1`
  font-weight: 200;
  font-family: "Spectral", serif;
  width: 100%;
  font-size: 40px;
  line-height: 45px;
  color: ${colorConstants.BLACK};
  position: relative;
  display: block;
`;

const LeadIn = styled.p`
  font-weight: 200;
  font-family: "Libre Franklin", sans-serif;
  font-size: 24px;
  color: ${colorConstants.BLACK};
  position: relative;
  display: block;
  width: 90%;
`;

const InputH = styled.input`
  outline: none;
  font-weight: 200;
  font-family: "Spectral", serif;
  width: 100%;
  font-size: 40px;
  line-height: 45px;
  -webkit-appearance: none;
  border: none;
  background-image: none;
  background-color: transparent;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  color: ${colorConstants.BLACK};
`;

const InputP = styled.input`
  outline: none;
  font-weight: 200;
  font-family: "Libre Franklin", sans-serif;
  font-size: 24px;
  width: 90%;
  -webkit-appearance: none;
  border: none;
  background-image: none;
  background-color: transparent;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  color: ${colorConstants.BLACK};
`;

const Wrapper = styled.div`
  margin-bottom: 35px;
`;

export class Title extends React.Component<TitleProps> {
  public typingHandlerTitle(e: any): void {
    const change = this.props.value.change().setNodeByKey(this.props.value.document.key, {
      data: this.props.value.document.data.merge({
        title: e.target.value,
      }),
    });
    this.props.onChange(change);
  }
  public typingHandlerLeadIn(e: any): void {
    const change = this.props.value.change().setNodeByKey(this.props.value.document.key, {
      data: this.props.value.document.data.merge({
        leadIn: e.target.value,
      }),
    });
    this.props.onChange(change);
  }
  public render(): JSX.Element {
    const title = this.props.value.document.data.get("title") || "";
    const leadIn = this.props.value.document.data.get("leadIn") || "";
    if (this.props.readOnly) {
      return (
        <Wrapper>
          <H1>{title}</H1>
          <LeadIn>{leadIn}</LeadIn>
        </Wrapper>
      );
    } else {
      return (
        <Wrapper>
          <InputH value={title} onChange={(e: any): void => this.typingHandlerTitle(e)} placeholder="Title" />
          <InputP
            value={leadIn}
            onChange={(e: any): void => this.typingHandlerLeadIn(e)}
            placeholder="Article Lead In"
          />
        </Wrapper>
      );
    }
  }
}
