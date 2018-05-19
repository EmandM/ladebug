import { isArray, map, toLower } from 'lodash';
import { VarHelper } from '.';
import { ICallStack, IFrame, IPyHeap, IPyVarObj, IVariable, PyHeapVal, PyVar, PyVarType } from '../../types';

export class TraceToCallStack {
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

  public static toStack(frame: IFrame) {
    const callStack: ICallStack[] = map(frame.stack_to_render, stackItem => ({
      id: stackItem.unique_hash,
      name: stackItem.func_name + '()',
      variables: TraceToCallStack.matchReferences(frame.heap, stackItem.encoded_locals),
    }));

    callStack.unshift({
      id: '0',
      name: 'Globals',
      variables: TraceToCallStack.matchReferences(frame.heap, frame.globals),
    });
    return callStack;
  }

  public static matchReferences(heap: IPyHeap, variables: IPyVarObj): IVariable[] {
    // map is built for array type objects, we're using a bit of a hack to use it for objects
    // This hack breaks if there is a key in the object named length (map uses .length internally)
    // Get around this by changing the length value to a string
    let lengthValue;
    let hasLength = false;
    if (variables && variables.hasOwnProperty('length')) {
      hasLength = true;
      lengthValue = variables.length;
      variables.length = 'placeholder';
    }

    const vars = map(variables, (variableValue, variableName) => {
      if (variableName === 'length') {
        variableValue = lengthValue;
      }
      return TraceToCallStack.addNameToVariable(variableName, variableValue, heap);
    });
    if (hasLength) {
      variables.length = lengthValue;
    }
    return vars;
  }

  public static getValue(value: PyVar, heap: IPyHeap): IVariable {
    if (!isArray(value)) {
      if (value === null) {
        return VarHelper.createVariable('None', 'None', true);
      }

      return VarHelper.createVariable(value, typeof value, true);
    }

    let newVal: PyHeapVal;
    if (value[0] === PyVarType.HeapReference) {
      newVal = heap[value[1]];
    }

    let finalValue;
    const type = newVal[0];
    let values = value.slice(1, value.length);

    if (type === PyVarType.Function) {
      // Grab the first value for the function => second value is null
      values = values.slice(0, 1);
    }

    if (type === PyVarType.Dictionary) {
      finalValue = map(values,
        (valueArray => TraceToCallStack.addNameToVariable(valueArray[0], valueArray[1], heap)));
    } else if (type === PyVarType.List || type === PyVarType.Tuple) { // Add index as key
      finalValue = map(values, (variable, index) =>
        // cast index to string for variable name
        TraceToCallStack.addNameToVariable('' + index, variable, heap));
    } else {
      finalValue = map(values, varValue => TraceToCallStack.getValue(varValue, heap));
    }

    return VarHelper.createVariable(finalValue, toLower(type));
  }

  public static addNameToVariable(name: string, variable: PyVar, heap: IPyHeap): IVariable {
    const result = TraceToCallStack.getValue(variable, heap);
    result.name = name;
    return result;
  }
}
