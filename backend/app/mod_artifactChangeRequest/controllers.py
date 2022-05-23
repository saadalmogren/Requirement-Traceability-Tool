from flask import Blueprint, jsonify, request, abort
from app.mod_artifactChangeRequest.models import Artifact_Change_Request
from app.mod_artifactChangeRequest.data_access import *
from app.mod_project.data_access import checkArtifact, checkUser
from app.mod_artifact.models import Artifact
from app.mod_auth.auth import requires_auth, AuthError, check_log_in
from app.mod_notification.data_access import createNotification, createNotification_sent

mod_artifactChangeRequest = Blueprint('artifactChangeRequest', __name__)



@mod_artifactChangeRequest.route('/artifact_creation_request', methods=['POST'])
@check_log_in
def make_artifact_creation_request(username):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'title' not in body or 'description' not in body or 'request_type' not in body or 'pID' not in body or 'aName' not in body or 'aDescription' not in body or 'artifact_type' not in body:
        abort(422)

    title = body.get('title')
    description = body.get('description')
    request_type = body.get('request_type')
    aName = body.get('aName')
    aDescription = body.get('aDescription')
    artifact_type = body.get('artifact_type')
    pID = body.get('pID')

    if request_type != 'Create Artifact':
        abort(422)

    if not checkArtifact(pID, aName, ''):
        abort(422)
    change_request = Artifact_Change_Request(title=title, description=description, created_by=username, request_type=request_type, status='Pending',
    artifact_id=None, artifact_name = aName, artifact_type=artifact_type, artifact_description=aDescription, project_name=pID)

    if not storeArtifactChangeRequest(change_request):
        abort(422)
    
    createNotification(change_request.id, None, pID)

    return jsonify({
        'success': True
    })

@mod_artifactChangeRequest.route('/artifact_modification_request', methods=['POST'])
@check_log_in
def make_artifact_modification_request(username):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'title' not in body or 'description' not in body or 'request_type' not in body or 'pID' not in body or 'aID' not in body or 'aName' not in body or 'aDescription' not in body or 'artifact_type' not in body:
        abort(422)

    title = body.get('title')
    description = body.get('description')
    request_type = body.get('request_type')
    aID = body.get('aID')
    aName = body.get('aName')
    aDescription = body.get('aDescription')
    artifact_type = body.get('artifact_type')
    username = body.get('username')
    pID = body.get('pID')

    if request_type != 'Modify Artifact':
        abort(422)

    if not checkArtifact(pID, aName, aID):
        abort(422)
    
    artifact = Artifact.query.get(aID)
    if artifact is None:
        abort(404)
    
    change_request = Artifact_Change_Request(title=title, description=description, created_by=username, request_type=request_type, status='Pending',
    artifact_id=aID, artifact_name = aName, artifact_type=artifact_type, artifact_description=aDescription, project_name=pID)

    if not storeArtifactChangeRequest(change_request):
        abort(422)
    
    createNotification(change_request.id, None, pID)
    
    return jsonify({
        'success': True
    })

@mod_artifactChangeRequest.route('/artifact_deletion_request', methods=['POST'])
@check_log_in
def make_artifact_deletion_request(username):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'title' not in body or 'description' not in body or 'request_type' not in body or 'pID' not in body or 'aID' not in body:
        abort(422)

    title = body.get('title')
    description = body.get('description')
    request_type = body.get('request_type')
    aID = body.get('aID')
    pID = body.get('pID')
    

    if request_type != 'Remove Artifact':
        abort(422)
    
    artifact = Artifact.query.get(aID)
    if artifact is None:
        abort(404)
    
    change_request = Artifact_Change_Request(title=title, description=description, created_by=username, request_type=request_type, status='Pending',
    artifact_id=aID, artifact_name = artifact.name, artifact_type=artifact.artifact_type, artifact_description=artifact.description, project_name=pID)

    if not storeArtifactChangeRequest(change_request):
        abort(422)
    
    createNotification(change_request.id, None, pID)

    return jsonify({
        'success': True
    })



@mod_artifactChangeRequest.route('/accept_artifact_request', methods=['POST'])
@requires_auth('View, accept, and reject change request')
def accept_artifact_request(username):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'id' not in body:
        abort(422)

    id = body.get('id')

    change_request = Artifact_Change_Request.query.get(id)
    if change_request is None:
        abort(404)
    
    if change_request.request_type == 'Create Artifact':
        accept_artifact_creation_request(change_request)
    elif change_request.request_type == 'Modify Artifact':
        accept_artifact_modification_request(change_request)
    elif change_request.request_type == 'Remove Artifact':
        accept_artifact_deletion_request(change_request)
    else:
        abort(500)
    
    change_request.status = 'Accepted'
    change_request.update()
    if username != change_request.created_by:
        createNotification_sent(change_request.id, None, change_request.created_by, change_request.project_name)
    return jsonify({
        'success': True
    })

@mod_artifactChangeRequest.route('/reject_artifact_request', methods=['POST'])
@requires_auth('View, accept, and reject change request')
def reject_artifact_change_request(username):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'id' not in body or 'reject_reason' not in body:
        abort(422)

    id = body.get('id')
    reject_reason = body.get('reject_reason')

    change_request = Artifact_Change_Request.query.get(id)
    if change_request is None:
        abort(404)
    
    if change_request.status != 'Pending':
        abort(422)
    
    if not reject_artifact_request(change_request, reject_reason):
        abort(500)
    
    change_request.status = 'Rejected'
    change_request.update()
    if username != change_request.created_by:
        createNotification_sent(change_request.id, None, change_request.created_by, change_request.project_name)

    return jsonify({
        'success': True
    })

@mod_artifactChangeRequest.route('/artifact_request', methods=['DELETE'])
@check_log_in
def delete_artifact_request(username):
    id = request.args.get('id', None, type=str)
    if id is None:
        abort(422)


    change_request = Artifact_Change_Request.query.get(id)
    if not checkUser(username, change_request.project_name):
        abort(401)

    if change_request is None:
        abort(404)
    
    if change_request.status != 'Pending':
        abort(422)
        
    change_request.delete()

    return jsonify({
        'success': True
    })
