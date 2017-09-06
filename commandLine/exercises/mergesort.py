def mergeSort(arr):
    if len(arr) <= 1:
        return arr

    # a//b is floor division
    mid = len(arr)//2
    first = mergeSort(arr[:mid])
    second = mergeSort(arr[mid:])

    firstIterator = secondIterator = 0
    result = []
    while firstIterator < len(first) and secondIterator <= len(second):
        if (first[firstIterator] <= second[secondIterator]):
            result.append(first[firstIterator])
            firstIterator += 1
        else:
            result.append(second[secondIterator])
            secondIterator += 1

    result += first[firstIterator:]
    result += second[secondIterator:]

    return result

array1 = [1,2,3,4,5,6,7,8,9]
array2 = [3,5,2,4,1]

array1MergeSorted = mergeSort(array1)
array2MergeSorted = mergeSort(array2)
array1.sort()
array2.sort()

print(array1MergeSorted)
print(array2MergeSorted)

if array1 != array1MergeSorted or array2 != array2MergeSorted:
  raise Exception("Incorrect Output")




'''
Description:
Perform mergesort on two arrays.

eg: [3, 5, 2, 4, 1] becomes [1, 2, 3, 4, 5]

Error line: 12
'''