import { ReactNode } from 'react';

export type TableRow = Record<string, string | number | boolean | ReactNode>;

export type TableData = {
  headers: string[];
  filterSelect?: boolean[];
  filter?: boolean[];
  rows: TableRow[];
};
