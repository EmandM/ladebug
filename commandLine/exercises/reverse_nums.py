def reverse_nums(array):
    # array: string containing space seperated integers
    # returns: the original string with the numbers in reverse order

    num_array = list(array)
    result = ''

    for i in range(len(num_array), 0, -1):
        result + num_array[i]

    # strip any extra spaces from the result
    return result.strip()


args = ['1 4 3 2', '3 6 9 12']
correct_results = ['2 3 4 1', '12 9 6 3']

for i in range(2):
    arg = args[i]
    output = reverse_nums(arg)
    print(output)

    if output != correct_results[i]:
        raise Exception("Incorrect Output")




'''
Description:
Reverse an array of space separated integers.

eg: '3 6 9 12' becomes '12 9 6 3'
hint: try string.split()

  Error lines: 5, 8, 9

  NOTE: It is possible to solve this without changing line 8
'''