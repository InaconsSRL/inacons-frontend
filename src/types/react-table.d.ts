// src/types/react-table.d.ts
declare module 'react-table' {
    import { ComponentType, ReactNode, MouseEvent } from 'react';
  
    export interface Column<D extends object = {}> {
      Header: string | ReactNode;
      accessor: keyof D | ((originalRow: D) => string);
      Cell?: ComponentType<{ value: any; row: Row<D>; column: Column<D>; cell: Cell<D> }>;
      id?: string;
      columns?: Column<D>[];
      show?: boolean;
      minWidth?: number;
      maxWidth?: number;
      width?: number;
    }
  
    export interface TableOptions<D extends object = {}> {
      columns: Column<D>[];
      data: D[];
    }
  
    export interface TableInstance<D extends object = {}> {
      getTableProps: (propGetter?: TablePropGetter<D>) => TableProps;
      getTableBodyProps: (propGetter?: TableBodyPropGetter<D>) => TableBodyProps;
      headerGroups: HeaderGroup<D>[];
      rows: Row<D>[];
      prepareRow: (row: Row<D>) => void;
    }
  
    export interface TablePropGetter<D extends object = {}> {
      (finalState: TableState<D>, row: Row<D>, column: Column<D>, instance: TableInstance<D>): object;
    }
  
    export interface TableBodyPropGetter<D extends object = {}> {
      (finalState: TableState<D>, row: Row<D>, column: Column<D>, instance: TableInstance<D>): object;
    }
  
    export interface TableProps {
      role?: string;
      style?: React.CSSProperties;
    }
  
    export interface TableBodyProps {
      role?: string;
      style?: React.CSSProperties;
    }
  
    export interface HeaderGroup<D extends object = {}> {
      getHeaderGroupProps: (propGetter?: TablePropGetter<D>) => TableProps;
      headers: ColumnInstance<D>[];
    }
  
    export interface ColumnInstance<D extends object = {}> extends Column<D> {
      getHeaderProps: (propGetter?: TablePropGetter<D>) => TableProps;
    }
  
    export interface Row<D extends object = {}> {
      cells: Cell<D>[];
      getRowProps: (propGetter?: TablePropGetter<D>) => TableProps;
    }
  
    export interface Cell<D extends object = {}> {
      column: ColumnInstance<D>;
      row: Row<D>;
      value: any;
      getCellProps: (propGetter?: TablePropGetter<D>) => TableProps;
    }
  
    export interface TableState<D extends object = {}> {
      hiddenColumns?: string[];
    }
  
    export function useTable<D extends object = {}>(options: TableOptions<D>): TableInstance<D>;
  }