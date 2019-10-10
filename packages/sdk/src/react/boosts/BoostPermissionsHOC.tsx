import * as React from "react";
import { EthAddress, NewsroomInstance } from "@joincivil/core";
import { LoadingMessage, CivilContext, ICivilContext } from "@joincivil/components";
import { BoostWrapper } from "./BoostStyledComponents";

export interface BoostPermissionsOuterProps {
  disableOwnerCheck?: boolean;
  editMode?: boolean;
}

export interface BoostPermissionsInjectedProps {
  boostOwner?: boolean;
  walletConnected?: boolean;
  newsroom?: NewsroomInstance;
  setNewsroomContractAddress(address: EthAddress): void;
}

export interface BoostPermissionsState {
  waitingForEthEnable?: boolean;
  boostOwner?: boolean;
  walletConnected?: boolean;
  checkingIfOwner?: boolean;
  userEthAddress?: EthAddress;
  newsroomOwners?: EthAddress[];
  newsroom?: NewsroomInstance;
  newsroomContractAddress?: EthAddress;
}

/** Usage: Wrap component with this HOC and make sure to call the injected prop `setNewsroomContractAddress` with the newsroom address once that is loaded. */
export const withBoostPermissions = <TProps extends BoostPermissionsInjectedProps>(
  WrappedComponent: React.ComponentType<TProps>,
  requirePermissions?: boolean,
) => {
  type TOriginalProps = Omit<TProps, keyof BoostPermissionsInjectedProps>;
  return class ComponentWithBoostPermissions extends React.Component<
    BoostPermissionsOuterProps & TOriginalProps,
    BoostPermissionsState
  > {
    public static contextType = CivilContext;
    public context!: ICivilContext;

    constructor(props: BoostPermissionsOuterProps & TOriginalProps) {
      super(props);
      this.state = {
        checkingIfOwner: true,
      };
    }

    public async componentDidMount(): Promise<void> {
      // @TODO/loginV2 migrate away from window.ethereum
      if ((window as any).ethereum) {
        this.setState({
          waitingForEthEnable: true,
        });
        await (window as any).ethereum.enable();
        this.setState({
          waitingForEthEnable: false,
        });
        await this.getUserEthAddress();
      } else {
        this.setState({
          checkingIfOwner: false,
        });
      }
    }

    public async componentDidUpdate(
      prevProps: BoostPermissionsOuterProps,
      prevState: BoostPermissionsState,
    ): Promise<void> {
      if (
        prevState.userEthAddress !== this.state.userEthAddress ||
        prevState.newsroomContractAddress !== this.state.newsroomContractAddress
      ) {
        await this.checkIfBoostOwner();
      }
    }

    public render(): JSX.Element {
      // If editMode/requirePermissions then entire view depends on if user is owner, so block everything and show loading or permissions messages:
      if ((this.props.editMode || requirePermissions) && this.state.newsroomContractAddress) {
        if (this.state.waitingForEthEnable) {
          return this.renderNotConnected();
        }

        if (this.state.checkingIfOwner) {
          return this.renderLoading();
        }

        if (!this.state.boostOwner) {
          if (!this.state.userEthAddress) {
            return this.renderNotConnected();
          }
          return this.renderNotOnContract();
        }
      }

      return (
        <WrappedComponent
          {...(this.props as TProps)}
          boostOwner={this.state.boostOwner}
          walletConnected={this.state.walletConnected}
          newsroom={this.state.newsroom}
          setNewsroomContractAddress={this.setNewsroomContractAddress}
        />
      );
    }

    public renderLoading(): JSX.Element {
      return (
        <BoostWrapper open={true}>
          <LoadingMessage>Loading Permissions</LoadingMessage>
        </BoostWrapper>
      );
    }

    public renderNotConnected(): JSX.Element {
      return (
        <BoostWrapper open={true}>
          <p>
            Please connect your Ethereum account via a browser wallet such as MetaMask so that we can verify your
            ability to create and edit Boosts for this newsroom.
          </p>
        </BoostWrapper>
      );
    }

    public renderNotOnContract(): JSX.Element {
      return (
        <BoostWrapper open={true}>
          <p>
            Your ETH address <code>{this.state.userEthAddress}</code> doesn't have permissions to create and edit Boosts
            for this newsroom, which is owned by the following address(es):
          </p>
          {this.state.newsroomOwners && (
            <ul>
              {this.state.newsroomOwners.map(owner => (
                <li key={owner}>
                  <code>{owner}</code>
                </li>
              ))}
            </ul>
          )}
          <p>
            If you own one of these wallets, please switch to it. Otherwise, please request that one of these officers
            add you to the newsroom contract.
          </p>
          <p>
            <a href={`${document.location.origin}/listing/${this.state.newsroomContractAddress}`}>
              View newsroom information.
            </a>
          </p>
        </BoostWrapper>
      );
    }

    public async getUserEthAddress(): Promise<void> {
      if (this.props.disableOwnerCheck) {
        return;
      }

      let user;
      if (this.context.civil) {
        user = await this.context.civil.accountStream.first().toPromise();

        if (user) {
          this.setState({
            walletConnected: true,
            userEthAddress: user,
          });
        } else {
          this.setState({
            walletConnected: true,
          });
        }
      }

      if (!user) {
        this.setState({
          checkingIfOwner: false,
          boostOwner: false,
        });
      }
    }

    public async checkIfBoostOwner(): Promise<void> {
      if (this.props.disableOwnerCheck) {
        return;
      }

      if (this.state.userEthAddress && this.state.newsroomContractAddress && this.context.civil) {
        const newsroom = await this.context.civil.newsroomAtUntrusted(this.state.newsroomContractAddress);
        const newsroomOwners = (await newsroom.getNewsroomData()).owners.map(owner => owner.toLowerCase());

        this.setState({
          checkingIfOwner: false,
          boostOwner: newsroomOwners && newsroomOwners.indexOf(this.state.userEthAddress.toLowerCase()) !== -1,
          newsroomOwners,
          newsroom,
        });
      }
    }

    public setNewsroomContractAddress = (newsroomContractAddress: EthAddress) => {
      // @HACK/tobek: This gets called from `render()` function of wrapped component because we pick it up from apollo `<Query>` component. Bad form to call setState from render (putting in setImmediate to remove React warning) but the conditional prevents an infinite loop, and the only alternative is to use `withApollo` and get apollo client as prop and call this query on `componentDidMount` in wrapped component or something, which is an annoying refactor right now.
      if (this.state.newsroomContractAddress !== newsroomContractAddress) {
        setImmediate(() => {
          this.setState({
            newsroomContractAddress,
          });
        });
      }
    };
  };
};
