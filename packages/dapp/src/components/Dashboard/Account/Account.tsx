import * as React from "react";
import { Helmet } from "react-helmet";
import { formatRoute } from "react-router-named-routes";
import ScrollToTopOnMount from "../../utility/ScrollToTop";
import { Tabs, Tab } from "@joincivil/components";
import { AccountProfile } from "./AccountProfile";
import { AccountPayments } from "./AccountPayments";
import { AccountHeader, AccountWrap, AccountTabNav, AccountTabs } from "./AccountStyledComponents";
import { AccountTitleText, ProfileTabText, PaymentTabText } from "./AccountTextComponents";

export interface AccountParams {
  activeTab?: "profile" | "payments";
}
const TABS = ["profile", "payments"];

export interface AccountProps {
  userAccount?: string;
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
        <AccountTitleText />
      </AccountHeader>
      <AccountWrap>
        <Tabs
          TabsNavComponent={AccountTabNav}
          TabComponent={AccountTabs}
          activeIndex={activeTabIndex}
          onActiveTabChange={(tab: number) => {
            props.history.push(formatRoute(props.match.path, { activeTab: TABS[tab] }));
          }}
          flex={true}
        >
          <Tab title={<ProfileTabText />}>
            <AccountProfile />
          </Tab>
          <Tab title={<PaymentTabText />}>
            <AccountPayments />
          </Tab>
        </Tabs>
      </AccountWrap>
    </>
  );
};

export default AccountPage;
