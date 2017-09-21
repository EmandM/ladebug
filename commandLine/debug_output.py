import py_logger
import json

try:
    import StringIO # NB: don't use cStringIO since it doesn't support unicode!!!
except:
    import io as StringIO # py3

'''
converts python code (sent in as string) to JSON and returns this
as a string
'''
def pythonStringToJson(inputString):
  out_s = StringIO.StringIO()

  def json_finalizer(input_code, output_trace):
    # Add final newline to code
    finalChar = input_code[-1]
    if finalChar != '\n':
      input_code += '\n'

    last_trace = output_trace[-1]
    # Add final execution line for final newline if there is no error
    if 'exception_msg' not in last_trace:
        print('adding output line')
        # Count number of lines in the code
        numLines = input_code.count('\n') + 1
        new_trace = last_trace.copy()
        new_trace['line'] = numLines
        output_trace.append(new_trace)

    # Finalise output
    ret = dict(code=input_code, trace=output_trace)
    json_output = json.dumps(ret, indent=None)
    print(json_output)
    out_s.write(json_output)

  py_logger.exec_script_str_local(inputString,
                                  '',
                                  False,
                                  False,
                                  json_finalizer)

  return out_s.getvalue()

if __name__ == '__main__':
  output = pythonStringToJson('print("hello world")')
  for i in range(10):
    print(i)

  print(output)

