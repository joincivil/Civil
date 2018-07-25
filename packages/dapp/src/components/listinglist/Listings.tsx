import * as React from "react";
import { Set } from "immutable";
import { Tabs, Tab, TabComponentProps, colors, fonts } from "@joincivil/components";
import styled from "styled-components";

import ListingList from "./ListingList";
import { connect } from "react-redux";
import { State } from "../../reducers";
import ListingsInProgress from "./ListingsInProgress";
import MyActivity from "./MyActivity";

const StyledTabNav = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  height: 76px;
  margin: 0 auto 50px;
  width: 100%;
  & > ul {
    justify-content: center;
  }
`;

const StyledTab = styled.li`
  border-bottom: ${(props: TabComponentProps) =>
    props.isActive ? "8px solid " + colors.accent.CIVIL_BLUE : "8px solid transparent"};
  color: ${(props: TabComponentProps) => (props.isActive ? colors.accent.CIVIL_BLUE : colors.accent.CIVIL_GRAY_2)};
  cursor: pointer;
  font-family: ${fonts.SANS_SERIF};
  font-size: 19px;
  font-weight: 800;
  margin: 39px 40px 0 0;
  padding: 0 0 10px;
  &:last-of-type {
    margin: 39px 0 0 0;
  }
  &:hover {
    border-bottom: ${(props: TabComponentProps) =>
      props.isActive ? "8px solid " + colors.accent.CIVIL_BLUE : "8px solid " + colors.accent.CIVIL_GRAY_2};
  }
`;

export interface ListingProps {
  whitelistedListings: Set<string>;
  rejectedListings: Set<string>;
  currentUserNewsrooms: Set<string>;
  error: undefined | string;
}

class Listings extends React.Component<ListingProps> {
  public render(): JSX.Element {
    return (
      <Tabs TabsNavComponent={StyledTabNav} TabComponent={StyledTab}>
        <Tab title={"Whitelisted Newsrooms"}>
          <ListingList listings={this.props.whitelistedListings} />
        </Tab>
        <Tab title={"Newsrooms Under Consideration"}>
          <ListingsInProgress />
        </Tab>
        <Tab title={"Rejected Newsrooms"}>
          <ListingList listings={this.props.rejectedListings} />
        </Tab>
        <Tab title={"My Activity"}>
          <MyActivity />
        </Tab>
      </Tabs>
    );
  }
}

const mapStateToProps = (state: State): ListingProps => {
  const { whitelistedListings, rejectedListings, currentUserNewsrooms } = state.networkDependent;

  return {
    whitelistedListings,
    rejectedListings,
    currentUserNewsrooms,
    error: undefined,
  };
};

export default connect(mapStateToProps)(Listings);
