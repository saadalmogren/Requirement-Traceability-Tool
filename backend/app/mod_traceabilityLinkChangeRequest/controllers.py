from flask import Blueprint, jsonify, request, abort
from app.mod_traceabilityLink.models import Traceability_Link
from app.mod_traceabilityLinkChangeRequest.models import Traceability_Link_Change_Request
from app.mod_traceabilityLinkChangeRequest.data_access import *
from app.mod_auth.auth import requires_auth, AuthError, check_log_in
from app.mod_project.data_access import checkTraceabilityLink, checkUser
from app.mod_notification.data_access import createNotification, createNotification_sent


mod_traceabilityLinkChangeRequest = Blueprint('traceabilityLinkChangeRequest', __name__)

@mod_traceabilityLinkChangeRequest.route('/traceability_link_creation_request', methods=['POST'])
@check_log_in
def make_traceability_link_creation_request(username):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'title' not in body or 'description' not in body or 'request_type' not in body or 'pID' not in body or 'tName' not in body or 'tDescription' not in body or 'tType' not in body or 'artifact1' not in body or 'artifact2' not in body:
        abort(422)

    title = body.get('title')
    description = body.get('description')
    request_type = body.get('request_type')
    pID = body.get('pID')
    tName = body.get('tName')
    tDescription = body.get('tDescription')
    tType = body.get('tType')
    artifact1 = body.get('artifact1')
    artifact2 = body.get('artifact2')

    if request_type != 'Create Traceability Link':
        abort(422)

    if not checkTraceabilityLink(pID, artifact1, artifact1, tType):
        abort(422)
    change_request = Traceability_Link_Change_Request(title=title, description=description, created_by=username, request_type=request_type, status='Pending',
    traceability_link_id=None, traceability_link_name = tName, traceability_link_type=tType, traceability_link_description=tDescription, first_artifact = artifact1, second_artifact= artifact2, project_name=pID)

    if not storeTrcaeabilityLinkChangeRequest(change_request):
        abort(422)
    
    createNotification(None, change_request.id, pID)


    return jsonify({
        'success': True
    })

@mod_traceabilityLinkChangeRequest.route('/traceability_link_modification_request', methods=['POST'])
@check_log_in
def make_traceability_link_modification_request(username):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'title' not in body or 'description' not in body or 'request_type' not in body or 'pID' not in body or 'tID' not in body or 'tName' not in body or 'tDescription' not in body or 'tType' not in body or 'artifact1' not in body or 'artifact2' not in body:
        abort(422)

    title = body.get('title')
    description = body.get('description')
    request_type = body.get('request_type')
    pID = body.get('pID')
    tID = body.get('tID')
    tName = body.get('tName')
    tDescription = body.get('tDescription')
    tType = body.get('tType')
    artifact1 = body.get('artifact1')
    artifact2 = body.get('artifact2')

    if request_type != 'Modify Traceability Link':
        abort(422)

    if not checkTraceabilityLink(pID, artifact1, artifact1, tType):
        abort(422)
    
    link = Traceability_Link.query.get(tID)
    if link is None:
        abort(404)
    
    change_request = Traceability_Link_Change_Request(title=title, description=description, created_by=username, request_type=request_type, status='Pending',
    traceability_link_id=tID, traceability_link_name = tName, traceability_link_type=tType, traceability_link_description= tDescription, first_artifact = artifact1, second_artifact= artifact2, project_name=pID)

    if not storeTrcaeabilityLinkChangeRequest(change_request):
        abort(422)

    createNotification(None, change_request.id, pID)


    return jsonify({
        'success': True
    })

@mod_traceabilityLinkChangeRequest.route('/traceability_link_deletion_request', methods=['POST'])
@check_log_in
def make_traceability_link_deletion_request(username):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'title' not in body or 'description' not in body or 'request_type' not in body or 'pID' not in body or 'tID' not in body:
        abort(422)

    title = body.get('title')
    description = body.get('description')
    request_type = body.get('request_type')
    tID = body.get('tID')
    pID = body.get('pID')
    

    if request_type != 'Remove Traceability Link':
        abort(422)
    
    link = Traceability_Link.query.get(tID)
    if link is None:
        abort(404)
    
    change_request = Traceability_Link_Change_Request(title=title, description=description, created_by=username, request_type=request_type, status='Pending',
    traceability_link_id=tID, traceability_link_name = link.name, traceability_link_type=link.traceability_Link_Type, traceability_link_description=link.description, first_artifact = link.first_artifact, second_artifact= link.second_artifact, project_name=pID)

    if not storeTrcaeabilityLinkChangeRequest(change_request):
        abort(422)

    createNotification(None, change_request.id, pID)


    return jsonify({
        'success': True
    })



@mod_traceabilityLinkChangeRequest.route('/accept_traceability_link_request', methods=['POST'])
@requires_auth('View, accept, and reject change request')
def accept_traceability_link_request(username):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'id' not in body:
        abort(422)

    id = body.get('id')

    change_request = Traceability_Link_Change_Request.query.get(id)
    if change_request is None:
        abort(404)
    
    if change_request.request_type == 'Create Traceability Link':
        accept_traceabilit_link_creation_request(change_request)
    elif change_request.request_type == 'Modify Traceability Link':
        accept_traceabilit_link_modification_request(change_request)
    elif change_request.request_type == 'Remove Traceability Link':
        accept_traceabilit_link_deletion_request(change_request)
    else:
        abort(500)
    
    change_request.status = 'Accepted'
    change_request.update()
    if username != change_request.created_by:
        createNotification_sent(None, change_request.id, change_request.created_by, change_request.project_name)

    return jsonify({
        'success': True
    })

@mod_traceabilityLinkChangeRequest.route('/reject_traceability_link_request', methods=['POST'])
@requires_auth('View, accept, and reject change request')
def reject_traceability_link_request(username):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'id' not in body or 'reject_reason' not in body:
        abort(422)

    id = body.get('id')
    reject_reason = body.get('reject_reason')

    change_request = Traceability_Link_Change_Request.query.get(id)
    if change_request is None:
        abort(404)
        
    if change_request.status != 'Pending':
        abort(422)

    if not reject_traceabilit_link_request(change_request, reject_reason):
        abort(500)
    
    change_request.status = 'Rejected'
    change_request.update()
    if username != change_request.created_by:
        createNotification_sent(None, change_request.id, change_request.created_by, change_request.project_name)

    return jsonify({
        'success': True
    })

@mod_traceabilityLinkChangeRequest.route('/traceability_link_request', methods=['DELETE'])
@check_log_in
def delete_traceability_link_request(username):
    id = request.args.get('id', None, type=str)
    if id is None:
        abort(422)


    change_request = Traceability_Link_Change_Request.query.get(id)
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