import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { SignConstitutionButton } from "./SignConstitutionButton";
import { Civil } from "@joincivil/core";

let civil: Civil | undefined;

try {
  civil = new Civil();
} catch (error) {
  civil = undefined;
}

const signConstitution = async (): Promise<void> => {
  console.log("Signing the Constituion!");
};

const Wrapper = styled.div`
  margin: 50px;
  max-width: 500px;
`;

storiesOf("Sign Constitution Button", module)
  .add("User can sign", () => {
    return (
      <Wrapper>
        <SignConstitutionButton
          civil={civil}
          requiredNetwork="rinkeby"
          isNewsroomOwner={true}
          signConstitution={signConstitution}
        >
          Create Newsroom
        </SignConstitutionButton>
      </Wrapper>
    );
  })
  .add("Metamask is not installed", () => {
    return (
      <Wrapper>
        <SignConstitutionButton
          civil={undefined}
          requiredNetwork="rinkeby"
          isNewsroomOwner={false}
          signConstitution={signConstitution}
        >
          Create Newsroom
        </SignConstitutionButton>
      </Wrapper>
    );
  })
  .add("Metamask is locked", () => {
    const fakeCivil = {};
    return (
      <Wrapper>
        <SignConstitutionButton
          civil={fakeCivil as Civil}
          requiredNetwork="rinkeby"
          isNewsroomOwner={false}
          signConstitution={signConstitution}
        >
          Create Newsroom
        </SignConstitutionButton>
      </Wrapper>
    );
  })
  .add("Metamask connected to wrong network", () => {
    const fakeCivil = { userAccount: "0x0", networkName: "fakenet" };
    return (
      <Wrapper>
        <SignConstitutionButton
          civil={fakeCivil as Civil}
          requiredNetwork="rinkeby"
          isNewsroomOwner={false}
          signConstitution={signConstitution}
        >
          Create Newsroom
        </SignConstitutionButton>
      </Wrapper>
    );
  })
  .add("User is not an Owner of the Newsroom", () => {
    return (
      <Wrapper>
        <SignConstitutionButton
          civil={civil}
          requiredNetwork="rinkeby"
          isNewsroomOwner={false}
          signConstitution={signConstitution}
        >
          Create Newsroom
        </SignConstitutionButton>
      </Wrapper>
    );
  });
