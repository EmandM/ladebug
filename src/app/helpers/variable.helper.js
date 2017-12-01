import map from 'lodash/map';

export default class VarHelper {
  static objToVar(obj, name) {
    if (!obj) {
      return {
        value: 'None',
        type: 'None',
        isPrimitive: true,
        name,
      };
    }

    const type = typeof obj;
    if (type === 'number' || type === 'boolean' || type === 'string') {
      return {
        value: obj,
        type,
        isPrimitive: true,
        name,
      };
    }

    const value = map(obj, (val, key) => VarHelper.objToVar(val, key));

    return {
      type,
      name,
      value,
      isPrimitive: false,
    };
  }
}
