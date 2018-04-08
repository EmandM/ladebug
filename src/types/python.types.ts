import { IPrimitive } from ".";

export interface IFrame {
  event: 'step_line' | 'call' | 'return' | 'uncaught_exception';
  func_name: '<module>' | string;
  globals: PyVarObj;
  ordered_globals: string[];
  stack_to_render: IStackEntry[];
  heap: PyHeap;
  stdout: string;
}

export type IHeapReference = [PyVarType.HeapReference, number] //REF points to heap key

export interface PyVarObj { [name: string]: PyVar }

export type PyVar = IHeapReference | IPrimitive;

export type PyHeapVal = PyVar | string[];

export enum PyVarType {
  HeapReference = 'REF',
  Function = 'FUNCTION',
  Dictionary = 'DICT',
  List = 'LIST',
  Tuple = 'TUPLE',
}

export interface PyHeap { [key: number]: PyHeapVal}

export interface IStackEntry {
  encoded_locals: PyVarObj;
  frame_id: number;
  func_name: string;
  is_highlighted: boolean;
  is_parent: boolean;
  is_zombie: boolean;
  ordered_varnames: string[];
  parent_frame_id: number;
  unique_hash: string;
}