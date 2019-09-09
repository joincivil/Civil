import * as React from "react";
import { Prompt } from "react-router";
import styled from "styled-components";
import {
  colors,
  mediaQueries,
  Button,
  buttonSizes,
  CurrencyInput,
  InputIcon,
  TextInput,
  TextareaInput,
  QuestionToolTip,
  defaultNewsroomImgUrl,
  LoadingMessage,
  HelmetHelper,
  LoadUser,
  withNewsroomChannel,
  NewsroomChannelInjectedProps,
} from "@joincivil/components";
import { Query, Mutation, MutationFunc } from "react-apollo";
import { boostNewsroomQuery, createBoostMutation, editBoostMutation } from "./queries";
import { BoostData, BoostNewsroomData } from "./types";
import {
  BoostWrapper,
  BoostWrapperFullWidthHr,
  BoostFormTitle,
  BoostDescriptionTable,
  BoostPayFormTitle,
  BoostSmallPrint,
  BoostImgDiv,
} from "./BoostStyledComponents";
import { BoostImg } from "./BoostImg";
import { urlConstants } from "../urlConstants";
import * as boostCardImage from "../../images/boost-card.png";
import { withBoostPermissions, BoostPermissionsInjectedProps } from "./BoostPermissionsHOC";

const PageWrapper = styled.div`
  color: ${colors.primary.CIVIL_GRAY_0};
  font-size: 14px;
  font-weight: normal;
  margin: auto;
  max-width: 880px;
  padding: 50px 20px 20px;

  p {
    margin-top: 15px;
  }

  input[disabled] {
    background: white;
    color: ${colors.primary.CIVIL_GRAY_2};
  }

  &:after {
    content: "";
    display: table;
    clear: both;
  }
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 900;
  line-height: 33px;
  margin-bottom: 15px;
`;
const Error = styled.span`
  color: red;
`;

const NewsroomDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  ${mediaQueries.MOBILE} {
    display: block;
  }
`;
const NewsroomDetailCell = styled.div`
  flex-grow: 1;
  margin-right: 24px;
  &:last-child {
    margin-right: 0;
  }
  ${mediaQueries.MOBILE} {
    margin-right: 0;
  }
`;

const ItemsTableWrapper = styled(BoostDescriptionTable)`
  table td {
    padding-top: 0;
    padding-bottom: 0;
    &:last-child {
      padding-right: 0;
    }
  }
  tfoot tr:first-child td {
    padding-top: 36px;
  }
`;
const ItemLink = styled.a`
  font-size: 16px;
  font-weight: 500;
`;
const ItemNameInput = styled(TextInput)`
  max-width: 420px;
`;
const ItemCostHeader = styled.th`
  && {
    padding-right: 0;
  }
`;
const ItemCostHeaderText = styled.div`
  margin-left: auto;
  text-align: left;
  width: 100px;
`;
const ItemCostCell = styled.td`
  text-align: right;
`;
const StyledCurrencyInput = styled(CurrencyInput)`
  position: relative;
  margin-left: auto;
  width: 100px;

  ${InputIcon as any} {
    top: 15px;
    left: 12px;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }
  input {
    padding-left: 22px;
  }
`;
const TotalGoal = styled(StyledCurrencyInput)`
  & input[disabled] {
    color: ${colors.primary.CIVIL_GRAY_0};
  }
`;
const ItemsAmountNote = styled.div`
  font-style: italic;
  margin-top: 15px;
  white-space: nowrap;
`;

const EndDateInput = styled.input`
  margin-right: 32px;
  padding: 10px;
`;
const EndDateNotice = styled.p`
  display: inline-block;
`;

const LaunchDisclaimer = styled(BoostSmallPrint)`
  display: inline-block;
  float: left;
`;
const LaunchButton = styled(Button)`
  height: 48px;
  float: right;
  text-transform: none;
  width: 190px;
`;

const ConnectStripeNotice = styled.div`
  background-color: rgb(208, 237, 237);
  display: block;
  font-size: 14px;
  margin: 30px 0 10px;
  padding: 20px;

  span {
    display: block;
    font-weight: 700;
    margin-bottom: 5px;
  }
