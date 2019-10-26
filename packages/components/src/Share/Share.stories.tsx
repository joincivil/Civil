import * as React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import { ShareStory } from "@joincivil/elements";

const Container = styled.div`
  width: 400px;
`;

storiesOf("Common / Share", module).add("Share Story", () => {
  return (
    <Container>
      <ShareStory title={"Memes and Satire on Hong Kong’s Front Lines"} url={"https://civil.co"} />
    </Container>
  );
});
