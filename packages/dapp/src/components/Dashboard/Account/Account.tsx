import * as React from "react";
import { Helmet } from "react-helmet";
import { formatRoute } from "react-router-named-routes";
import ScrollToTopOnMount from "../../utility/ScrollToTop";
import styled from "styled-components/macro";
import { Tabs, StyledTabLarge, StyledTabNav, Tab, colors, mediaQueries, } from "@joincivil/components";
import { AccountProfile } from "./AccountProfile";
import { AccountPayments } from "./AccountPayments";

export const AccountHeader = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin: 100px auto 50px;
  max-width: 800px;

  h1 {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 32px;
    font-weight: bold;
    height: 40px;
    letter-spacing: -0.23px;
    margin: 0 0 10px;

    ${mediaQueries.MOBILE} {
      color: ${colors.primary.BLACK};
      font-size: 24px;
      line-height: 30px;
    }
  }
`;

export interface AccountParams {
  activeTab?: "profile" | "payments";
}
const TABS = ["profile", "payments"];

export interface AccountProps {
  history: any;
  match: any;
}

const AccountPage: React.FunctionComponent<AccountProps> = props => {
  // Load tab from path:
  const [activeTabIndex, setActiveTabIndex] = React.useState<number>(0);
  React.useEffect(() => {
    const activeTab = props.match.params.activeTab || "profile";
    if (TABS[activeTabIndex] !== activeTab) {
      setActiveTabIndex(TABS.indexOf(activeTab));
    }
  }, [props.match.params.activeTab]);

  return (
    <>
      <Helmet title="Account - The Civil Registry" />
      <ScrollToTopOnMount />
      <AccountHeader>
        <h1>Settings</h1>
      </AccountHeader>
      <Tabs
        TabsNavComponent={StyledTabNav}
        TabComponent={StyledTabLarge}
        activeIndex={activeTabIndex}
        onActiveTabChange={(tab: number) => {
          props.history.push(formatRoute(props.match.path, { activeTab: TABS[tab] }));
        }}
      >
        <Tab title={"Profile"}>
          <AccountProfile />
        </Tab>
        <Tab title={"Payment methods"}>
          <AccountPayments />
        </Tab>
      </Tabs>
    </>
  );
};

export default AccountPage;
