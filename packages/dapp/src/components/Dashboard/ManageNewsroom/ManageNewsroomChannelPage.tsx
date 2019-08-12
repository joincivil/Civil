import * as React from "react";
import styled from "styled-components";
import { ManageNewsroom } from "./ManageNewsroom";

const ManageNewsroomChannelPage = (props: any) => {
  const newsroomAddress = props.match.params.newsroomAddress;
  return (
    <div>
      <ManageNewsroom newsroomAddress={newsroomAddress} />
    </div>
  );
};

export default ManageNewsroomChannelPage;
