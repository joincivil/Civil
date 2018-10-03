import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import debounce from "lodash/debounce";
import styled from "styled-components";
import {
  colors,
  StepHeader,
  StepProps,
  StepDescription,
  QuestionToolTip,
  buttonSizes,
  TextInput,
  TextareaInput,
} from "@joincivil/components";
import { EthAddress, CharterData } from "@joincivil/core";
import { FormSection, FormTitle, FormSubhead, TertiaryButton } from "./styledComponents";
import { StateWithNewsroom } from "./reducers";
import { updateCharter } from "./actionCreators";

export interface CreateCharterPartOneProps extends StepProps {
  address?: EthAddress;
  savedCharter?: Partial<CharterData>;
  stepisComplete(isComplete: boolean): void;
  saveCharter?(charter: Partial<CharterData>): void;
}

export interface CreateCharterPartOneState {
  charter: Partial<CharterData>;
}

const HelperText = styled.div`
  margin-top: -6px;
  padding-left: 15px;
  font-size: 13px;
  color: #72777c;
`;

const LogoFormWrap = styled.div`
  display: flex;
  justify-content: space-between;

  ${TertiaryButton} {
    &,
    &:hover {
      margin: 6px 0 0;
    }
  }
`;
const LogoURLWrap = styled.div`
  flex-grow: 2;
  margin-right: 15px;
  padding-right: 15px;
  border-right: 1px solid ${colors.accent.CIVIL_GRAY_4};
`;
const LogoURLInput = styled(TextInput)`
  &,
  input {
    margin-bottom: 0;
  }
`;

const SocialWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SocialForm = styled.div`
  width: 50%;
  &:first-child {
    padding-right: 15px;
  }
`;

const NewsroomURLInput = styled(TextInput)`
  max-width: 400px;
`;
const TaglineTextarea = styled(TextareaInput)`
  height: 80px;
  margin-bottom: 0;
`;

class CreateCharterPartOneComponent extends React.Component<
  CreateCharterPartOneProps & DispatchProp<any>,
  CreateCharterPartOneState
> {
  private handleCharterUpdate = debounce(() => {
    this.props.dispatch!(updateCharter(this.props.address!, this.state.charter));

    this.checkIsComplete();

    if (this.props.saveCharter) {
      this.props.saveCharter(this.state.charter);
    }
  }, 1000);

  constructor(props: CreateCharterPartOneProps) {
    super(props);
    this.state = {
      charter: props.savedCharter || {},
    };
    this.checkIsComplete();
  }

  public render(): JSX.Element {
    return (
      <>
        <StepHeader>Create your Registry profile</StepHeader>
        <StepDescription>
          Add your Newsroom profile information. This will be included on your smart contract and shown on your listing
          page in the Civil Registry.
        </StepDescription>

        <FormSection>
          <FormTitle>Newsroom Profile</FormTitle>
          <p>Enter your newsroom profile details.</p>

          <div>
            <FormSubhead>
              Logo
              <QuestionToolTip
                explainerText={
                  "You need to add a URL to a logo or image. You can add a logo to your WordPress media library and copy the URL here. We recommend the image dimensions to be at minimum  300 x 300 pixels."
                }
              />
            </FormSubhead>
            <LogoFormWrap>
              <LogoURLWrap>
                <LogoURLInput
                  placeholder="Enter URL or Open Media Library"
                  noLabel
                  name="logoUrl"
                  value={this.state.charter.logoUrl || ""}
                  onChange={this.charterInputChange}
                />
              </LogoURLWrap>
              <TertiaryButton size={buttonSizes.SMALL}>Open Media Library</TertiaryButton>
            </LogoFormWrap>
            <HelperText style={{ marginTop: 4 }}>Must be image URL</HelperText>
          </div>

          <div>
            <FormSubhead>
              Newsroom URL
              {/*TODO: pre-fill with value from CMS*/}
            </FormSubhead>
            <NewsroomURLInput
              name="newsroomUrl"
              value={this.state.charter.newsroomUrl || ""}
              onChange={this.charterInputChange}
            />
          </div>

          <div>
            <FormSubhead>
              Tagline
              <QuestionToolTip explainerText={"This can be a tagline or short summary about your Newsroom."} />
            </FormSubhead>
            <TaglineTextarea
              name="tagline"
              value={this.state.charter.tagline || ""}
              onChange={this.charterInputChange}
            />
            <HelperText>Maximum of 120 Characters</HelperText>
          </div>

          <div>
            <SocialWrap>
              <SocialForm>
                <div>
                  <FormSubhead>
                    Twitter URL <em>(optional)</em>
                  </FormSubhead>
                  <TextInput
                    name="twitter"
                    value={(this.state.charter.socialUrls || {}).twitter || ""}
                    onChange={this.charterSocialInputChange}
                  />
                </div>
              </SocialForm>
              <SocialForm>
                <div>
                  <FormSubhead>
                    Facebook URL <em>(optional)</em>
                  </FormSubhead>
                  <TextInput
                    name="facebook"
                    value={(this.state.charter.socialUrls || {}).facebook || ""}
                    onChange={this.charterSocialInputChange}
                  />
                </div>
              </SocialForm>
            </SocialWrap>
          </div>
        </FormSection>

        <FormSection>
          <FormTitle>Newsroom Roster</FormTitle>
          <p>
            Select the participants in your WordPress newsroom you want to add your roster and include any relevant
            credentials.
          </p>
          <p>TODO</p>
        </FormSection>
      </>
    );
  }

  private checkIsComplete(): void {
    this.props.stepisComplete(
      !!(
        this.state.charter &&
        this.state.charter.logoUrl &&
        this.state.charter.newsroomUrl &&
        this.state.charter.tagline
      ),
    ); // @TODO/tobek also roster, and validate fields
  }

  private charterInputChange = (name: string, val: string) => {
    this.setState({
      charter: {
        ...this.state.charter,
        [name]: val,
      },
    });
    this.handleCharterUpdate();
  };

  private charterSocialInputChange = (type: string, url: string) => {
    this.setState({
      charter: {
        ...this.state.charter,
        socialUrls: {
          ...this.state.charter.socialUrls,
          [type]: url,
        },
      },
    });
    this.handleCharterUpdate();
  };
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: CreateCharterPartOneProps): CreateCharterPartOneProps => {
  let charterFromState;
  if (ownProps.address && state.newsrooms.get(ownProps.address)) {
    charterFromState = state.newsrooms.get(ownProps.address).charter;
  }
  return {
    ...ownProps,
    savedCharter: ownProps.savedCharter || charterFromState || {},
  };
};

export const CreateCharterPartOne = connect(mapStateToProps)(CreateCharterPartOneComponent);
