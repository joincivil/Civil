import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { mediaQueries } from "../styleConstants";

export interface ContentRowProps {
  reverseDirection?: boolean;
}

export interface ContentWellProps {
  offsetTop?: number;
}

export const StyledMainContainer = styled.div`
  margin-top: 74px;

  ${mediaQueries.MOBILE} {
    margin-top: 52px;
  }
`;

export const StyledContentRow = styled.div`
  display: flex;
  flex-direction: ${(props: ContentRowProps) => (props.reverseDirection ? "row-reverse" : "row")};
  margin: 0 auto;
  width: 1110px;

  ${mediaQueries.MOBILE} {
    display: block;
    margin: 0;
    width: auto;
  }
`;

export const StyledLeftContentWell = styled.div`
  width: 636px;
  ${(props: ContentWellProps) => (props.offsetTop ? `margin-top: ${props.offsetTop.toString()}px` : "")};

  ${mediaQueries.MOBILE} {
    margin: 0 16px;
    width: auto;
  }
`;

export const StyledRightContentWell = styled.div`
  margin-left: 31px;
  ${(props: ContentWellProps) => (props.offsetTop ? `margin-top: ${props.offsetTop.toString()}px` : "")};
  width: 440px;

  ${mediaQueries.MOBILE} {
    margin: 0 16px;
    ${(props: ContentWellProps) => (props.offsetTop ? `margin-top: ${(props.offsetTop / 2).toString()}px` : "")};
    width: auto;
  }
`;
