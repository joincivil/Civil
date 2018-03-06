import * as React from "react";
import styled, { StyledComponentClass } from "styled-components"; // tslint:disable-line

const P = styled.p`
  font-family: 'Spectral', serif;
  font-weight: 400;
  font-size: 21px;
  line-height: 34px;
  margin-top: 0;
  margin-bottom: 13px;
  color: #555;
`;
// tslint:disable-next-line:variable-name
export const Paragraph: React.SFC<SlateProps> = ({children, ...props}) => {
  return (
    <P {...props}>{children}</P>
  );
};
