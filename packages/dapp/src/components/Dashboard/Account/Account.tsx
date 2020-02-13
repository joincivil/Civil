import * as React from "react";
import { Helmet } from "react-helmet";
import { formatRoute } from "react-router-named-routes";
import ScrollToTopOnMount from "../../utility/ScrollToTop";
import { Tabs, Tab } from "@joincivil/components";
import { AccountProfile } from "./AccountProfile";
import { AccountPayments } from "./AccountPayments";
import { AccountTransactions } from "./AccountTransactions";
import { AccountTitleText, ProfileTabText, PaymentTabText, TransactionsTabText } from "./AccountTextComponents";
import { UserManagementPageLayout, UserManagementTabNav, UserManagementTabs } from "../UserManagement";

export interface AccountParams {
  activeTab?: "profile" | "payments" | "transactions";
}
const TABS = ["profile", "payments", "transactions"];

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
      <UserManagementPageLayout header={<AccountTitleText />}>
        <Tabs
          TabsNavComponent={UserManagementTabNav}
          TabComponent={UserManagementTabs}
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
          <Tab title={<TransactionsTabText />}>
            <AccountTransactions />
          </Tab>
        </Tabs>
      </UserManagementPageLayout>
    </>
  );
};

export default AccountPage;
