from flask import Blueprint, jsonify, request, abort
from app.mod_user.models import User
from jose import jwt
import datetime
from app.mod_user.data_access import checkRegister, storeUser, checkLogin, retrieveProjects

secret = 'learning'
algo = 'HS256'

mod_visitor = Blueprint('visitor', __name__)

@mod_visitor.route('/', methods=['GET'])
def root():
    return jsonify({
        'success': True,
        'Message': 'Welcome to Requirement Traceability Tool'
    })

@mod_visitor.route('/register', methods=['POST'])
def register():
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'username' not in body or 'password' not in body or 'email' not in body:
        return abort(422)

    username = body.get('username')
    password = body.get('password')
    email = body.get('email')

    if checkRegister(username, email):
        new_user = User(username=username, password=password, email=email)
        storeUser(new_user)
    else:
        abort(422)
    
    return jsonify({
        'success': True,
        'username': username
    })


@mod_visitor.route('/login', methods=['POST'])
def login():
    if request.get_json() is None:
        abort(422)

    body = request.get_json()
    if 'username' not in body or 'password' not in body:
        abort(422)

    username = body.get('username')
    password = body.get('password')
    if not checkLogin(username, password):
        abort(401)
    user = User.query.get(username)
    added_hour = datetime.timedelta(hours=6)
    payload = {'name': username, 'exp': datetime.datetime.now()+added_hour}
    encoded_jwt = jwt.encode(payload, secret, algorithm=algo)

    projects = retrieveProjects(username)
    projects_format = [project.format() for project in projects]
    return jsonify({
        'success': True,
        'username': user.username,
        'email': user.email,
        'projects': projects_format,
        'jwt': encoded_jwt
    })