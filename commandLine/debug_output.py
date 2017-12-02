import py_logger
import json
import numbers

try:
    import StringIO  # NB: don't use cStringIO since it doesn't support unicode!!!
except:
    import io as StringIO  # py3

# takes val and type, returns tuple val and type
# used to parse json type data and
def load_value(val):
    new_val = eval(val)

    # custom type names to match those given by the py_tutor code
    if isinstance(new_val, numbers.Number):
        return new_val, 'number'

    val_type = type(new_val)
    if val_type is bool:
        return new_val, 'boolean'
    if val_type is str:
        return new_val, 'string'

    # else return type name
    return new_val, val_type.__name__

def load_test_cases(json_test_cases):
    test_cases = json.loads(json_test_cases)
    for i in range(len(test_cases)):
        test_case = test_cases[i]
        test_case["input"], test_case["input_type"] = load_value(test_case.get("input"))
        test_case["expected_output"], test_case["output_type"] = load_value(test_case.get("expected_output"))

    return test_cases

def removeTestsFromOutput(test_code, test_cases, input_code, output_trace):
    test_code_len = len(test_code.split('\n'))

    split_input = input_code.split('\n')
    split_input_without_test = split_input[:(len(split_input) - test_code_len)]
    input_len = len(split_input_without_test)

    new_output = [trace for trace in output_trace if "line" not in trace or trace["line"] <= input_len]

    # If anything has been dropped, drop first line of output
    if len(output_trace) != len(new_output):
        new_output.pop(0)

    last_trace = output_trace[-1]
    new_trace = last_trace.copy()
    new_trace['line'] = input_len + 1
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


'''
converts python code (sent in as string) to JSON and returns this
as a string
'''


def pythonStringToJson(input_string, entry_function, test_cases):
    test_cases = load_test_cases(test_cases)
    out_s = StringIO.StringIO()
    test_s = ''

    if entry_function is not None and test_cases is not None:
        inputs = [d['input'] for d in test_cases]
        expected_out = [d['expected_output'] for d in test_cases]
        print("Inputs: " + str(inputs) + ", Outputs: " + str(expected_out))
        test_s = '''
tests = {}
expected_outputs = {}

for test_num in range({}):
    current_test = tests[test_num]
    expected_result = expected_outputs[test_num]

    output = {}(current_test)
    print(output)
    
    if output != expected_result:
        raise Exception("Incorrect Output")
'''.format(str(inputs), str(expected_out), len(test_cases), entry_function)

    def json_finalizer(input_code, output_trace):
        input_code, output_trace = removeTestsFromOutput(test_s, test_cases, input_code, output_trace)
        # Add final newline to code
        finalChar = input_code[-1]
        if finalChar != '\n':
            input_code += '\n'

        last_trace = output_trace[-1]
        # Add final execution line for final newline if there is no error
        if 'exception_msg' not in last_trace:
            # Count number of lines in the code
            numLines = input_code.count('\n') + 1
            new_trace = last_trace.copy()
            new_trace['line'] = numLines
            output_trace.append(new_trace)

        # Finalise output
        ret = dict(code=input_code, trace=output_trace)
        json_output = json.dumps(ret, indent=None)
        out_s.write(json_output)

    py_logger.exec_script_str_local(input_string + test_s,
                                    '',
                                    False,
                                    False,
                                    json_finalizer)

    return out_s.getvalue()


if __name__ == '__main__':
    output = pythonStringToJson('def test(): print("hello world")', 'test',
                                [{'expectedOutput': '1 2 3 4', 'input': '4 3 2 1'}])
    print(output)
