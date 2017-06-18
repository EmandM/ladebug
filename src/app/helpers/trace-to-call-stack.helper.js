import forEach from 'lodash/forEach';
import map from 'lodash/map';
import isArray from 'lodash/isArray';
import drop from 'lodash/drop';

export default class TraceToCallStack {
  /*
   * Frames are from the code trace retrieved from file. A frame is one base level code trace.
   * frame = {
   *    event: 'EVENT_TYPE',
   *    func_name: Name of function., <- <module> if base
   *    globals: Name of global variables
   *    heap: Value of anything that isn't an int? Is an object? idk.
   *    line: line of code in initial frame.
   *    ordered_globals: globals, but in order.
   *    stack_to_render: call stack, not including base
   *      [
   *        encoded_locals: Like globals, but local. points to variables on global heap.
   *        frame_id: Id of the frame,
   *        func_name: Name of function.
   *        is_highlighted: don't know
   *        is_parent: don't know
   *        is_zombie: don't know
   *        ordered_varnames: locals, but in order
   *        parent_frame_id: don't know
   *        unique_hash: unique function reference?
   *      ]
   *    stdout: anything that's been printed to stdout.
   * }
   */

  /*
   * This class (/function) takes a frame and returns a call stack.
   * Basically lines heap values up with their reference.
   * Breaks any idea of referened objects vs local objects.
   */

  static toStack(frame) {
    const callStack = map(frame.stack_to_render, (stackItem) => {
      const name = stackItem.func_name;
      return {
        name,
        variables: TraceToCallStack.matchReferences(frame.heap, stackItem.encoded_locals),
      };
    });

    callStack.push({
      name: frame.func_name,
      variables: TraceToCallStack.matchReferences(frame.heap, frame.globals),
    });
    return callStack;
  }

  static matchReferences(heap, variableNames) {
    const variables = {};
    forEach(variableNames, (variableValue, variableName) => {
      let type;
      let value;
      if (!isArray(variableValue)) {
        type = 'primitive';
        value = variableValue;
      } else {
        if (variableValue[0] !== 'REF') {
          console.log('VariableValue is not REF. NEED TO CHECK THIS');
        }
        const heapItem = variableValue[1];
        type = heapItem[0];
        value = TraceToCallStack.getHeapValue(heapItem);
      }
      variables[variableName] = {
        type,
        value,
      };
    });
    return variables;
  }

  static getHeapValue(heapItem) {
    let result;
    const varType = heapItem[0];
    const varValues = drop(heapItem, 1);
    if (varType === 'DICT') {
      result = {};
      forEach(varValues, (valueArray) => {
        result[valueArray[0]] = valueArray[1];
      });
    } else if (varType === 'TUPLE') {
      result = [];
      forEach(varValues, (value) => {
        result.push(value);
      })
    }
    return result;
  }
}
