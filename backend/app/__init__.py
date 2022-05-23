from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room

app = Flask(__name__)

app.config.from_object('config')

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET, POST, DELETE, OPTIONS, PATCH')
    response.headers.add('Access-Control-Allow-Origin',
                         '*')
    return response

@socketio.on('join')
def on_join(data):
    username = data['username']
    project = data['project']
    join_room(project)
    socketio.send({"username": username, "message": " has entered the project."}, to=project)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    project = data['project']
    leave_room(project)
    socketio.send({"username": username, "message": " has left the project."}, to=project)

from app.mod_auth.auth import mod_auth as auth_module, AuthError
app.register_blueprint(auth_module)

from app.mod_user.controllers import mod_user as user_module
app.register_blueprint(user_module)

from app.mod_project.controllers import mod_project as project_module
app.register_blueprint(project_module)

from app.mod_visitor.controllers import mod_visitor as visitor_module
app.register_blueprint(visitor_module)

from app.mod_artifact.controllers import mod_artifact as artifact_module
app.register_blueprint(artifact_module)

from app.mod_artifactType.controllers import mod_artifactType as artifactType_module
app.register_blueprint(artifactType_module)

from app.mod_role.controllers import mod_role as role_module
app.register_blueprint(role_module)

from app.mod_role.seed_privileges import seed_privileges
app.register_blueprint(seed_privileges)

from app.mod_traceabilityLinkType.controllers import mod_traceabilityLinkType as traceabilityLinkType_module
app.register_blueprint(traceabilityLinkType_module)

from app.mod_traceabilityLink.controllers import mod_traceabilityLink as traceabilityLink_module
app.register_blueprint(traceabilityLink_module)

from app.mod_artifactChangeRequest.controllers import mod_artifactChangeRequest as artifactChangeRequest_module
app.register_blueprint(artifactChangeRequest_module)

from app.mod_traceabilityLinkChangeRequest.controllers import mod_traceabilityLinkChangeRequest as traceabilityLinkChangeRequest_module
app.register_blueprint(traceabilityLinkChangeRequest_module)

from app.mod_notification.controllers import mod_notification as notifications_module
app.register_blueprint(notifications_module)

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 404,
        'message': 'RESOURCE NOT FOUND!'

    }), 404


@app.errorhandler(422)
def unproccesable(error):
    return jsonify({
        'success': False,
        'error': 422,
        'message': 'UNPROCESSABLE ENTITY!'

    }), 422


@app.errorhandler(405)
def not_allowed(error):
    return jsonify({
        'success': False,
        'error': 405,
        'message': 'METHOD NOT ALLOWED!'

    }), 405

@app.errorhandler(500)
def Internal_Server_Error(error):
    return jsonify({
        'success': False,
        'error': 500,
        'message': 'Internal Server Error'

    }), 500

@app.errorhandler(AuthError)
def auth_error(e):
    return jsonify(e.error), e.status_code