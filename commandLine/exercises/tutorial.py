'''
  Use the column on the left to 'flag' errors in the code
  Once an error is found, change tabs above to fix the error
  Once fixed, change tabs again to run the new code
  When all errors are fixed, submit your solution below
'''

# 'def function_name():' defines a function in python. The line below is missing ()
def count_to_five:
  result = []

  # Set a breakpoint by clicking on the line number. Run the code and it will stop on the breakpoint
  # Use the variable inspector to your right shows the value that variables hold
  for i in range(0, 5):
    result.append(i)

  return result

output = count_to_five()
correct_result = [1, 2, 3, 4, 5]

print(output)

if output == correct_result:
  raise Exception("Incorrect Output")


'''
Description:

This is a tutorial on how to use Ladebug.

Read the comments above to solve the tutorial exercise.

Error Lines: 9, 14, 15