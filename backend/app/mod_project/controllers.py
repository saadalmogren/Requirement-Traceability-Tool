from flask import Blueprint, jsonify, request, abort, make_response
import csv
import io
from app.mod_project.data_access import *
from app.mod_user.data_access import retrieveUser
from app.mod_role.models import Role
from app.mod_auth.auth import requires_auth, AuthError, check_log_in
from app.mod_artifact.models import Artifact
from app.mod_traceabilityLink.models import Traceability_Link
from app.mod_traceabilityLinkType.models import Traceability_Link_Type
from app import socketio




mod_project = Blueprint('project', __name__, url_prefix= '/project')

@mod_project.route('/user', methods=['GET'])
@check_log_in
def get_users(payload):
    pID = request.args.get('pID', None, type=str)

    if pID is None:
        abort(422)
    project = retrieveProject(pID)

    if project is None:
        abort(404)

    return jsonify({
        'success': True,
        'users': [user.username for user in project.users]
    })

@mod_project.route('/user', methods=['POST'])
@requires_auth('Add user to project')
def add_user(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'username' not in body or 'pID' not in body:
        abort(422)

    username = body.get('username')
    pID = body.get('pID')

    user = retrieveUser(username)
    if user is None:
        abort(404)

    if not addUser(user, pID):
        abort(422)
        
    socketio.send({"username": username, "pID": pID, "update": "User"}, to=pID)

    return jsonify({
        'success': True
    })

@mod_project.route('/user', methods=['DELETE'])
@requires_auth('Remove user from project')
def delete_user(payload):
    username = request.args.get('username', None, type=str)
    pID = request.args.get('pID', None, type=str)
    if username is None or pID is None:
        abort(422)

    if not removeUser(username, pID):
        abort(404)

    project = retrieveProject(pID)

    socketio.send({"username": username, "pID": pID, "update" : "User", "message": "You have been removed from " + project.name+"."}, to=pID)

    return jsonify({
        'success': True
    })

@mod_project.route('/leave', methods=['DELETE'])
@check_log_in
def leave_project(username):
    pID = request.args.get('pID', None, type=str)
    if username is None or pID is None:
        abort(422)

    if not removeUser(username, pID):
        abort(404)

    return jsonify({
        'success': True
    })

@mod_project.route('/roles', methods=['GET'])
@requires_auth('View project roles')
def viewRole(payload):
    pID = request.args.get('pID', None, type=str)
    if pID is None:
        abort(422)

    roles = getRoles(pID)



    return jsonify({
        'success': True,
        'roles': [role.format() for role in roles]
    })

# seperate delete privileges from add privileges
@mod_project.route('/user/roles/add', methods=['PATCH'])
@requires_auth('Change user role')
def changrUsersRole_add(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()
    if 'username' not in body or 'roles' not in body or 'pID' not in body:
        return abort(422)
    
    username = body.get('username')
    roles = body.get('roles')
    pID = body.get('pID')
    if not changeUsers_Role_add(pID, username, roles):
        abort(404)  

    socketio.send({"username": username, "pID": pID, "update": "Role", "message": "Your roles have been modified."}, to=pID)


    return jsonify({
        'success': True
    })

@mod_project.route('/user/roles/delete', methods=['PATCH'])
@requires_auth('Change user role')
def changeUsersRole_delete(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()
    if 'username' not in body or 'roles' not in body or 'pID' not in body:
        return abort(422)
    
    username = body.get('username')
    roles = body.get('roles')
    pID = body.get('pID')


    if not changeUsers_Role_delete(pID, username, roles):
        abort(404)
    
    socketio.send({"username": username, "pID": pID, "update": "Role", "message": "Your roles have been modified."}, to=pID)

    return jsonify({
        'success': True
    })

@mod_project.route('/change_management', methods=['PATCH'])
@requires_auth('Change management')
def change_management(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()
    if 'oldUsername' not in body or 'newUsername' not in body or 'pID' not in body:
        return abort(422)
    
    oldUsername = body.get('oldUsername')
    newUsername = body.get('newUsername')
    pID = body.get('pID')

    if not changeManagement(oldUsername, newUsername, pID):
        abort(404)
    project = retrieveProject(pID)
    socketio.send({"username": newUsername, "pID": pID, "update": "Manager", "message": "You are now the manager of "+project.name+" project."}, to=pID)

    return jsonify({
        'success': True
    })


@mod_project.route('/user/roles', methods=['GET'])
@check_log_in
def get_user_roles(payload):
    pID = request.args.get('pID', None, type=str)
    username = request.args.get('username', None, type=str)


    if username is None or pID is None:
        abort(422)

    user = retrieveUser(username)
    if user is None:
        abort(404)
    if not checkUser(username, pID):
        abort(401)
    user_roles = getUserRoles(username, pID)
    roles = [Role.query.get(user_role.role_id) for user_role in user_roles]
    
    return jsonify({
        'username': username,
        'roles': [role.format() for role in roles]
    })

@mod_project.route('/user/privileges', methods=['GET'])
@check_log_in
def get_user_privileges(payload):
    pID = request.args.get('pID', None, type=str)
    username = request.args.get('username', None, type=str)

    privileges=[]

    if username is None or pID is None:
        abort(422)
    
    if not checkUser(username, pID):
        abort(401)
    privileges = getUserPrivileges(username, pID)
    return jsonify({
        'username': username,
        'privileges': privileges
    })


@mod_project.route('/artifact_types', methods=['GET'])
@check_log_in
def view_artifact_types(username):
    pID = request.args.get('pID', None, type=str)

    if pID is None:
        abort(404)
    
    if not checkUser(username, pID):
        abort(401)
        
    if retrieveProject(pID) is None:
        abort(404)
    
    artifact_types = getArtifactTypes(pID)
    return jsonify({
        'success': True,
        'artifact_types': [artifact_type.format() for artifact_type in artifact_types]
    })

@mod_project.route('/artifacts', methods=['GET'])
@check_log_in
def view_artifacts(username):
    pID = request.args.get('pID', None, type=str)

    if pID is None:
        abort(422)

    if not checkUser(username, pID):
        abort(401)
    
    if retrieveProject(pID) is None:
        abort(404)
    
    artifacts = getArtifact(pID)
    return jsonify({
        'success': True,
        'artifacts': [artifact.format() for artifact in artifacts]
    })

@mod_project.route('/traceability_link_types', methods=['GET'])
@check_log_in
def view_traceability_link_types(username):
    pID = request.args.get('pID', None, type=str)

    if pID is None:
        abort(422)

    if not checkUser(username, pID):
        abort(401)

    if retrieveProject(pID) is None:
        abort(404)
    
    link_types = getTraceabilityLinkTypes(pID)
    return jsonify({
        'success': True,
        'traceability_link_types': [link_type.format() for link_type in link_types]
    })

@mod_project.route('/traceability_links', methods=['GET'])
@check_log_in
def view_traceability_links(username):
    pID = request.args.get('pID', None, type=str)

    if pID is None:
        abort(422)
    if not checkUser(username, pID):
        abort(401)

    if retrieveProject(pID) is None:
        abort(404)
    
    links = getTraceabilityLinks(pID)
    return jsonify({
        'success': True,
        'traceability_links': [link.format() for link in links]
    })

@mod_project.route('/artifact_change_requests', methods=['GET'])
@check_log_in
def view_artifact_change_requests(username):
    pID = request.args.get('pID', None, type=str)

    if pID is None:
        abort(422)
    if not checkUser(username, pID):
        abort(401)

    if retrieveProject(pID) is None:
        abort(404)
    
    requests = getArtifactChangeRequests(pID)
    return jsonify({
        'success': True,
        'artifact_change_requests': [request.format() for request in requests]
    })

@mod_project.route('/traceability_link_change_requests', methods=['GET'])
@check_log_in
def view_traceability_link_change_requests(username):
    pID = request.args.get('pID', None, type=str)

    if pID is None:
        abort(422)
    if not checkUser(username, pID):
        abort(401)

    if retrieveProject(pID) is None:
        abort(404)
    
    requests = getTraceabilityLinkChangeRequests(pID)
    return jsonify({
        'success': True,
        'traceability_link_change_requests': [request.format() for request in requests]
    })

@mod_project.route('/artifact_sent_change_requests', methods=['GET'])
@check_log_in
def view_artifact_sent_change_requests(username):
    pID = request.args.get('pID', None, type=str)

    if pID is None:
        abort(422)
    if not checkUser(username, pID):
        abort(401)

    if retrieveProject(pID) is None:
        abort(404)
    
    requests = getArtifactSentChangeRequests(pID, username)
    return jsonify({
        'success': True,
        'artifact_sent_change_requests': [request.format() for request in requests]
    })

@mod_project.route('/traceability_link_sent_change_requests', methods=['GET'])
@check_log_in
def view_traceability_link_sent_change_requests(username):
    pID = request.args.get('pID', None, type=str)

    if pID is None:
        abort(422)
    if not checkUser(username, pID):
        abort(401)

    if retrieveProject(pID) is None:
        abort(404)
    
    requests = getTraceabilityLinkSentChangeRequests(pID, username)
    return jsonify({
        'success': True,
        'traceability_link_sent_change_requests': [request.format() for request in requests]
    })

@mod_project.route('/notifications', methods=['GET'])
@check_log_in
def get_notifications(username):
    
    pID = request.args.get('pID', None, type=str)

    if not checkUser(username, pID):
        abort(401)
    notifications = getUserNotifications(pID, username)
    return jsonify({
        'notifications': [notification.format()for notification in notifications],
        'num_of_notifications': len(notifications)
    })

@mod_project.route('/export_traceability_link_information', methods=['GET'])
@check_log_in
def export_traceability_link_information(username):
    pID = request.args.get('pID', None, type=str)
    if pID is None:
        abort(422)
    if not checkUser(username, pID):
        abort(401)

    if retrieveProject(pID) is None:
        abort(404)
    links_information = getTraceabilityLinksCSV(pID)
    si = io.StringIO()
    cw = csv.writer(si)
    cw.writerows(links_information)
    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = "attachment; filename=traceability_links_information.csv"
    output.headers["Content-type"] = "text/csv"
    return output

@mod_project.route('/export_artifact_information', methods=['GET'])
@check_log_in
def export_artifact_information(username):
    pID = request.args.get('pID', None, type=str)
    if pID is None:
        abort(422)
    if not checkUser(username, pID):
        abort(401)

    if retrieveProject(pID) is None:
        abort(404)
    links_information = getArtifactsCSV(pID)
    si = io.StringIO()
    cw = csv.writer(si)
    cw.writerows(links_information)
    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = "attachment; filename=artifacts_information.csv"
    output.headers["Content-type"] = "text/csv"
    return output

@mod_project.route('/impact_analysis', methods=['GET'])
@check_log_in
def impact_analysis(username):
    pID = request.args.get('pID', None, type=str)
    aID = request.args.get('aID', None, type=str)

    if pID is None or aID is None:
        abort(422)

    if not checkUser(username, pID):
        abort(401)

    if retrieveProject(pID) is None:
        abort(404)
    direct_artifacts = getDirectArtifacts(aID)
    
    indirect_artifacts = performImpactAnalysis(aID, aID, [], [])
    affected_artifacts_percentage = ((len(indirect_artifacts)+len(direct_artifacts)+1)/len(getArtifact(pID)))*100
    return jsonify({
        'direct_artifacts': direct_artifacts,
        'indirect_artifacts': [Artifact.query.get(artifact).name for artifact in indirect_artifacts],
        'affected_artifacts_percentage': round(affected_artifacts_percentage, 2)
    })



@mod_project.route('/test_coverage_analysis', methods=['GET'])
@check_log_in
def test_coverage_analysis(username):
    pID = request.args.get('pID', None, type=str)

    if pID is None:
        abort(422)

    if not checkUser(username, pID):
        abort(401)

    if retrieveProject(pID) is None:
        abort(404)
    covered_artifacts = testCoveredArtifacts(pID)
    uncovered_artifacts = testUncoveredArtifacts(pID)
    covered_artifacts_percentage = (len(covered_artifacts)/(len(covered_artifacts)+len(uncovered_artifacts)))*100
    return jsonify({
        'covered_artifacts': testCoverageFormat(covered_artifacts),
        'uncovered_artifacts': uncovered_artifacts,
        'covered_artifacts_percentage': round(covered_artifacts_percentage, 2)
    })




@mod_project.route('/elaboration_coverage_analysis', methods=['GET'])
@check_log_in
def elaboration_coverage_analysis(username):
    pID = request.args.get('pID', None, type=str)

    if pID is None:
        abort(422)

    if not checkUser(username, pID):
        abort(401)

    if retrieveProject(pID) is None:
        abort(404)
    covered_artifacts = getCoveredNeeds(pID)
    uncovered_artifacts = getUncoveredNeeds(pID)
    covered_artifacts_percentage = (len(covered_artifacts)/(len(covered_artifacts)+len(uncovered_artifacts)))*100
    return jsonify({
        'covered_artifacts': covered_artifacts,
        'uncovered_artifacts': uncovered_artifacts,
        'covered_artifacts_percentage': round(covered_artifacts_percentage, 2)
    })