`;

export interface BoostFormInnerProps {
  channelID: string;
  newsroomData: BoostNewsroomData;
  newsroomContractAddress: string;
  newsroomListingUrl: string;
  newsroomLogoUrl?: string;
  newsroomTagline?: string;
  initialBoostData?: BoostData;
  editMode?: boolean;
  boostId?: string;
}
export type BoostFormProps = BoostFormInnerProps & BoostPermissionsInjectedProps & NewsroomChannelInjectedProps;

export interface BoostFormState {
  boost: Partial<BoostData>;
  changesMade?: boolean;
  createdBoostId?: string;
  loading?: boolean;
  success?: boolean;
  error?: string;
}

class BoostFormComponent extends React.Component<BoostFormProps, BoostFormState> {
  constructor(props: BoostFormProps) {
    super(props);
    this.state = {
      boost: props.initialBoostData
        ? { ...props.initialBoostData }
        : {
            about: props.newsroomTagline,
            items: [{ item: "", cost: undefined }],
          },
    };
  }

  public async componentDidMount(): Promise<void> {
    // Set up boost permissions checks HOC:
    this.props.setNewsroomContractAddress(this.props.newsroomContractAddress);

    // If changes have been made, and boost create/update is not complete, show "are you sure you want to leave?" prompt. See also <Prompt> component with same check for react router below.
    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  }

  public componentWillUnmount(): void {
    // Remove "are you sure you want to leave?" prompt.
    window.removeEventListener("beforeunload", this.beforeUnloadHandler);
  }

  public render(): JSX.Element {
    return (
      <PageWrapper>
        <HelmetHelper
          title={"Create Boost - The Civil Registry"}
          description={
            "Connect with the Civil community eager to fund your projects. Boosts are mini-fundraisers that build community around your work. Your Newsroom can use Boosts to let your audience know about what you’d like to do and engage supporters in making the project a reality."
          }
          image={boostCardImage}
          meta={{
            "og:site_name": "Civil Registry",
            "og:type": "website",
            "twitter:card": "summary",
          }}
        />

        {this.renderHeader()}

        <LoadUser>
          {({ loading: userLoading, user }) => {
            if (!userLoading && !user) {
              return (
                <BoostWrapper>
                  {/*@TODO/auth Add redirect param when we one day implement that.*/}
                  You must <a href="/auth/login">login</a> to edit a Boost.
                </BoostWrapper>
              );
            }

            return (
              <Query query={boostNewsroomQuery} variables={{ addr: this.props.newsroomContractAddress }}>
                {({ loading, error, data }) => {
                  if (loading) {
                    return (
                      <BoostWrapper>
                        <LoadingMessage />
                      </BoostWrapper>
                    );
                  } else if (error || !data) {
                    console.error(
                      `error querying newsroom data for ${this.props.newsroomContractAddress}:`,
                      error,
                      data,
                    );
                    return (
                      <Error>
                        Error retrieving newsroom data: {error ? JSON.stringify(error) : "no listing data found"}
                      </Error>
                    );
                  }

                  if (!data.listing) {
                    return (
                      <BoostWrapper>
                        Your newsroom <b>{this.props.newsroomData.name}</b> has not yet applied to the Civil Registry.
                        Please <a href="/apply-to-registry">continue your newsroom application</a> and then, once you
                        have applied and your newsroom has been approved, you can return to create a Boost.
                      </BoostWrapper>
                    );
                  }

                  if (!data.listing.whitelisted) {
                    return (
                      <BoostWrapper>
                        Your newsroom <b>{this.props.newsroomData.name}</b> is not currently approved on the Civil
                        Registry. Please <a href="/dashboard/newsrooms">visit your newsroom dashboard</a> to check on
                        the status of your application. Once your newsroom is approved, you can return to create a
                        Boost.
                      </BoostWrapper>
                    );
                  }

                  return this.renderForm();
                }}
              </Query>
            );
          }}
        </LoadUser>
      </PageWrapper>
    );
  }

  private renderHeader(): JSX.Element {
    if (this.props.editMode) {
      return (
        <>
          <Title>Edit Boost</Title>
          <p>
            Note that after a boost has been launched, only text copy can be changed. Goal amounts and end date cannot
            be edited.
          </p>
        </>
      );
    }

    return (
      <>
        <Title>Let's get you started</Title>
        <p>
          Create and launch your Boost. Boosts will be displayed on the Boost directory in addition to your Registry
          listing.
        </p>
      </>
    );
  }

  private renderForm(): JSX.Element {
    return (
      <Mutation mutation={this.props.editMode ? editBoostMutation : createBoostMutation}>
        {mutation => {
          return (
            <form onSubmit={async event => this.handleSubmit(event, mutation)}>
              <Prompt
                when={!!this.beforeUnloadHandler()}
                message={"Are you sure you want to leave this page? Your Boost will not be saved."}
              />
              <BoostWrapper>
                <BoostImgDiv>
                  {this.props.newsroomLogoUrl ? (
                    <img
                      src={this.props.newsroomLogoUrl}
                      onError={e => {
                        (e.target as any).src = defaultNewsroomImgUrl;
                      }}
                    />
                  ) : (
                    <BoostImg charterUri={this.props.newsroomData.charter && this.props.newsroomData.charter.uri} />
                  )}
                </BoostImgDiv>
                <NewsroomDetailRow>
                  <NewsroomDetailCell>
                    <BoostFormTitle>
                      Newsroom Name
                      <QuestionToolTip explainerText="You can create a Boost for your newsroom only." />
                    </BoostFormTitle>
                    <TextInput name="newsroomName" value={this.props.newsroomData.name} disabled />
                  </NewsroomDetailCell>
                  <NewsroomDetailCell>
                    <BoostFormTitle>Newsroom URL</BoostFormTitle>
                    <TextInput name="newsroomUrl" value={this.props.newsroomData.url} disabled />
                  </NewsroomDetailCell>
                  <NewsroomDetailCell>
                    <BoostFormTitle>Registry Listing URL</BoostFormTitle>
                    <TextInput name="newsroomListingUrl" value={this.props.newsroomListingUrl} disabled />
                  </NewsroomDetailCell>
                </NewsroomDetailRow>
                <BoostFormTitle>
                  Newsroom Wallet
                  <QuestionToolTip explainerText="This is your newsroom wallet address where you will receive the funds from your Boost." />
                </BoostFormTitle>
                <TextInput name="newsroomWallet" value={this.props.newsroomData.owner} disabled />
                <p>
                  Funds from your Boost will be deposited into the Newsroom Wallet. A Newsroom Officer will be able to
                  widthdraw from the newsroom wallet and either deposit or exchange them into other currencies.{" "}
                  <a target="_blank" href={urlConstants.FAQ_BOOST_WITHDRAWL}>
                    Learn&nbsp;more
                  </a>
                </p>
                <BoostWrapperFullWidthHr />
                <BoostFormTitle>Give your Boost a title</BoostFormTitle>
                <p>
                  What do you need? Start with an action verb to tell people how they can help. For example: “Help
                  [newsroom] do [thing].”
                </p>
                <TextareaInput name="title" value={this.state.boost.title} onChange={this.onInputChange} />
                <BoostFormTitle>Describe your Boost</BoostFormTitle>
                <p>
                  What are you raising funds to do, and why you need help. Tell people why they should be excited to
                  support your Boost.
                </p>
                <TextareaInput name="why" value={this.state.boost.why} onChange={this.onInputChange} />
                <BoostFormTitle>Describe what the outcome will be</BoostFormTitle>
                <p>
                  Tell the community what to expect at the end of the fundraising time. You can be specific, but be
                  clear and brief.
                </p>
                <TextareaInput name="what" value={this.state.boost.what} onChange={this.onInputChange} />
                <BoostFormTitle>Describe your Newsroom</BoostFormTitle>
                <p>What is your Newsroom’s mission? Tell the community who you are.</p>
                <TextareaInput name="about" value={this.state.boost.about} onChange={this.onInputChange} />
                {this.renderItems()}
                <BoostFormTitle>
                  End date
                  <QuestionToolTip explainerText="All proceeds go directly to the Newsroom. There are small fees charged by the Ethereum network." />
                </BoostFormTitle>
                {this.renderEndDate()}
                <EndDateNotice>Your Boost will end at 11:59PM on the date selected.</EndDateNotice>
                {!this.props.channelData.isStripeConnected && (
                  <ConnectStripeNotice>
                    <span>No Stripe account connected</span> Your Boost will be able to accept contributions in ETH, but
                    if you connect a Stripe account you will also be able to accept credit card payments. If you'd like
                    to connect Stripe you can do so from{" "}
                    <a href="/dashboard/newsrooms" target="_blank">
                      your newsroom dashboard
                    </a>
                    . You will be prompted to create a new account if you don't have one already.
                  </ConnectStripeNotice>
                )}
              </BoostWrapper>

              <LaunchDisclaimer>
                By {this.props.editMode ? "using Boosts" : "creating a Boost"}, you agree to Civil’s{" "}
                <a href={urlConstants.TERMS}>Terms of Use</a> and{" "}
                <a href={urlConstants.PRIVACY_POLICY}>Privacy Policy</a>.
              </LaunchDisclaimer>
              <LaunchButton size={buttonSizes.MEDIUM} type="submit" disabled={this.state.loading || this.state.success}>
                {this.props.editMode ? "Update Boost" : "Launch Boost"}
              </LaunchButton>

              {/*@TODO/tobek Temporary feedback until we implement success modal*/}
              <div style={{ clear: "both", float: "right", marginTop: 10 }}>
                {this.state.loading && "loading..."}
                {this.state.error && <Error>{this.state.error}</Error>}
                {this.state.success && (
                  <>
                    Boost {this.props.editMode ? "updated" : "created"} successfully!{" "}
                    <a
                      href={"/boosts/" + (this.props.boostId || this.state.createdBoostId) + "?feature-flag=boosts-mvp"}
                    >
                      View boost.
                    </a>
                  </>
                )}
              </div>
            </form>
          );
        }}
      </Mutation>
    );
  }

  private renderEndDate(): JSX.Element {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    return (
      <EndDateInput
        type="date"
        name="dateEnd"
        min={date.toISOString().split("T")[0]}
        value={this.state.boost.dateEnd && this.state.boost.dateEnd.substr(0, 10)}
        onChange={this.onDateEndInputChange}
        disabled={this.props.editMode}
      />
    );
  }

  private renderItems(): JSX.Element {
    return (
      <ItemsTableWrapper>
        <BoostFormTitle>
          List the expenses this Boost can help cover
          <QuestionToolTip explainerText="Itemizing your costs helps educate your audience about the costs of journalism and running of your newsroom." />
        </BoostFormTitle>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <ItemCostHeader>
                <ItemCostHeaderText>Cost</ItemCostHeaderText>
              </ItemCostHeader>
              {!this.props.editMode && <th />}
            </tr>
          </thead>
          <tbody>
            {this.state.boost.items &&
              this.state.boost.items.map((item: any, i: number) => (
                <tr key={i}>
                  <td>
                    <ItemNameInput
                      name="item"
                      value={this.state.boost.items![i].item}
                      onChange={this.onItemInputChange.bind(this, i)}
                    />
                  </td>
                  <ItemCostCell>
                    <StyledCurrencyInput
                      icon={<>$</>}
                      name="cost"
                      type="number"
                      value={
                        typeof this.state.boost.items![i].cost === "undefined"
                          ? ""
                          : "" + this.state.boost.items![i].cost
                      }
                      onChange={this.onItemInputChange.bind(this, i)}
                      disabled={this.props.editMode}
                    />
                  </ItemCostCell>
                  {!this.props.editMode && (
                    <td>
                      {i > 0 && (
                        <ItemLink href="#" onClick={(e: any) => this.removeItem(e, i)}>
                          x
                        </ItemLink>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            {!this.props.editMode && (
              <tr>
                <td>
                  <ItemLink href="#" onClick={this.addItem}>
                    Add item
                  </ItemLink>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <BoostFormTitle>Boost Goal</BoostFormTitle>
                <p>
                  Your Boost goal is the amount you would like to raise. If your Boost does not reach its amount goal by
                  the end date, the proceeds sent by supporters will still be collected into your Newsroom’s wallet.
                  Once the Boost ends, you’ll be able to withdraw and either dispense or exchange the funds to your
                  wallet, or exchange to another currency.
                </p>
              </td>
              <ItemCostCell>
                <BoostPayFormTitle>Total amount</BoostPayFormTitle>
                <TotalGoal icon={<>$</>} name="goalAmount" value={"" + (this.state.boost.goalAmount || "")} disabled />
                <ItemsAmountNote>
                  Proceeds will be in ETH
                  <QuestionToolTip explainerText="We recommend periods between 14 and 60 days." />
                </ItemsAmountNote>
                <ItemsAmountNote>Civil does not collect any fees.</ItemsAmountNote>
              </ItemCostCell>
              {!this.props.editMode && <td />}
            </tr>
          </tfoot>
        </table>
      </ItemsTableWrapper>
    );
  }

  private onInputChange = (name: string, val: string) => {
    this.setState({
      boost: {
        ...this.state.boost,
        [name]: val,
      },
      changesMade: true,
    });
  };

  private onDateEndInputChange = (event: any) => {
    event.preventDefault();
    this.setState({
      boost: {
        ...this.state.boost,
        dateEnd: new Date(event.target.value).toISOString(),
      },
    });
  };

  private onItemInputChange = (i: number, name: "cost" | "item", val: string) => {
    const items = this.state.boost.items!;

    let goalAmount = this.state.boost.goalAmount || 0;
    if (name === "cost") {
      const oldCost = items[i][name] || 0;
      const newCost = parseFloat(val || "0");
      items[i][name] = newCost;
      goalAmount = goalAmount - oldCost + newCost;
    } else {
      items[i][name] = val;
    }

    this.setState({
      boost: {
        ...this.state.boost,
        goalAmount,
        items,
      },
      changesMade: true,
    });
  };

  private addItem = (event: React.MouseEvent) => {
    event.preventDefault();
    this.setState({
      boost: {
        ...this.state.boost,
        items: this.state.boost.items!.concat({} as any),
      },
    });
  };

  private removeItem = (event: React.MouseEvent, i: number) => {
    event.preventDefault();
    this.setState({
      boost: {
        ...this.state.boost,
        goalAmount: (this.state.boost.goalAmount || 0) - (this.state.boost.items![i].cost || 0),
        items: this.state.boost.items!.slice(0, i).concat(this.state.boost.items!.slice(i + 1)),
      },
    });
  };

  private async handleSubmit(event: React.FormEvent, mutation: MutationFunc): Promise<void> {
    event.preventDefault();
    // @TODO/toby Implement success modal from designs.

    const boost = this.state.boost;
    this.setState({ loading: true, error: undefined });
    try {
      const response = await mutation({
        variables: {
          input: {
            channelID: this.props.channelID,
            currencyCode: "usd", // @TODO/tobek Is this right? Why is it required, should endpoint default to usd?
            title: boost.title,
            why: boost.why,
            what: boost.what,
            about: boost.about,
            goalAmount: boost.goalAmount,
            items: boost.items,
            dateEnd: boost.dateEnd,
          },
          postID: this.props.editMode && this.props.boostId,
        },
      });
      if (response && response.data && response.data.postsCreateBoost) {
        this.setState({
          success: true,
          createdBoostId: response.data.postsCreateBoost.id,
        });
      } else if (response && response.data && response.data.postsUpdateBoost) {
        this.setState({
          success: true,
        });
      } else {
        this.setState({ error: "Error: Unexpected or missing response data" });
      }
    } catch (error) {
      this.setState({ error: error.toString() });
    }

    this.setState({ loading: false });
  }

  private beforeUnloadHandler = (event?: BeforeUnloadEvent): boolean | undefined => {
    if (this.state.changesMade && !this.state.success) {
      if (event) {
        event.preventDefault(); // specification
        event.returnValue = ""; // some Chrome
      }
      return true; // what most browsers actually use
    }
  };
}

export const BoostForm = withBoostPermissions(withNewsroomChannel(BoostFormComponent), true);
