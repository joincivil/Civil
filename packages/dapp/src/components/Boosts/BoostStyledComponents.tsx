import * as React from "react";
import styled from "styled-components";
import { colors } from "@joincivil/components";

export const BoostHeaderWrapper = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_2};
  padding: 50px 15px;
  margin: 74px 0 30px;
`;

export const BoostHeader = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin: 0 auto;
  max-width: 900px;
`;

export const BoostWrapper = styled.div`
  margin: 0 auto;
  max-width: 900px;
`;

export const BoostIntro = styled.p`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 18px;
  line-height: 26px;
  margin: 0 0 20px;
`;

export const BoostFeedWrapper = styled.div`
  margin: 50px auto;
`;
