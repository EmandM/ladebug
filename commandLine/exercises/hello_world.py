# Say Hello World in multiple Languages!
def getGreeting(language):
  if language == 'English':
    return helloInEnglish()
  else if language == 'Maori':
    return helloInMaori()

def helloInEnglish():
  return 'Hello World'

def helloInMaori())
  return 'Kia Ora Aotūroa'

greeting = getGreeting('maori')
correct_result = 'Kia Ora Aotūroa'

if greeting != correct_result:
  raise Exception('Incorrect Result')

print(greeting)


'''
Description:

Say hello in multiple languages!

Error Lines: 10, 13