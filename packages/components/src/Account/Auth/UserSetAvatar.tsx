import * as React from "react";
import gql from "graphql-tag";
import { Mutation, MutationFn, ApolloConsumer } from "react-apollo";
import { Button, buttonSizes } from "../../Button";
import { ConfirmButtonContainer, SkipForNowButtonContainer } from "./AuthStyledComponents";
import AvatarEditor from "react-avatar-editor";
import styled from "styled-components";
import { AvatarDragAndDrop } from "./AvatarDragAndDrop";
import ApolloClient from "apollo-client";
import { fonts } from "../../styleConstants";
import Slider from "react-input-slider";

const setAvatarMutation = gql`
  mutation($input: ChannelsSetAvatarInput!) {
    channelsSetAvatar(input: $input) {
      id
    }
  }
`;

const skipSetAvatarMutation = gql`
  mutation {
    skipUserChannelAvatarPrompt {
      uid
    }
  }
`;

const AvatarEditorDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const CropSpan = styled.span``;

const AvatarEditorContainerDiv = styled.div`
  height: 500px;
`;

const ZoomContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SkipButton = styled.span`
  color: #2b56ff;
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  font-weight: 700;
  line-height: 16px;
  width: 158px;
  text-align: center;
`;

export interface UserSetAvatarAuthProps {
  headerComponent?: JSX.Element;
  channelID: string;
  onSetAvatarComplete?(): void;
}

export interface UserSetAvatarAuthState {
  avatarDataURL: string;
  errorMessage: string | undefined;
  scale: number;
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
      scale: 1.2,
    };
    this.editor = null;
  }

  public render(): JSX.Element {
    const { headerComponent, channelID } = this.props;

    return (
      <>
        {headerComponent}
        <Mutation<any> mutation={setAvatarMutation}>
          {setAvatar => {
            return (
              <form onSubmit={async event => this.handleSubmit(event, setAvatar, channelID)}>
                {this.renderAvatarSelector()}
                <ConfirmButtonContainer>
                  {this.state.image &&
                  <Button size={buttonSizes.SMALL_WIDE} textTransform={"none"} type={"submit"}>
                    Save
                  </Button>
                  }
                </ConfirmButtonContainer>
              </form>
            );
          }}
        </Mutation>

        { !this.state.image &&
          <SkipForNowButtonContainer>
            <ApolloConsumer>
              {client => <SkipButton onClick={() => this.onSkipForNowClicked(client)}>Skip for now</SkipButton>}
            </ApolloConsumer>
          </SkipForNowButtonContainer>
        }
      </>
    );
  }

  public handleNewImage = (e: any) => {
    this.setState({ image: e });
  };

  private async onSkipForNowClicked(client: ApolloClient<any>): Promise<void> {
    const { error } = await client.mutate({
      mutation: skipSetAvatarMutation,
    });

    if (error) {
      this.setState({ errorMessage: error });
    } else {
      if (this.props.onSetAvatarComplete) {
        this.props.onSetAvatarComplete();
      }
    }
  }

  private renderAvatarSelector(): JSX.Element {
    return (
      <AvatarEditorContainerDiv>
        { this.state.image &&
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
              scale={this.state.scale}
              rotate={0}
            />
            <CropSpan>Crop your photo</CropSpan>
            <ZoomContainer>
            <Slider axis="x" xmin={100} xmax={400} x={(this.state.scale * 100)} onChange={(xy: any) => {
              console.log("onChange. x: ", (xy.x) / 100);
              this.setState({ scale: (xy.x / 100)})}
              } />
          </ZoomContainer>
          </AvatarEditorDiv>
        }
        { !this.state.image &&
          <AvatarEditorDiv>
          <AvatarDragAndDrop onChange={this.handleNewImage} />
        </AvatarEditorDiv>
        }
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
