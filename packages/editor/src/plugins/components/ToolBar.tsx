import * as React from "react";
// tslint:disable-next-line
import styled, { StyledComponentClass } from "styled-components";
import {
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Title,
  FormatBold,
  FormatItalic,
  InsertLink,
  FormatStrikethrough,
  InsertPhoto,
} from "material-ui-icons";
import { ImageModal, ImageModalState } from "./ImageModal";
import { colorConstants } from "../../colorConstants";

import { constants, Plugin } from "../index";

export interface ToolBarProps {
  readOnly: boolean;
  value: any;
  editor: any;
  onChange: any;
  plugins: Plugin[];
}

export interface MarkObject {
  type: string;
  data: any;
}

export interface ToolBarState {
  openImageModal: boolean;
}

const ToolBarWrapper = styled.div`
  position: absolute;
  right: -20px;
  top: 20px;
  > div {
    position: fixed;
    display: flex;
    flex-direction: column;
    z-index: 10;
  }
  svg,
  button {
    cursor: pointer;
    padding: 10px;
  }
  & path {
    stroke: ${colorConstants.PRIMARY_BLUE};
    fill: ${colorConstants.PRIMARY_BLUE};
  }
  & .active path {
    stroke: ${colorConstants.ACCENT_GREEN};
    fill: ${colorConstants.ACCENT_GREEN};
  }
`;

const Button = styled.button`
  background: transparent;
  font-family: "Libre Franklin", sans-serif;
  font-weight: 700;
  color: ${colorConstants.PRIMARY_BLUE};
  border: none;
  font-size: 18px;
  text-align: center;
  &.active {
    color: ${colorConstants.ACCENT_GREEN};
  }
`;

export class ToolBar extends React.Component<ToolBarProps, ToolBarState> {
  public listPlugin: Plugin | void;

  constructor(props: ToolBarProps) {
    super(props);
    this.state = {
      openImageModal: false,
    };
    this.listPlugin = props.plugins.find(item => item.name === constants.LIST);
  }

  public getParentOfAnchor(): any {
    return this.props.value.document.getParent(this.props.value.anchorBlock.key);
  }

  public isActiveMark(type: string): boolean {
    return this.props.value.activeMarks.some((mark: any): boolean => mark.type === type);
  }

  public isWrappedInBlock(blockType: string): boolean {
    return this.getParentOfAnchor().type === blockType;
  }

  public isListOfType(type: string): boolean {
    if (this.listPlugin && this.listPlugin.utils) {
      if (this.listPlugin.utils.isSelectionInList(this.props.value)) {
        const block = this.listPlugin.utils.getCurrentList(this.props.value);
        return block.type === type;
      }
    }
    return false;
  }

  public onMarkClick(e: any, mark: string | MarkObject): void {
    e.preventDefault();
    const change = this.props.value.change().toggleMark(mark);
    this.props.onChange(change);
  }

  public onBlockClick(e: any, blockType: string): void {
    e.preventDefault();
    const change = this.props.value
      .change()
      .setBlocks(blockType)
      .focus();
    this.props.onChange(change);
  }

  public onBlockWrap(e: any, blockType: string): void {
    e.preventDefault();
    let change;
    if (this.isWrappedInBlock(blockType)) {
      change = this.props.value
        .change()
        .unwrapBlock(blockType)
        .focus();
    } else {
      change = this.props.value
        .change()
        .wrapBlock(blockType)
        .focus();
    }
    this.props.onChange(change);
  }

  public createList(e: any, type: string): void {
    if (!this.listPlugin || !this.listPlugin.utils || !this.listPlugin.changes) {
      return;
    }
    let change;
    if (this.listPlugin.utils.isSelectionInList(this.props.value)) {
      const block = this.listPlugin.utils.getCurrentList(this.props.value);
      if (block.type === type) {
        change = this.listPlugin.changes.unwrapList(this.props.value.change());
      } else {
        change = this.listPlugin.changes.unwrapList(this.props.value.change());
        change = this.listPlugin.changes.wrapInList(change, type);
      }
    } else {
      change = this.listPlugin.changes.wrapInList(this.props.value.change(), type);
    }
    this.props.onChange(change);
  }

  public onImageApplyChange(change: ImageModalState): void {
    const transform = this.props.value.change().insertBlock({
      type: constants.IMAGE,
      data: {
        src: change.imageUrl,
        style: change.imageFullWidth ? constants.IMAGE_BREAKOUT : constants.IMAGE,
      },
    });
    this.props.onChange(transform);
    this.setState({ openImageModal: false });
  }

  public renderButton(): JSX.Element | void {
    if (!this.props.readOnly) {
      let imageModal = null;
      if (this.state.openImageModal) {
        imageModal = <ImageModal applyChange={this.onImageApplyChange.bind(this)} />;
      }
      const activeBlock = this.props.value.anchorBlock.type;
      return (
        <ToolBarWrapper>
          <div>
            <Title
              className={activeBlock === constants.HEADER ? "active" : ""}
              onClick={(e: any) => this.onBlockClick(e, constants.HEADER)}
            />
            <Button
              className={activeBlock === constants.PARAGRAPH ? "active" : ""}
              onClick={(e: any) => this.onBlockClick(e, constants.PARAGRAPH)}
            >
              p
            </Button>
            <FormatQuote
              className={this.isWrappedInBlock(constants.BLOCKQUOTE) ? "active" : ""}
              onClick={(e: any) => this.onBlockWrap(e, constants.BLOCKQUOTE)}
            />
            <FormatListBulleted
              className={this.isListOfType(constants.UL_LIST) ? "active" : ""}
              onClick={(e: any) => this.createList(e, constants.UL_LIST)}
            />
            <FormatListNumbered
              className={this.isListOfType(constants.OL_LIST) ? "active" : ""}
              onClick={(e: any) => this.createList(e, constants.OL_LIST)}
            />
            <Button
              className={this.isActiveMark(constants.PULL_QUOTE) ? "active" : ""}
              onClick={(e: any) => this.onMarkClick(e, { type: constants.PULL_QUOTE, data: { top: 0 } })}
            >
              pq
            </Button>
            <Button
              className={this.isActiveMark(constants.DROP_CAP) ? "active" : ""}
              onClick={(e: any) => this.onMarkClick(e, constants.DROP_CAP)}
            >
              dc
            </Button>
            <Button
              className={this.isActiveMark(constants.RUN_IN) ? "active" : ""}
              onClick={(e: any) => this.onMarkClick(e, constants.RUN_IN)}
            >
              ri
            </Button>
            <FormatBold
              className={this.isActiveMark(constants.BOLD) ? "active" : ""}
              onClick={(e: any) => this.onMarkClick(e, constants.BOLD)}
            />
            <FormatItalic
              className={this.isActiveMark(constants.ITALIC) ? "active" : ""}
              onClick={(e: any) => this.onMarkClick(e, constants.ITALIC)}
            />
            <FormatStrikethrough
              className={this.isActiveMark(constants.STRIKE_THROUGH) ? "active" : ""}
              onClick={(e: any) => this.onMarkClick(e, constants.STRIKE_THROUGH)}
            />
            <InsertLink
              className={this.isActiveMark(constants.LINK) ? "active" : ""}
              onClick={(e: any) => this.onMarkClick(e, constants.LINK)}
            />
            <InsertPhoto onClick={(e: any) => this.setState({ openImageModal: true })} />
            {imageModal}
          </div>
        </ToolBarWrapper>
      );
    }
  }

  public render(): JSX.Element {
    return (
      <>
        {this.renderButton()}
        {this.props.children}
      </>
    );
  }
}
