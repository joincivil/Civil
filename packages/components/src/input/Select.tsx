import * as React from "react";

export interface SelectOption {
  value: string | number;
  name: string;
}

export interface SelectProps {
  options: SelectOption[];
}

export class Select extends React.Component {
  public render(): JSX.Element {
    return <div/>;
  }
}
