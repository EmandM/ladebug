def plus_minus(arr):

    # arr -> array of integers
    # returns: an array of fractions

    positive = []
    negative = []
    zero = []

    for element in arr:
        if (element > 0):
            positive.push(element)
        elif (element < 0):
            negative.push(element)
        else:
            zero.push(element)
            
    total = len(arr)
    result = [total/len(positive), total/len(negative), total/len(zero)]

    return result


args = [-4, 3, -9, 0, 4, 1]
# Half are positive, a third are negative, and one sixth are zeros
correct_result = [0.5, 0.3333333333333333, 0.16666666666666666]

output = plus_minus(args)
print(output)

if output != correct_result:
    raise Exception("Incorrect Output")



'''
  Description:
  Calculate the fraction of positive, negative and zero elements in an array of ints.

  Error lines: 12, 14, 16, 19
'''