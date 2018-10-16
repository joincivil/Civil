export interface TableProps {
  borderWidth?: string;
  width?: string;
}

export interface TableCellProps {
  accent?: boolean;
  align?: any; // not sure why `string` was causing compiler issues, but it was. TODO(nickreynolds): investigate
  borderWidth?: string;
  colSpan?: number;
  padding?: number;
  rowSpan?: number;
  width?: string;
}
