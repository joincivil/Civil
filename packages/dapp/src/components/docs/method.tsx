import * as React from "react";
import { Input, Table, Segment, Label, Header } from "semantic-ui-react";
import * as ReactMarkdown from "react-markdown";

export interface MethodProps {
  method: any;
  contract: any;
}

export interface MethodState {
  inputs: any[];
  outputs: any[];
}

export default class Method extends React.Component<MethodProps, MethodState> {
  constructor(props: MethodProps) {
    super(props);
    this.renderParams = this.renderParams.bind(this);
    this.handleUpdateParam = this.handleUpdateParam.bind(this);
    this.state = { inputs: [], outputs: [] };
  }

  public componentDidMount(): void {
    if (this.props.method.type === "function" && this.props.method.inputs.length === 0) {
      this.handleRequest();
    }
  }

  public render(): JSX.Element {
    const { method, contract } = this.props;
    // color segment based on type
    const colors = {
      event: "blue",
      constructor: "red",
    };
    const color = colors[method.type];
    let notice = method.notice;
    if (notice) {
      notice = notice.replace(/--------/g, "<br/><br/>");
    }
    return (
      <Segment color={color}>
        <Label ribbon="right" color={color}>
          {method.type}
          {method.payable && ", payable"}
          {method.constant && ", constant"}
        </Label>
        <Header style={{ marginTop: "-1.5rem" }} as="h3">
          <code>{method.name || contract.name}</code>{" "}
          {method.signatureHash && <code className="signature">{method.signatureHash}</code>}
        </Header>
        {notice && <ReactMarkdown source={notice} escapeHtml={false} />}
        {method.details && <ReactMarkdown source={method.details} />}
        {(method.inputs.length || method.outputs) && (
          <Table definition>
            <Table.Body>
              {method.inputs && this.renderParams("inputs")}
              {method.outputs && this.renderParams("outputs")}
            </Table.Body>
          </Table>
        )}
        {method.return && (
          <>
            Returns: <ReactMarkdown source={method.return} />
          </>
        )}
      </Segment>
    );
  }

  private handleRequest(): void {
    // TODO(nickreynolds): figure out if we want this (was brought over from doxity sample site)
    /*const { method, contract } = this.props
    const calledMethod = contract.instance[method.name]
    calledMethod.call.apply(calledMethod, [...this.state.inputs, (err: any, res: any) => {
      const results = Array.isArray(res) ? res : [res]
      // format bignumbers
      const outputs = results.map((out) => (out.toNumber ? `${out.toNumber()}` : `${out}`))
      this.setState({ outputs })
    }]);*/
  }
  private handleUpdateParam(e: any, i: any): void {
    // const { method } = this.props
    const { inputs } = this.state;
    inputs[i] = e.target.value;
    this.setState({ inputs });
    // TODO(nickreynolds): figure out if ready is needed
    // const ready = new Array(method.inputs.length).fill().map((k: any, j: any) => j).find(j: any => !this.state.inputs[j]) === undefined
    // if (ready) { this.handleRequest(method); }
    this.handleRequest();
  }
  private renderParams(type: any): JSX.Element {
    const { method, contract } = this.props;
    const { outputs } = this.state;
    const params = method[type];
    return params.map((param: any, i: any) => {
      const inputs = type === "inputs";
      return (
        <Table.Row key={i} negative={!inputs} positive={inputs}>
          {i === 0 ? (
            <Table.Cell style={{ textTransform: "capitalize" }} rowSpan={params.length}>
              {type}
            </Table.Cell>
          ) : (
            <Table.Cell style={{ display: "none" }}>{type}</Table.Cell>
          )}
          <Table.Cell>{`${i}`}</Table.Cell>
          <Table.Cell>{param.type}</Table.Cell>
          <Table.Cell>{param.name && <code>{param.name}</code>}</Table.Cell>
          <Table.Cell>{param.description && <ReactMarkdown source={param.description} />}</Table.Cell>
          {contract.address &&
            method.outputs.length > 0 && (
              <Table.Cell textAlign="right">
                {inputs ? <Input placeholder={param.name} onChange={e => this.handleUpdateParam(e, i)} /> : outputs[i]}
              </Table.Cell>
            )}
        </Table.Row>
      );
    });
  }
}
