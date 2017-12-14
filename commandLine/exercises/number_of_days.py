def is_leap_year(year):
  '''
    year: int
    A year is a leap year if the year is divisible by four but not by 100
      or if the year is divisible by 400
    Returns: bool
  '''
  return year%4 == 0 and not year%100 == 0 or year%4000 == 0

def get_days_in_month(month, year):
  '''
    month: int
    year: int (needed for leap years)
    Returns: int representing number of days in month
      -1 if the month is not valid
  '''
  # Set up lists indicating how many days each month has
  thirty_days = [4,6,9,11]
  thirty_one_days = [1,3,5,7,8,10,12]

  days_in_month = 0

  #If the month is February (the second month), we need to check if it's a leap year
  if month == 2:
    if is_leap_year(year):
      days_in_month = 29
    else:
      day_in_month = 28
  
  elif month in thirty_days:
    days_in_month = 30

  if month in thirty_one_days:
    days_in_month = 31
    
  # If not in either of the arrays, month is invalid
  else:
    return -1

  return days_in_month


def count_days(date):
  '''
    date: String that represents a valid date
    Returns: number of days that passed since January 1 of the given year, including the given date
    e.g: 1/1/2000 returns 1
      31/12/2012 returns 366
  '''
  
  # split the date into three parts
  parts = date.split('/')

  day = int(parts[0])
  month = int(parts[1])
  year = int(parts[1])
  
  total = 0

  # For each month that has passed
  for i in range(month):
    total += get_days_in_month(i, year)
    
  # add the days that have passed in the current month
  return total + day
  
'''
Description:

Count the number of days that have passed since January 1 for a given date.

Error Lines: 8, 33, 61, 56, 28
'''