import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CivilContext, ICivilContext, LoadingMessage } from "@joincivil/components";
import { NewsroomInstance } from "@joincivil/core";
import { EthAddress, CharterData } from "@joincivil/typescript-types";
import styled from "styled-components";
import { AddMembersToContract } from "../SmartContract/AddMembersToContract";
import { updateNewsroom, fetchNewsroom, getEditors } from "../actionCreators";
import { StateWithNewsroom } from "../reducers";

const Wrapper = styled.div`
  margin: auto;
  max-width: 880px;
`;

export interface ManageContractMembersProps {
  charter: Partial<CharterData>;
  /** @NOTE: Make sure to use the newsroom instance `newsroom.address`, which is mixed case, because everything in newsroom-signup depends on that. This is used just to instantiate the contract. */
  newsroomAddress: EthAddress;
}

export const ManageContractMembers: React.FunctionComponent<ManageContractMembersProps> = props => {
  const dispatch = useDispatch();
  const context = React.useContext<ICivilContext>(CivilContext);
  const [newsroom, setNewsroom] = React.useState<NewsroomInstance | undefined>();

  React.useEffect(() => {
    if (!context.civil) {
      return;
    }
    context.civil.newsroomAtUntrusted(props.newsroomAddress).then(setNewsroom);
  }, [context.civil]);

  const reduxCharter = useSelector((state: StateWithNewsroom) => {
    if (!newsroom) {
      return undefined;
    }
    const newsroomState = state.newsrooms.get(newsroom.address);
    return newsroomState && newsroomState.charter;
  });
  const owners = useSelector((state: StateWithNewsroom) => {
    if (!newsroom) {
      return undefined;
    }
    const newsroomState = state.newsrooms.get(newsroom.address);
    return newsroomState && newsroomState.wrapper && newsroomState.wrapper.data && newsroomState.wrapper.data.owners;
  });

  // Hydrate redux store if it hasn't been already:
  React.useEffect(() => {
    if (!newsroom) {
      return;
    }
    if (!reduxCharter) {
      dispatch(updateNewsroom(newsroom.address, { newsroom, charter: props.charter }));
    }
    dispatch(fetchNewsroom(newsroom.address));
  }, [reduxCharter, newsroom, dispatch]);
  React.useEffect(() => {
    if (!newsroom || !context.civil) {
      return;
    }
    dispatch(getEditors(newsroom.address, context.civil));
  }, [newsroom, dispatch, context.civil]);

  if (!newsroom) {
    return <LoadingMessage>Loading Newsroom</LoadingMessage>;
  }

  if (!owners) {
    return <LoadingMessage>Loading Users</LoadingMessage>;
  }

  return (
    <Wrapper>
      <AddMembersToContract
        charter={reduxCharter || props.charter}
        newsroom={newsroom}
        profileWalletAddress={context.currentUser.ethAddress}
        updateCharter={() => {}}
        managerMode={true}
      />
    </Wrapper>
  );
};
