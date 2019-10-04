import * as React from "react";
import styled from "styled-components";

import { Navigation } from "../components/header/Navigation";

const BlankHeader = styled.div`
  left: 0px;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 999;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  display: flex;
  font-family: "Libre Franklin", sans-serif;
  font-size: 12px;
  font-weight: 500;
  -webkit-box-pack: justify;
  justify-content: space-between;
  letter-spacing: 1px;
  min-height: 74px;
  text-transform: uppercase;
  position: relative;
  border-bottom: 1px solid rgb(90, 86, 83);
  padding: 10px 20px;
`;

export const RegistryShell = () => {
  return (
    <div>
      <Navigation />
    </div>
  );
};
