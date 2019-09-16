import * as React from "react";
import { URLInput } from "../input/";
import { Button } from "../Button";
import styled from "styled-components";
import { fonts, colors, mediaQueries } from "../styleConstants";

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

  ${mediaQueries.MOBILE} {
    display: block;

    ${Button} {
      margin: 0;
      width: 100%;
    }
  }
`;

export interface SubmitLinkResponseProps {
  error: boolean;
}

export const ResponseText = styled.p`
  color: ${colors.accent.CIVIL_RED};
  ${(props: SubmitLinkResponseProps) => (props.error ? colors.accent.CIVIL_RED : colors.primary.BLACK)};
  font: ${fonts.SANS_SERIF};
  font-size: 12px;
`;

export interface SubmitLinkProps {
  name: string;
  buttonText?: string;
  placeholder?: string;
  loading: boolean;
  success: boolean;
  error: boolean;
  onSubmit(): void;
  onChange(name: string, value: string): any;
}

export class SubmitLink extends React.Component<SubmitLinkProps> {
  public render(): JSX.Element {
    const { buttonText, name, placeholder, loading, success, error, onChange, onSubmit } = this.props;

    return (
      <>
        <form>
          <SubmitLinkStyled>
            <URLInput name={name} placeholder={placeholder} onChange={() => onChange} />
            <Button disabled={loading} type="submit" onClick={onSubmit}>
              {loading ? "Loading..." : buttonText || "Submit Link"}
            </Button>
          </SubmitLinkStyled>
          <ResponseText error={error}>
            {error && <>There was an error submitting your link. Please try again.</>}
            {success && <>Your link has been submitted.</>}
          </ResponseText>
        </form>
      </>
    );
  }
}
