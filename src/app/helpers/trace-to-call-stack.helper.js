import map from 'lodash/map';
import isArray from 'lodash/isArray';
import toLower from 'lodash/toLower';

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
        name: name + '()',
        variables: TraceToCallStack.matchReferences(frame.heap, stackItem.encoded_locals),
        id: stackItem.unique_hash,
      };
    });

    callStack.unshift({
      name: 'Globals',
      variables: TraceToCallStack.matchReferences(frame.heap, frame.globals),
      id: 0,
    });
    return callStack;
  }

  static matchReferences(heap, variables) {
    // map is built for array type objects, we're using a bit of a hack to use it for objects
    // This hack breaks if there is a key in the object named length (map uses .length internally)
    // Get around this by changing the length value to a string
    let lengthValue;
    if (variables.hasOwnProperty('length')) {
      lengthValue = variables.length;
      variables.length = 'placeholder';
    }

    const vars = map(variables, (variableValue, variableName) => {
      if (variableName === 'length') {
        variableValue = lengthValue;
      }
      return TraceToCallStack.addNameToVariable(variableName, variableValue, heap);
    });
    variables.length = lengthValue;
    return vars;
  }

  static getValue(value, heap) {
    if (!isArray(value)) {
      return {
        type: typeof value,
        value,
        isPrimitive: true,
      };
    }

    if (value[0] === 'REF') {
      value = heap[value[1]];
    }

    let finalValue;
    const type = value[0];
    let values = value.slice(1, value.length);

    if (type === 'FUNCTION') {
      // Grab the first value for the function => second value is null
      values = values.slice(0, 1);
    }

    if (type === 'DICT') {
      finalValue = map(values,
        (valueArray => TraceToCallStack.addNameToVariable(valueArray[0], valueArray[1], heap)));
    } else if (type === 'LIST' || type === 'TUPLE') { // Add index as key
      finalValue = map(values, (variable, index) =>
        TraceToCallStack.addNameToVariable(index, variable, heap));
    } else {
      finalValue = map(values, varValue => TraceToCallStack.getValue(varValue, heap));
    }

    return {
      type: toLower(type),
      value: finalValue,
    };
  }

  static addNameToVariable(name, variable, heap) {
    const result = TraceToCallStack.getValue(variable, heap);
    result.name = name;
    return result;
  }
}
