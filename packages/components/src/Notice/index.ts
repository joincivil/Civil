import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import * as iconError from "./images/icons/ico-error-red@2x.png";
import { colors, fonts } from "../styleConstants";

export const Notice = styled.div`
  border: 1px solid rgba(242, 82, 74, 0.56);
  border-radius: 4px;
  background-color: #fff7f8;

  background-position: 10px center;
  background-image: url(${iconError});
  background-size: 30px;
  background-repeat: no-repeat;

  color: #555555;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;

  padding: 18px 0;

  text-align: center;
`;
