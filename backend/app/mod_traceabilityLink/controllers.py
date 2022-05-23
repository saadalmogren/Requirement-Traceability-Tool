from flask import Blueprint, jsonify, request, abort
from app.mod_traceabilityLink.models import Traceability_Link
from app.mod_traceabilityLink.data_access import storeTraceabilityLink, updateTraceabilityLink, removeTraceabilityLink
from app.mod_project.data_access import retrieveProject, checkTraceabilityLink, checkUser
from app.mod_auth.auth import requires_auth, AuthError
from app.mod_traceabilityLinkChangeRequest.data_access import checkTraceabilityLinkRequest
from app.mod_artifactChangeRequest.data_access import checkArtifactRequest


mod_traceabilityLink = Blueprint('traceabilityLink', __name__)

@mod_traceabilityLink.route('/traceability_links', methods=['POST'])
@requires_auth('Create traceability link')
def create_traceability_link(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'pID' not in body or 'username' not in body or 'tName' not in body or 'tDescription' not in body or 'tType' not in body or 'artifact1' not in body or 'artifact2' not in body:
        abort(422)

    pID = body.get('pID')
    username = body.get('username')
    tName = body.get('tName')
    tDescription = body.get('tDescription')
    tType = body.get('tType')
    artifact1 = body.get('artifact1')
    artifact2 = body.get('artifact2')

    if retrieveProject(pID) is None:
        abort(404)
    
    if not checkUser(username, pID):
        abort(404)

    if not checkTraceabilityLink(pID, artifact1, artifact2, tType):
        abort(422)

    link = Traceability_Link(name = tName, description = tDescription, project_name= pID,created_by= username,traceability_Link_Type = tType, first_artifact = artifact1, second_artifact = artifact2, version=1)

    if not storeTraceabilityLink(link):
        abort(500)
    checkArtifactRequest(artifact1, "", 'The associated artifact has been linked to another artifact')
    checkArtifactRequest(artifact2, "", 'The associated artifact has been linked to another artifact')
    return jsonify({
        'success': True
    })

@mod_traceabilityLink.route('/traceability_links', methods=['PATCH'])
@requires_auth('Modify traceability link')
def modify_traceability_link(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'pID' not in body or 'tID' not in body or 'tName' not in body or 'tDescription' not in body or 'tType' not in body or 'artifact1' not in body or 'artifact2' not in body:
        abort(422)

    pID = body.get('pID')
    tID = body.get('tID')
    tName = body.get('tName')
    tDescription = body.get('tDescription')
    tType = body.get('tType')
    artifact1 = body.get('artifact1')
    artifact2 = body.get('artifact2')

    if retrieveProject(pID) is None:
        abort(404)
    
    if not checkTraceabilityLink(pID, artifact1, artifact2, tType):
        abort(422)

    if not updateTraceabilityLink(tID = tID, tName = tName, tDescription = tDescription, artifact1 = artifact1, artifact2 = artifact2, tType = tType, username=payload):
        abort(500)

    checkTraceabilityLinkRequest(tID)

    return jsonify({
        'success': True
    })

@mod_traceabilityLink.route('/traceability_links', methods=['DELETE'])
@requires_auth('Remove traceability link')
def remove_traceability_link(payload):
    tID = request.args.get('tID', None, type=str)
    if tID is None:
        abort(422)

    if not removeTraceabilityLink(tID):
        abort(404)

    checkTraceabilityLinkRequest(tID)
    return jsonify({
        'success': True
    })