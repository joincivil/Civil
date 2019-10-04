import * as React from "react";
import styled from "styled-components";

import { NavBar } from "../components/header/NavBar";
import Footer from "../components/footer/Footer";

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  height: 100vh;
`;

const Fill = styled.div`
  flex-grow: 1;
`;

export const RegistryShell = () => {
  return (
    <Shell>
      <NavBar showUser={false} />
      <Fill></Fill>
      <Footer />
    </Shell>
  );
};
