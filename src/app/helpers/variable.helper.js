import map from 'lodash/map';

export default class VarHelper {
  static objToVar(obj, name, type) {
    if (!type && !obj) {
      return VarHelper.createVariable('None', 'None', true, name);
    }

    if (!type) {
      type = typeof obj;
    }

    if (type === 'number' || type === 'boolean' || type === 'string') {
      return VarHelper.createVariable(obj, type, true, name);
    }

    const value = map(obj, (val, key) => VarHelper.objToVar(val, key));

    return VarHelper.createVariable(value, type, false, name);
  }

  static createVariable(value, type, isPrimitive, name) {
    return {
      type,
      name,
      value,
      isPrimitive,
    };
  }
}
