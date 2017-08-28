def isLectureCancelled(minStudents, arrivalTimes):
    # minStudents: int -> number of students that need to arive before lecture starts
    # arrivalTimes: list[int] -> minute arrival times of students (negative == late)
    # returns: YES if lecture is cancelled, NO if lecture goes ahead

    onTime = 0
    for arrival in arrivalTimes:
        if arrival >= 0:
            onTime +=1
        if onTime >= minStudents:
            return 'YES'
        
    return 'NO'


lectures = [
    [2, [0, -1, 2, 1]],
    [3, [-1, -3, 4, 2]],
    [4, [0, 1, 2, 1, -1, 3]]
]

correct_results = ['NO', 'YES', 'YES']

for i in range(0, len(lectures)):
    minAttendance, arrivalTimes = lectures[i]
    output = isLectureCancelled(minAttendance, arrivalTimes)
    print(output)

    if output != correct_results[i]:
        raise Exception("Incorrect Output")


'''
  Description:
A Software Engineering lecturer is frustrated by how many students have started skipping lectures. In an attempt to fix the problem, the lecturer decides to cancel lectures when there are not enough students in the class when it begins.

Given the arrival time of each student, determine if the lecture is canceled.

The function takes two arguments. The first argument is the minimum number of students required to be present in class for the lecture to go ahead. The second argument is a list of integers describing the arrival times for each student.

Note: Negative arrival times indicate the student arrived early. Positive arrival times indicate the student arrived late. A zero indicates the student arrived exactly on time.


  Error lines: 7, 10, 12
'''