import * as React from "react";
import { EthContentHeader } from "@joincivil/core";
import { connect, DispatchProp } from "react-redux";
import { fetchRevisionJson } from "./actions";
import styled from "styled-components";

export interface RevisionProps {
  revision: EthContentHeader;
  revisionJson?: any;
}

const Table = styled.table`
  border: 1px solid black;
`;

const Tr = styled.tr`
  border: 1px solid black;
`;

const Td = styled.td`
  border: 1px solid black;
`;

class RevisionComponent extends React.Component<RevisionProps & DispatchProp<any>> {
  public renderJsonSection(): JSX.Element {
    if (!this.props.revisionJson) {
      return (
        <Tr>
          <Td>
            <button onClick={this.onClick}>get revision</button>
          </Td>
        </Tr>
      );
    }
    const revisionJson = this.props.revisionJson;
    return (
      <>
        <Tr>
          <Td>title: {revisionJson.title}</Td>
        </Tr>
        <Tr>
          <Td>slug: {revisionJson.slug}</Td>
        </Tr>
        <Tr>
          <Td>description: {revisionJson.description}</Td>
        </Tr>
        {revisionJson.images.length &&
          revisionJson.images.map((item: any) => {
            return (
              <>
                <Tr>
                  <Td>height: {item.h}</Td>
                  <Td>width: {item.w}</Td>
                  <Td>hash: {item.hash}</Td>
                  <Td>url: {item.url}</Td>
                </Tr>
                <Tr>
                  <img src={item.url} />
                </Tr>
              </>
            );
          })}
        <Tr>
          <Td>canonical url: {revisionJson.canonicalUrl}</Td>
          <Td>civil schema version: {revisionJson.civilSchemaVersion}</Td>
        </Tr>
        <Tr>
          <h4>Contributors</h4>
        </Tr>
        {revisionJson.contributors.map((item: any) => {
          return (
            <Tr>
              <Td>role: {item.role}</Td>
              <Td>name: {item.name}</Td>
              <Td>signature: {item.signature}</Td>
              <Td>address: {item.address}</Td>
            </Tr>
          );
        })}
        <Tr>
          <h4>Credibility Indicators</h4>
        </Tr>
        <Tr>
          <Td>original reporting: {`${revisionJson.credibilityIndicators.original_reporting}`}</Td>
          <Td>on the ground: {`${revisionJson.credibilityIndicators.on_the_ground}`}</Td>
          <Td>sources cited: {`${revisionJson.credibilityIndicators.sources_cited}`}</Td>
          <Td>subject specialist: {`${revisionJson.credibilityIndicators.subject_specialist}`}</Td>
        </Tr>
        <Tr>
          <Td>opinion: {`${revisionJson.opinion}`}</Td>
        </Tr>
        <Tr>
          <Td>original publish date: {revisionJson.originalPublishDate}</Td>
        </Tr>
        <Tr>
          <Td>primary tag: {revisionJson.primaryTag}</Td>
        </Tr>
        <Tr>
          <Td>revision content hash: {revisionJson.revisionContentHash}</Td>
        </Tr>
        <Tr>
          <Td>revision content url: {revisionJson.revisionContentUrl}</Td>
        </Tr>
        <Tr>
          <Td>revision date: {revisionJson.revisionDate}</Td>
        </Tr>
        <Tr>
          <Td>tags: {revisionJson.tags.join(", ")}</Td>
        </Tr>
      </>
    );
  }
  public render(): JSX.Element {
    return (
      <Table>
        <thead>
          <Tr>
            <Td>revision id: {this.props.revision.revisionId}</Td>
            <Td>content id: {this.props.revision.contentId}</Td>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>revision url: {this.props.revision.uri}</Td>
          </Tr>
          <Tr>
            <Td>hash:{this.props.revision.contentHash}</Td>
          </Tr>
          <Tr>
            <Td>block number: {this.props.revision.blockNumber}</Td>
            <Td>time stamp: {this.props.revision.timestamp!.toDateString()}</Td>
          </Tr>
          <Tr>
            <Td>transaction hash: {this.props.revision.transactionHash}</Td>
          </Tr>
          {this.renderJsonSection()}
        </tbody>
      </Table>
    );
  }
  private onClick = (): void => {
    this.props.dispatch!(
      fetchRevisionJson(this.props.revision.uri, this.props.revision.contentId!, this.props.revision.revisionId!),
    );
  };
}

export const Revision = connect()(RevisionComponent);
