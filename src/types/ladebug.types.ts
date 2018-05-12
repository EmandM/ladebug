import { IPrimitive } from '.';

export interface IVariable {
  type: string;
  name?: string;
  value: IVariable | IPrimitive;
  isPrimitive: boolean;
}

export interface ICallStack {
  id: string;
  name: string;
  variables: IVariable[];
}
