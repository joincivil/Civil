import * as React from "react";
import styled from "styled-components";

export const SocialWrapper = styled.div`
  margin-bottom: 15px;
  width: 100%;

  label {
  }
`;

export const SocialBtnFlex = styled.div`
  align-items: center;
  display: flex;
  justify-content: space between;

  a {
    margin-right: 10px;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;
