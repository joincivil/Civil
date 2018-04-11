import * as React from "react";
import { Menu, Header, Divider, Message } from "semantic-ui-react";
import Methods from "./methods";
import Source from "./source";
import Abi from "./abi";
import Bytecode from "./bytecode";
import ShortAddressLink from "./shortAddressLink";

const tabs = [
  {
    text: "Methods",
    available(contract: any): boolean {
      return contract.abiDocs && contract.abiDocs.length > 0;
    },
    component(contract: any): JSX.Element {
      return <Methods contract={contract} />;
    },
  },
  {
    text: "ABI",
    available(contract: any): boolean {
      return contract.abi && contract.abi.length > 0;
    },
    component(contract: any): JSX.Element {
      return <Abi contract={contract} />;
    },
  },
  {
    text: "Bytecode",
    available(contract: any): boolean {
      return contract.opcodes || contract.bytecode;
    },
    component(contract: any): JSX.Element {
      return <Bytecode contract={contract} />;
    },
  },
  {
    text: "Source Code",
    available(contract: any): boolean {
      return contract.source;
    },
    component(contract: any): JSX.Element {
      return <Source contract={contract} />;
    },
  },
];

export interface ContractState {
  tab: any;
}
export interface ContractProps {
  contract: any;
}

export default class Contract extends React.Component<ContractProps, ContractState> {
  constructor(props: ContractProps) {
    super(props);
    this.state = { tab: 0 };
    this.renderTab = this.renderTab.bind(this);
    this.renderTabMenu = this.renderTabMenu.bind(this);
  }
  public handleTabClick(tab: any): void {
    this.setState({ tab });
  }
  public renderTabMenu(): JSX.Element {
    const { contract } = this.props;
    const tabsReady = tabs.map(tab => ({ ...tab, available: tab.available(contract) }));
    return (
      <Menu pointing secondary>
        {tabsReady.map((tab, i) => this.renderTab(tab, i))}
      </Menu>
    );
  }
  public renderTab(tab: any, i: any): JSX.Element {
    return <Menu.Item key={i} name={tab.text} active={this.state.tab === i} onClick={() => this.handleTabClick(i)} />;
  }
  public renderTabContent(): JSX.Element {
    const { contract } = this.props;
    return tabs[this.state.tab].component(contract);
  }
  public render(): JSX.Element {
    const { contract } = this.props;
    const thisTab = tabs[this.state.tab];
    const thisTabAvailable = thisTab.available(contract);
    return (
      <div className="contract">
        <Divider hidden style={{ clear: "both" }} />
        <Header as="h2" floated="left">
          {contract.title || contract.name}
          {contract.fileName && (
            <Header.Subheader>
              {contract.fileName}
              {contract.address && (
                <div>
                  <small>
                    <ShortAddressLink address={contract.address} />
                  </small>
                </div>
              )}
            </Header.Subheader>
          )}
        </Header>
        {contract.author && (
          <Header as="h3" disabled textAlign="right" floated="right">
            {contract.author}
          </Header>
        )}
        <Divider hidden style={{ clear: "both" }} />
        {this.renderTabMenu()}
        {thisTabAvailable ? (
          this.renderTabContent()
        ) : (
          <Message compact content={`${thisTab.text} not available for this contract.`} />
        )}
      </div>
    );
  }
}
