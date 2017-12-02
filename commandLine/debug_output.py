import py_logger
import json
import tests

try:
    import StringIO  # NB: don't use cStringIO since it doesn't support unicode!!!
except:
    import io as StringIO  # py3


'''
converts python code (sent in as string) to JSON and returns this
as a string
'''
def pythonStringToJson(input_string, entry_function, test_cases):
    test_cases = tests.load(test_cases)
    out_s = StringIO.StringIO()
    test_s = ''

    if entry_function is not None and test_cases is not None:
        test_s = tests.get_test_string(test_cases, entry_function)

    def json_finalizer(input_code, output_trace):
        input_code, output_trace = tests.format_output(test_s, test_cases, input_code, output_trace)

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
