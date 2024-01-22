from google.oauth2 import id_token
from google.auth.transport import requests
# from google.auth.transport.requests import Request

CLIENT_ID = '728044119950-mpcea0183l7c87lflutdide1vfdmvjrb.apps.googleusercontent.com'

def validate_user_id(userId):
    print('validating id')
    # (Receive token by HTTPS POST)
    if userId == -1:
        print('USER ID ENTERED AS -1')
        return -1

    try:
        idinfo = id_token.verify_oauth2_token(userId, requests.Request(), CLIENT_ID)
        print("info", idinfo)

        # Or, if multiple clients access the backend server:
        # idinfo = client.verify_id_token(token, None)
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #    raise crypt.AppIdentityError("Unrecognized client.")

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError

            # If auth request is from a G Suite domain:
            # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
            #    raise crypt.AppIdentityError("Wrong hosted domain.")
    except ValueError:
        print('USER ID PARSED TO -1')
        return -1

    # return -1
    return idinfo['sub']