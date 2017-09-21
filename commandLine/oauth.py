from oauth2client import client, crypt
CLIENT_ID = '728044119950-mpcea0183l7c87lflutdide1vfdmvjrb.apps.googleusercontent.com'

def validate_user_id(userId):
    # (Receive token by HTTPS POST)
    if userId == -1:
        return -1

    try:
        idinfo = client.verify_id_token(userId, CLIENT_ID)

        # Or, if multiple clients access the backend server:
        # idinfo = client.verify_id_token(token, None)
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #    raise crypt.AppIdentityError("Unrecognized client.")

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise crypt.AppIdentityError("Wrong issuer.")

            # If auth request is from a G Suite domain:
            # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
            #    raise crypt.AppIdentityError("Wrong hosted domain.")
    except crypt.AppIdentityError:
        return -1

    return idinfo['sub']