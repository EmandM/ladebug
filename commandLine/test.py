def find_overlap(start1, distance1, start2, distance2):
  if start1 < start2:
    if start1+distance1 <= start2:
      return [None, None]
    elif start2+distance2 <= start1+distance1:
      return [start2, distance2]
    else:
      return [start2, (start1+distance1) - start2]
  elif start1 > start2:
    return find_overlap(start2, distance2, start1, distance1)
  elif start1 == start2:
    return [start1, min(distance1, distance2)]

def better_find_overlap(start1, distance1, start2, distance2):
    # find the highest ("rightmost") start point and lowest ("leftmost") end point
    highest_start_point = max(start1, start2)
    lowest_end_point = min(start1 + distance1, start2 + distance2)

    # return null overlap if there is no overlap
    if highest_start_point >= lowest_end_point: return (None, None)

    # compute the overlap width
    overlap_width = lowest_end_point - highest_start_point

    return (highest_start_point, overlap_width)

def find_intersection(first, second):
  result_x, result_width = better_find_overlap(first['left_x'], first['width'], second['left_x'], second['width'])
  result_y, result_height = better_find_overlap(first['bottom_y'], first['height'], second['bottom_y'], second['height'])
  if result_x == None or result_y == None:
    result_x, result_y, result_width, result_height = [None] * 4

  return {
    'left_x': result_x,
    'bottom_y': result_y,
    'width': result_width,
    'height': result_height
  }

first_rectangle = {
  'left_x': 1,
  'bottom_y': 5,
  'width': 10,
  'height': 4,
}
second_rectangle = {
  'left_x': 4,
  'bottom_y': 7,
  'width': 5,
  'height': 8,
}

print(find_intersection(first_rectangle, second_rectangle))
