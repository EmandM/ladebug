import { map } from 'lodash';
import { IVariable } from '../../types';

export class VarHelper {
  public static objToVar(obj: any, name: string, type?: string): IVariable {
    if (!type && !obj) {
      return VarHelper.createVariable('None', 'None', true, name);
    }

    if (!type) {
      type = typeof obj;
    }

    if (type === 'number' || type === 'boolean' || type === 'string') {
      return VarHelper.createVariable(obj, type, true, name);
    }

    const value = map(obj, (val, key) => this.objToVar(val, key.toString()));

    return VarHelper.createVariable(value, type, false, name);
  }

  public static createVariable(value: any, type: string, isPrimitive: boolean = false, name?: string): IVariable {
    return {
      type,
      name,
      value,
      isPrimitive,
    };
  }
}
