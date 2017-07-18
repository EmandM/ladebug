import py_logger

'''
converts python file (sent in as string name of file) to JSON and returns this
as a string
'''
def pythonFileToJson(inputFile):
  output = ''
  #outputfile = open(os.getcwd() + "/py_output.json", "w")

  def json_finalizer(input_code, output_trace):
    nonlocal output
    ret = dict(code=input_code, trace=output_trace)
    json_output = json.dumps(ret, indent=None) # use indent=None for most compact repr
    output += json_output

  with open (inputFile, "r") as myfile:
    #script_str = myfile.read()
    py_logger.exec_script_str(py_logger.script_str, "", '{"cumulative_mode":false,"heap_primitives":false,"show_only_outputs":false,"origin":"opt-frontend.js"}', json_finalizer)

  return output


'''
converts python code (sent in as string) to JSON and returns this
as a string
'''
def pythonStringToJson(inputString):
  output = ''

  def json_finalizer(input_code, output_trace):
    nonlocal output
    ret = dict(code=input_code, trace=output_trace)
    json_output = json.dumps(ret, indent=None)
    output += json_output

  py_logger.exec_script_str(inputString, "", '{"cumulative_mode":false,"heap_primitives":false,"show_only_outputs":false,"origin":"opt-frontend.js"}', json_finalizer)

  return output
