from flask import Blueprint, jsonify, request, abort
from app.mod_role.models import Role, roles_privileges, users_roles, Privilege
from app.mod_role.data_access import storeRole, getPrivileges, getRolePrivileges, addPrivileges, deletePrivileges, removeRole, updateRole
from app.mod_project.data_access import checkRole
from app.mod_auth.auth import requires_auth, AuthError
from app import socketio



mod_role = Blueprint('role', __name__)

@mod_role.route('/privileges', methods=['GET'])
def get_privileges():
    privileges = getPrivileges()
    return jsonify({
        'privileges': [privilege.name for privilege in privileges]
    })

@mod_role.route('/role/privileges', methods=['GET'])
def get_role_privileges():
    rName = request.args.get('rName', None, type=str)
    pID = request.args.get('pID', None, type=str)
    if rName is None or pID is None:
        abort(422)
    role = Role.query.filter_by(pID = pID, name = rName).first()
    if role is None:
        abort(404)
    privileges = getRolePrivileges(pID, role.id)
    return jsonify({
        'rName': rName,
        'privileges': [privilege for privilege in privileges]
    })

@mod_role.route('/role', methods=['POST'])
@requires_auth('Create new role')
def createRole(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()
    if 'rName' not in body or 'rPrivileges' not in body or 'pID' not in body:
        return abort(422)
    
    rName = body.get('rName')
    rPrivileges = body.get('rPrivileges')
    pID = body.get('pID')


    if not checkRole(pID, rName, rPrivileges):
        abort(422)

    role = Role(pID = pID, name = rName)
    storeRole(role)
    if not addPrivileges(pID, role.id, rPrivileges):
        role.delete()
        abort(500)
    
    return jsonify({
        'success': True
    })

@mod_role.route('/role', methods=['PATCH'])
@requires_auth('Modify role')
def modifyRole(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()
    if 'rName' not in body or 'pID' not in body or 'rID' not in body:
        abort(422)
    rID = body.get('rID')
    rName = body.get('rName')
    pID = body.get('pID')

    if not updateRole(rID, rName, pID):
        abort(422)
    

    return jsonify({
        'success': True
    })

# seperate delete privileges from add privileges
@mod_role.route('/role/privileges/add', methods=['PATCH'])
@requires_auth('Modify role')
def modifyRole_add(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()
    if 'rID' not in body or 'rPrivileges' not in body or 'pID' not in body:
        abort(422)
    
    rID = body.get('rID')
    rPrivileges = body.get('rPrivileges')
    pID = body.get('pID')

    if not addPrivileges(pID, rID, rPrivileges):
        abort(404)

    socketio.send({"pID": pID, "update": "Role"}, to=pID)

    return jsonify({
        'success': True
    })
@mod_role.route('/role/privileges/delete', methods=['PATCH'])
@requires_auth('Modify role')
def modifyRole_delete(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()
    if 'rID' not in body or 'rPrivileges' not in body or 'pID' not in body:
        abort(422)
    

    rID = body.get('rID')
    rPrivileges = body.get('rPrivileges')
    pID = body.get('pID')

    if not deletePrivileges(pID, rID, rPrivileges):
        abort(404)
    
    socketio.send({"pID": pID, "update": "Role"}, to=pID)


    return jsonify({
        'success': True
    })

@mod_role.route('/role', methods=['DELETE'])
@requires_auth('Remove role')
def remove_role(payload):
    rName = request.args.get('rName', None, type=str)
    pID = request.args.get('pID', None, type=str)
    if rName is None or pID is None:
        abort(422)
    if not removeRole(pID, rName):
        abort(404)
    
    socketio.send({"pID": pID, "update": "Role"}, to=pID)

    return jsonify({
        'success': True
    })