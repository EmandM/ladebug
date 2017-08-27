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

array1Sort = mergeSort(array1)
array2Sort = mergeSort(array2)
array1.sort()
array2.sort()

print(array1Sort)
print(array2Sort)

if array1 != array1Sort or array2 != array2Sort:
  raise Exception("Incorrect Output")
