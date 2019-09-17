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
    margin: 5px 0 0 10px;
    padding: 10px 15px;
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
  submitting: boolean;
  success: boolean;
  error: boolean;
  onSubmit(): void;
  onChange(name: string, value: string): void;
}

export const SubmitLink: React.FunctionComponent<SubmitLinkProps> = props => {
  const { buttonText, name, placeholder, submitting, success, error, onChange, onSubmit } = props;

  return (
    <>
      <form>
        <SubmitLinkStyled>
          <URLInput name={name} placeholder={placeholder} onChange={onChange} />
          <Button disabled={submitting} type="submit" onClick={onSubmit}>
            {submitting ? "Submitting..." : buttonText || "Submit Link"}
          </Button>
        </SubmitLinkStyled>
        <ResponseText error={error}>
          {error && <>There was an error submitting your link. Please try again.</>}
          {success && <>Your link has been submitted.</>}
        </ResponseText>
      </form>
    </>
  );
};
