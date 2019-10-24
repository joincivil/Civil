import * as React from "react";
import gql from "graphql-tag";
import { Mutation, MutationFn, ApolloConsumer } from "react-apollo";
import { Button, InvertedButton, buttonSizes } from "../../Button";
import { SkipForNowButtonContainer } from "./AuthStyledComponents";
import AvatarEditor from "react-avatar-editor";
import styled from "styled-components";
import ApolloClient from "apollo-client";
import { fonts, mediaQueries } from "../../styleConstants";
import Slider from "react-input-slider";
import { colors, ZoomInIcon, ZoomOutIcon } from "@joincivil/elements";
import { ClipLoader } from "../../ClipLoader";
import { SimpleImageFileToDataUri } from "../../input";

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

const UserSetAvatarContainer = styled.div`
  width: 400px;
  ${mediaQueries.MOBILE} {
    width: 280px;
  }
`;

const AvatarEditorDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const CropSpan = styled.span`
  margin-top: 15px;
  color: #676767;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.16px;
  line-height: 17px;
`;

const AvatarEditorContainerDiv = styled.div`
  margin-bottom: 25px;
`;

const AvatarEditorInnerDiv = styled.div`
  margin-top: 15px;
`;

const ZoomContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 336px;
  ${mediaQueries.MOBILE} {
    width: 200px;
  }
  margin-top: 10px;
`;

const ZoomSliderContainer = styled.div``;
const ZoomIconContainer = styled.div``;

const SaveButtonContainer = styled.div`
  margin-left: 10px;
`;

const SkipAndSaveButtonsContainer = styled.div`
  width: 400px;
  ${mediaQueries.MOBILE} {
    width: 280px;
  }
  display: flex;
  justify-content: flex-end;
`;

const SkipButton = styled.span`
  cursor: pointer;
  color: #2b56ff;
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  font-weight: 700;
  line-height: 16px;
  width: 158px;
  text-align: center;
`;

export interface UserSetAvatarProps {
  headerComponent?: JSX.Element;
  channelID: string;
  onSetAvatarComplete?(): void;
}

export interface UserSetAvatarState {
  avatarDataURL: string;
  errorMessage: string | undefined;
  scale: number;
  image?: any;
  preview?: PreviewImageState;
  saveInProgress: boolean;
  useSmallAvatarEditor: boolean;
}

export interface PreviewImageState {
  image: string;
  rect: any;
  scale: number;
  width: number;
  height: number;
  borderRadius: number;
}

export class UserSetAvatar extends React.Component<UserSetAvatarProps, UserSetAvatarState> {
  public editor: AvatarEditor | null;
  constructor(props: UserSetAvatarProps) {
    super(props);
    const useSmallAvatarEditor = window.innerWidth < 500;
    this.state = {
      avatarDataURL: "",
      errorMessage: undefined,
      scale: 1.4,
      saveInProgress: false,
      useSmallAvatarEditor,
    };
    this.editor = null;
  }

  public render(): JSX.Element {
    const { headerComponent, channelID } = this.props;
    return (
      <UserSetAvatarContainer>
        {headerComponent}
        <Mutation<any> mutation={setAvatarMutation}>
          {setAvatar => {
            return (
              <form onSubmit={async event => this.handleSubmit(event, setAvatar, channelID)}>
                {this.renderAvatarSelector()}
                {this.state.image && (
                  <SkipAndSaveButtonsContainer>
                    <InvertedButton
                      size={buttonSizes.SMALL}
                      textTransform={"none"}
                      onClick={() => this.setState({ image: undefined })}
                      disabled={this.state.saveInProgress}
                    >
                      Go back
                    </InvertedButton>
                    <SaveButtonContainer>
                      <Button
                        size={buttonSizes.SMALL}
                        textTransform={"none"}
                        type={"submit"}
                        disabled={this.state.saveInProgress}
                      >
                        {this.state.saveInProgress && (
                          <>
                            Saving <ClipLoader size={16} />
                          </>
                        )}
                        {!this.state.saveInProgress && "Save"}
                      </Button>
                    </SaveButtonContainer>
                  </SkipAndSaveButtonsContainer>
                )}
              </form>
            );
          }}
        </Mutation>
        {!this.state.image && (
          <SkipForNowButtonContainer>
            <ApolloConsumer>
              {client => <SkipButton onClick={() => this.onSkipForNowClicked(client)}>Skip for now</SkipButton>}
            </ApolloConsumer>
          </SkipForNowButtonContainer>
        )}
      </UserSetAvatarContainer>
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
        {this.state.image && (
          <AvatarEditorDiv>
            <AvatarEditorInnerDiv>
              <AvatarEditor
                ref={(el: any) => {
                  this.editor = el;
                }}
                image={this.state.image ? this.state.image : ""}
                width={this.state.useSmallAvatarEditor ? 200 : 336}
                height={this.state.useSmallAvatarEditor ? 200 : 336}
                border={0}
                borderRadius={this.state.useSmallAvatarEditor ? 100 : 168}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={this.state.scale}
                rotate={0}
              />
            </AvatarEditorInnerDiv>
            <CropSpan>Crop your photo</CropSpan>
            <ZoomContainer>
              <ZoomIconContainer>
                <ZoomOutIcon />
              </ZoomIconContainer>
              <ZoomSliderContainer>
                <Slider
                  styles={{
                    track: { backgroundColor: colors.accent.CIVIL_GRAY_4, width: 250 },
                    active: { backgroundColor: colors.accent.CIVIL_GRAY_4 },
                  }}
                  axis="x"
                  xmin={100}
                  xmax={400}
                  x={this.state.scale * 100}
                  onChange={(xy: any) => {
                    this.setState({ scale: xy.x / 100 });
                  }}
                />
              </ZoomSliderContainer>
              <ZoomIconContainer>
                <ZoomInIcon />
              </ZoomIconContainer>
            </ZoomContainer>
          </AvatarEditorDiv>
        )}
        {!this.state.image && (
          <AvatarEditorDiv>
            <SimpleImageFileToDataUri onChange={this.handleNewImage} />
          </AvatarEditorDiv>
        )}
      </AvatarEditorContainerDiv>
    );
  }

  private async handleSubmit(event: React.FormEvent, mutation: MutationFn, channelID: string): Promise<void> {
    event.preventDefault();

    this.setState({ errorMessage: undefined, saveInProgress: true });

    const croppingRect = this.editor!.getCroppingRect();

    const img = document.createElement("img");
    img.onload = async (): Promise<void> => {
      const startingX = img.width * croppingRect.x;
      const startingY = img.height * croppingRect.y;
      const startingWidth = img.width * croppingRect.width;
      const startingHeight = img.height * croppingRect.height;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 336;
      canvas.height = 336;
      ctx!.drawImage(img, startingX, startingY, startingWidth, startingHeight, 0, 0, 336, 336);
      const avatarDataURL = canvas.toDataURL();

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

        this.setState({ errorMessage, saveInProgress: false });
      }
    };
    img.src = this.state.image!;
  }
}
