import * as React from "react";
import { ManageNewsroom } from "./newsroom/ManageNewsroom";
import styled from "styled-components";

const ChannelAdminPage = (props: any) => {
  const channelID = props.match.params.reference;
  return (
    <div>
      <ManageNewsroom channelID={channelID} />
    </div>
  );
};

export default ChannelAdminPage;
