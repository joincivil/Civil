import * as React from "react";
import { SubmitLink } from "../input";
import gql from "graphql-tag";
import { Mutation, MutationFunc } from "react-apollo";

const EXTERNAL_LINK_MUTATION = gql`
  mutation($input: PostCreateExternalLinkInput!) {
    postsCreateExternalLink(input: $input) {
      url
      channelID
    }
  }
`;

export interface DashboardNewsroomSubmitLinkProps {
  channelID: string;
}

export interface DashboardNewsroomSubmitLinkState {
  url: string;
  submitting: boolean;
  success: boolean;
  error: boolean;
}

export class DashboardNewsroomSubmitLink extends React.Component<
  DashboardNewsroomSubmitLinkProps,
  DashboardNewsroomSubmitLinkState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      url: "",
      submitting: false,
      success: false,
      error: false,
    };
  }

  public render(): JSX.Element {
    return (
      <Mutation<any> mutation={EXTERNAL_LINK_MUTATION}>
        {mutation => {
          return (
            <SubmitLink
              name={"storyfeed submit link"}
              submitting={this.state.submitting}
              success={this.state.success}
              error={this.state.error}
              onChange={this.setURL}
              onSubmit={async () => this.handleSubmit(mutation)}
            />
          );
        }}
      </Mutation>
    );
  }

  private setURL = (name: string, value: string) => {
    this.setState({ url: value });
  };

  private async handleSubmit(mutation: MutationFunc): Promise<void> {
    this.setState({ submitting: true, error: false, success: false });
    try {
      const response = await mutation({
        variables: {
          input: {
            channelID: this.props.channelID,
            url: this.state.url,
          },
        },
      });
      if (response && response.data && response.data.postsCreateExternalLink) {
        this.setState({ success: true });
      } else {
        this.setState({ error: true });
      }
    } catch (error) {
      console.log(error);
      this.setState({ error: true });
    }

    this.setState({ submitting: false });
  }
}
