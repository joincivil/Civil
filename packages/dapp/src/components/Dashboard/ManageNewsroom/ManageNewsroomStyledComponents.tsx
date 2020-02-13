import * as React from "react";
import styled from "styled-components/macro";
import { OBSectionHeader, OBSectionDescription } from "@joincivil/components";

export const ManageNewsroomSmartContractStyles = styled.div`
  ${OBSectionHeader} {
    display: none;
  }

  ${OBSectionDescription} {
    font-size: 16px;
    line-height: 24px;
    text-align: left;
  }
`;
