import json
from flask import Blueprint, request, _request_ctx_stack, abort
from functools import wraps
from jose import jwt
from app.mod_project.data_access import getUserPrivileges, checkUser
from app.mod_artifact.models import Artifact

mod_auth = Blueprint('auth', __name__)

algo = 'HS256'  # HMAC-SHA 256
secret = 'learning'
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code

def check_permissions(permission, payload, pID):
    name = payload
    permissions = []
    if not checkUser(name, pID):
        abort(401)
    privileges = getUserPrivileges(name, pID)
    permissions = [privilege['name'] for privilege in privileges] 
    if permission not in permissions:
        abort(401)
    return True

def check_permissions_type(permission, payload, pID, aType):
    name = payload
    if not checkUser(name, pID):
        abort(401)
    privileges = getUserPrivileges(name, pID)
    for privilege in privileges:
        if permission[0] == privilege['name'] or permission[1] == privilege['name'] and aType == privilege['type'] :
            return True
    abort(401)

def get_auth_token():
    auth = request.headers.get('Authorization', None)
    if auth is None:
        abort(401)
    parts = auth.split()
    if parts[0].lower() != 'bearer':
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must start with "Bearer".'
        }, 401)

    elif len(parts) == 1:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Token not found.'
        }, 401)

    elif len(parts) > 2:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must be bearer token.'
        }, 401)
    token = parts[1]
    return token

def verify_decode_jwt(token):
    try:
        decoded_jwt = jwt.decode(token, secret,options={'require': ['exp']}, algorithms = algo)
    except jwt.ExpiredSignatureError:
            raise AuthError({
                'code': 'token_expired',
                'description': 'Token expired.'
            }, 401)
    except Exception:
            raise AuthError({
                'code': 'invalid_header',
                'description': 'Unable to parse authentication token.'
            }, 401)
    return decoded_jwt

def check_log_in(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = get_auth_token()
        name = ''
        if token is not None:
            name = verify_decode_jwt(token)['name']
        

        return f(name, *args, **kwargs)

    return wrapper

def requires_auth(permission=''):
    def requires_auth_decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if request.get_json() is not None:
                pID = request.get_json().get("pID", None)
            else:
                pID = request.args.get("pID", None)
            if pID is None:
                abort(422)
            token = get_auth_token()
            payload = verify_decode_jwt(token)['name']
            check_permissions(permission, payload, pID)
            return f(payload, *args, **kwargs)

        return wrapper
    return requires_auth_decorator

def requires_auth_type(permission=''):
    def requires_auth_decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if request.args:
                pID = request.args.get("pID", None)
                aID = request.args.get("aID", None)
                if pID is None or aID is None:
                    abort(422)
                artifact = Artifact.query.get(aID)
                if artifact is None:
                    abort(404)
                else:
                    aType = artifact.artifact_type
                
            else:
                pID = request.get_json().get("pID", None)
                aID = request.get_json().get("aID", None)
                if aID is None:
                    aType = request.get_json().get("artifact_type", None)
                else:
                    artifact = Artifact.query.get(aID)
                    if artifact is None:
                        abort(404)
                    else:
                        aType = artifact.artifact_type
                if pID is None or aType is None:
                    abort(422)
            token = get_auth_token()
            payload = verify_decode_jwt(token)['name']
            check_permissions_type(permission, payload, pID, aType)
            return f(payload, *args, **kwargs)

        return wrapper
    return requires_auth_decorator