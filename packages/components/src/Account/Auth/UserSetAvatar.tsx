import * as React from "react";
import gql from "graphql-tag";
import { Mutation, MutationFn } from "react-apollo";
import { Button, buttonSizes } from "../../Button";
import { ConfirmButtonContainer } from "./AuthStyledComponents";
import AvatarEditor from "react-avatar-editor";
import styled from "styled-components";

const setAvatarMutation = gql`
  mutation($input: ChannelsSetAvatarInput!) {
    channelsSetAvatar(input: $input) {
      id
    }
  }
`;

const AvatarEditorDiv = styled.div`
  display: flex;
  justify-content: space-around;
`;

const AvatarEditorContainerDiv = styled.div``;

export interface UserSetAvatarAuthProps {
  headerComponent?: JSX.Element;
  channelID: string;
  onSetAvatarComplete?(): void;
}

export interface UserSetAvatarAuthState {
  avatarDataURL: string;
  errorMessage: string | undefined;
  image?: any;
  preview?: PreviewImageState;
}

export interface PreviewImageState {
  image: string;
  rect: any;
  scale: number;
  width: number;
  height: number;
  borderRadius: number;
}

export class UserSetAvatar extends React.Component<UserSetAvatarAuthProps, UserSetAvatarAuthState> {
  public editor: AvatarEditor | null;
  constructor(props: UserSetAvatarAuthProps) {
    super(props);
    this.state = {
      avatarDataURL: "",
      errorMessage: undefined,
    };
    this.editor = null;
  }

  public render(): JSX.Element {
    const { headerComponent, channelID } = this.props;

    return (
      <>
        {headerComponent}
        <Mutation mutation={setAvatarMutation}>
          {setAvatar => {
            return (
              <form onSubmit={async event => this.handleSubmit(event, setAvatar, channelID)}>
                {this.renderAvatarSelector()}
                <ConfirmButtonContainer>
                  <Button size={buttonSizes.SMALL_WIDE} textTransform={"none"} type={"submit"}>
                    Confirm
                  </Button>
                </ConfirmButtonContainer>
              </form>
            );
          }}
        </Mutation>
      </>
    );
  }

  public handleNewImage = (e: any) => {
    this.setState({ image: e.target.files[0] });
  };

  private renderAvatarSelector(): JSX.Element {
    return (
      <AvatarEditorContainerDiv>
        <AvatarEditorDiv>
          <AvatarEditor
            ref={(el: any) => {
              this.editor = el;
            }}
            image={this.state.image ? this.state.image : ""}
            width={336}
            height={336}
            border={0}
            borderRadius={168}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1.2}
            rotate={0}
          />
        </AvatarEditorDiv>
        <br />
        New File:
        <input name="newImage" type="file" onChange={this.handleNewImage} />
        <br />
      </AvatarEditorContainerDiv>
    );
  }

  private async handleSubmit(event: React.FormEvent, mutation: MutationFn, channelID: string): Promise<void> {
    event.preventDefault();

    this.setState({ errorMessage: undefined });

    const avatarDataURL = this.editor!.getImageScaledToCanvas().toDataURL();

    try {
      const res: any = await mutation({
        variables: {
          input: { channelID, avatarDataURL },
        },
      });

      if (res.data && res.data.channelsSetAvatar && res.data.channelsSetAvatar.id === channelID) {
        if (this.props.onSetAvatarComplete) {
          this.props.onSetAvatarComplete();
        }
      }
      if (res.error) {
        console.log("res.error: ", res.error);
      }

      return;
    } catch (err) {
      const errorMessage = "Unknown Error when setting avatar. Please contact support@civil.co if problem persists.";

      this.setState({ errorMessage });
    }
  }
}
