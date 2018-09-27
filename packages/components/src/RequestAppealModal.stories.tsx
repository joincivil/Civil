import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { RequestAppealModal, RequestAppealModalProps } from "./RequestAppealModal";

const StyledDiv = styled.div`
  display: flex;
  width: 100vh;
  height: 100vw;
  background-color: #fff;
`;

const Container: React.StatelessComponent = ({ children }) => (
  <StyledDiv>
    <div>{children}</div>
  </StyledDiv>
);

storiesOf("Request Appeal Modal", module).add("Request Appeal Modal", () => {
  const updateStatementValue = (key: string, value: any) => {
    console.log("update statement", key, value);
  };
  const handleClose = () => {
    console.log("Closed the Submit Challenge modal");
  };
  const props: RequestAppealModalProps = {
    open: true,
    constitutionURI: "https://civil.co#constitution",
    governanceGuideUrl: "https://civil.co#gov",
    appealFee: "1,000 CVL",
    judgeAppealLen: "14 days",
    transactions: [],
    updateStatementValue,
    handleClose,
  };

  return (
    <Container>
      <p>Some good stuff was already on the page which is pretty exciting</p>
      {process.env.NODE_ENV !== "test" && <RequestAppealModal {...props} />}
    </Container>
  );
});
