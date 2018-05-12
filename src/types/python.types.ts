import { IPrimitive } from '.';

export interface IFrame {
  event: 'step_line' | 'call' | 'return' | 'uncaught_exception';
  func_name: '<module>' | string;
  globals: IPyVarObj;
  ordered_globals: string[];
  stack_to_render: IStackEntry[];
  heap: IPyHeap;
  stdout: string;
}

export type IHeapReference = [PyVarType.HeapReference, number]; // REF points to heap key

export interface IPyVarObj { [name: string]: PyVar; }

export type PyVar = IHeapReference | IPrimitive;

export type PyHeapVal = PyVar | string[];

export enum PyVarType {
  HeapReference = 'REF',
  Function = 'FUNCTION',
  Dictionary = 'DICT',
  List = 'LIST',
  Tuple = 'TUPLE',
}

export interface IPyHeap { [key: number]: PyHeapVal;}

export interface IStackEntry {
  encoded_locals: IPyVarObj;
  frame_id: number;
  func_name: string;
  is_highlighted: boolean;
  is_parent: boolean;
  is_zombie: boolean;
  ordered_varnames: string[];
  parent_frame_id: number;
  unique_hash: string;
}
