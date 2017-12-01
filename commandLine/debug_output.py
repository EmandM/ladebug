import py_logger
import json

try:
    import StringIO  # NB: don't use cStringIO since it doesn't support unicode!!!
except:
    import io as StringIO  # py3

'''
converts python code (sent in as string) to JSON and returns this
as a string
'''


def pythonStringToJson(input_string, entry_function, test_cases):
    out_s = StringIO.StringIO()
    test_s = ''

    if entry_function is not None and test_cases is not None:
        inputs = [d['input'] for d in test_cases]
        expected_out = [d['expectedOutput'] for d in test_cases]
        test_s = '''
args = {}
expected_outputs = {}

for i in range({}):
    arg = args[i]
    expected_result = expected_outputs[i]
    
    output = {}(arg)
    print(output)
    
    if output != expected_result:
        raise Exception("Incorrect Output")
'''.format(str(inputs), str(expected_out), len(test_cases), entry_function)

    def json_finalizer(input_code, output_trace):
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
