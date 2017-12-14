# Helper Functions
def isOpenBracket(character):
  return character in ['(', '{', '[', '<']

def isCloseBracket(character):
  return character in [')', '}', ']', '>']

def getCloseBracket(character):
  # dict to find matching bracket
  matching_brackets = { '(':')', '{':'}', '[':']' }
  return matching_brackets.get(character)

def isValidParentheses(arg):
  '''
  :type arg: str
  :rtype: bool
  '''
  unmatched_brackets = []

  for char in arg:
    if isOpenBracket(char):
      unmatched_brackets.append(char)
        
    else:
      # close bracket before open bracket
      if len(unmatched_brackets) < 1:
        return True
            
      # get last bracket in queue
      last = unmatched_brackets[len(unmatched_brackets)]
            
      # get the close bracket that matches the last bracket
      matching = getCloseBracket(char)
            
      if char != matching:
        return False
      else:
        # remove the correctly matched brackets
        unmatched_brackets.pop()
            
  # Return True if all brackets have been matched
  if len(unmatched_brackets) <= 1:
    return True
  else:
    return False

'''
  Description:
Given a string containing brackets, determine if the order of brackets is correct.

  Error lines: 10, 24, 30, 33, 42
'''