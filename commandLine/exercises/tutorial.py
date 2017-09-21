'''
  Use the column on the far left to 'flag' lines in the code that contain errors.
  Find and flag an error line, then click the Fix Errors tabs above to edit the code.
  Once you've fixed the error, click the Flag Errors tab to go back and run your code.
  When all errors are fixed, submit your solution below.
  For more hints, read the comments below.
'''

# 'def function_name():' defines a function in python. The line below is missing ()
def count_to_five:
  result = []

  # Set a breakpoint by clicking on the column to the left of the line number. 
  # Try this on line 21.
  # Now, click the run/play button below and code execution will stop on the breakpoint.
  # Check the value of stored variables at this line in the global variables card.
  # You can use the step forward and step backward buttons on either side of the 
  #   run/play button to move step by step through the code, and check the variables 
  #   at each line.
  for i in range(0, 5):
    result.append(i)

  return result

output = count_to_five()
correct_result = [1, 2, 3, 4, 5]

print(output)

if output != correct_result:
    raise Exception("Incorrect Output")


'''
Description:

This is a tutorial on how to use Ladebug.

Read the comments above to solve the tutorial exercise.

Error Lines: 10, 20
'''