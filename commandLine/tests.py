# takes val and type, returns tuple val and type
# used to parse json type data and
from flask import json
import numbers


def load_value(val):
    new_val = eval(val)

    # custom type names to match those given by the py_tutor code
    if isinstance(new_val, bool):
        return new_val, 'boolean'

    if isinstance(new_val, numbers.Number):
        return new_val, 'number'

    if isinstance(new_val, str):
        return new_val, 'string'

    if new_val is None:
        return new_val, 'None'
    
    # else return type name
    return new_val, type(new_val).__name__


def load(json_test_cases):
    if json_test_cases is None:
        return

    test_cases = json.loads(json_test_cases)
    for i in range(len(test_cases)):
        test_case = test_cases[i]
        test_case["input"], test_case["input_type"] = load_value(test_case.get("input"))
        test_case["expected_output"], test_case["output_type"] = load_value(test_case.get("expected_output"))

    return test_cases


def add_types(json_test_cases):
    test_cases = json.loads(json_test_cases)

    for i in range(len(test_cases)):
        test_case = test_cases[i]
        input_val, test_case["input_type"] = load_value(test_case.get("input"))
        output_val, test_case["output_type"] = load_value(test_case.get("expected_output"))

    return json.dumps(test_cases)


def get_test_string(test_cases, entry_function):
    inputs = [d['input'] for d in test_cases]
    expected_out = [d['expected_output'] for d in test_cases]
    print("Inputs: " + str(inputs) + ", Outputs: " + str(expected_out))
    test_string = '''
tests = {0}
expected_outputs = {1}

for test_num in range({2}):
    current_test = tests[test_num]
    expected_result = expected_outputs[test_num]

    print('---- Test ' + str(test_num + 1) + ' of {2} ----')
    output = {3}(current_test)
    print('{3}(' + str(repr(current_test)) + ') => ' + str(output) + '\\n')
    
    
    if output != expected_result:
        raise Exception("Incorrect Output")
        
print('---- All Tests Passed ----')

'''.format(str(inputs), str(expected_out), len(test_cases), entry_function)
    return test_string


def format_output(test_code, test_cases, input_code, output_trace):
    test_code_len = len(test_code.split('\n')) - 1

    split_input = input_code.split('\n')
    split_input_without_test = split_input[:(len(split_input) - test_code_len)]
    input_len = len(split_input_without_test)

    new_output = [trace for trace in output_trace if "line" not in trace or trace["line"] < input_len]

    last_trace = output_trace[-1]
    new_trace = last_trace.copy()
    new_trace['line'] = input_len
    new_output.append(new_trace)

    for trace in new_output:
        # assign globals to a variable for ease of use.
        global_vals = trace.get("globals")

        test_num = 0 if global_vals is None else global_vals.get("test_num")
        test_num = 0 if test_num is None else test_num

        trace["current_test"] = {
            "input": test_cases[test_num].get("input"),
            "input_type": test_cases[test_num].get("input_type"),
            "expected_output": test_cases[test_num].get("expected_output"),
            "output_type": test_cases[test_num].get("output_type"),
            "test_num": test_num
        }

        if global_vals is None:
            continue

        # Remove all global vars relating to tests
        global_vals.pop("tests", None)
        global_vals.pop("expected_outputs", None)
        global_vals.pop("current_test", None)
        global_vals.pop("expected_result", None)
        global_vals.pop("test_num", None)
        global_vals.pop("output", None)

    return ['\n'.join(split_input_without_test), new_output]