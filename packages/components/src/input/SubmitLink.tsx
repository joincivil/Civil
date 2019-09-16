import * as React from "react";
import { URLInput } from "../input/";
import { Button } from "../Button";
import styled from "styled-components";

export const SubmitLinkStyled = styled.div`
  align-items: flex-start;
  display: flex;

  ${Button} {
    border-radius: 0;
    font-size: 14px;
    letter-spacing: 0;
    margin: 5px 0 0 5px;
    padding: 12px 15px;
    text-transform: none;
    width: 200px;
  }
`;

export interface SubmitLinkProps {
  name: string;
  buttonText?: string;
  placeholder?: string;
  onSubmit(): void;
  onChange(name: string, value: string): any;
}

export class SubmitLink extends React.Component<SubmitLinkProps> {
  public render(): JSX.Element {
    const { buttonText, name, placeholder, onChange, onSubmit } = this.props;

    return (
      <>
        <form>
          <SubmitLinkStyled>
            <URLInput
              name={name}
              placeholder={placeholder}
              onChange={() => onChange}
            />
            <Button type="submit" onClick={onSubmit}>{buttonText || "Submit Link"}</Button>
          </SubmitLinkStyled>
        </form>
      </>
    );
  }
}
