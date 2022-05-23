from flask import Blueprint, jsonify, request, abort
from app.mod_user.models import User
import datetime
from app.mod_user.data_access import retrieveUser, updateAccountInformation
from app import bcrypt
from app.mod_project.models import Project, users_project
from app.mod_role.models import Role

from app.mod_user.data_access import retrieveUser, retrieveProjects
from app.mod_project.data_access import storeProject, retrieveProject, updateProject, removeProject, changeUsers_Role_add, checkUser
from app.mod_role.data_access import storeRole, addPrivileges, getPrivileges
from app.mod_artifactType.seed_types import seed_types
from app.mod_traceabilityLinkType.seed_link_types import seed_link_types
from app.mod_auth.auth import requires_auth, check_log_in




mod_user = Blueprint('user', __name__)



@mod_user.route('/modify_account_information/<string:username>', methods=['POST'])
@check_log_in
def modifyAccountInformation(payload, username):
    if request.get_json() is None:
        abort(422)

    body = request.get_json()
    
    email = body.get('email')
    password = body.get('password')
    user = retrieveUser(payload)

    if password is not None:
        user.password = bcrypt.generate_password_hash(password).decode('utf-8')

    user.email = email
    if not updateAccountInformation(user):
        abort(422)

    return jsonify({
        'success': True,
        'email': user.email
    })

@mod_user.route('/projects', methods=['GET'])
@check_log_in
def get_projects(username):

    if username is None:
        abort(422)

    projects = retrieveProjects(username)
    projects_format = [project.format() for project in projects]
    return jsonify({
        'username': username,
        'projects': projects_format
    })


@mod_user.route('/projects', methods=['POST'])
@check_log_in
def createProject(username):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()
    if 'name' not in body or 'description' not in body or 'username' not in body:
        return abort(422)
    
    name = body.get('name')
    description = body.get('description')

    user = retrieveUser(username)
    if user is None:
        abort(404)
    else:
        
        project = Project(name = name, description = description, manager = username)
        if not storeProject(project):
            abort(400)
        try:
            
            user_project = users_project(p_id = project.id, username = user.username)
            user_project.insert()
            role = Role(name = "Project Manager", pID = project.id)
            storeRole(role)
            privileges = [{"name": privilege.name, "type": None} for privilege in getPrivileges()]
            addPrivileges(project.id, role.id, privileges)
            changeUsers_Role_add(project.id, username, [role.name])
        except:
            project.delete()
            abort(500)
        seed_types(project.id)
        
        if not seed_link_types(project.id):
            project.delete()
            abort(500)
        
    return jsonify({
        'success': True
        # project details
    })

@mod_user.route('/projects', methods=['PATCH'])
@requires_auth('Modify project information')
def modifyProject(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()
    if 'pID' not in body:
        return abort(422)
    
    pID = body.get('pID')
    name = body.get('name')
    description = body.get('description')
    username = body.get('username')

    if name is None:
        abort(422)

    if not updateProject(pID, name, description):
        abort(404)

    projects = retrieveProjects(username)
    projects_format = [project.format() for project in projects]

    return jsonify({
        'success': True,
        'projects': projects_format
    })
@mod_user.route('/projects/<string:pID>', methods=['GET'])
@check_log_in
def viewProjectDetails(username, pID):
    project = retrieveProject(pID)

    if not checkUser(username, pID):
        abort(401)

    if project is None:
        abort(404)
    
    return jsonify({
        'project_details':project.format()
    })

@mod_user.route('/projects/<string:pID>', methods=['DELETE'])
@check_log_in
def deleteProject(username, pID):
    if username is None:
        abort(422)
    project = retrieveProject(pID)
    if project is None:
        abort(404)
    if username != project.manager:
        abort(401)
    if not removeProject(pID):
        abort(404)

    projects = retrieveProjects(username)
    projects_format = [project.format() for project in projects]

    return jsonify({
        'success': True,
        'projects': projects_format
    })


