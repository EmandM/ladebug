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

