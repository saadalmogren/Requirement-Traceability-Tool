from flask import Blueprint, jsonify, request, abort
from app.mod_artifact.models import Artifact
from app.mod_artifactType.models import Artifact_Type
from app.mod_artifact.data_access import storeArtifact, updateArtifact, removeArtifact
from app.mod_project.data_access import checkArtifact
from app.mod_auth.auth import requires_auth, requires_auth_type
from app.mod_artifactChangeRequest.data_access import checkArtifactRequest
from app.mod_traceabilityLinkChangeRequest.data_access import checkTraceabilityLinkRequest_artifact




mod_artifact = Blueprint('artifact', __name__)

@mod_artifact.route('/artifact', methods=['POST'])
@requires_auth_type(['Create artifact', 'Create artifact of a specific type'])
def createArtifact(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'aName' not in body or 'aDescription' not in body or 'artifact_type' not in body or 'username' not in body or 'pID' not in body:
        abort(422)

    aName = body.get('aName')
    aDescription = body.get('aDescription')
    artifact_type = body.get('artifact_type')
    username = body.get('username')
    pID = body.get('pID')

    if not checkArtifact(pID, aName, ''):
        abort(422)
    
    artifact = Artifact(name = aName, description = aDescription, artifact_type=artifact_type, created_by = username, version=1, project_name=pID)

    if not storeArtifact(artifact):
        abort(404)
    
    checkArtifactRequest('', artifact.name)


    return jsonify({
        'success': True
    })

@mod_artifact.route('/artifact', methods=['PATCH'])
@requires_auth_type(['Modify artifact', 'Modify artifact of a specific type'])
def modifyArtifact(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'aID' not in body or 'aName' not in body or 'aDescription' not in body or 'artifact_type' not in body or 'username' not in body or 'pID' not in body:
        abort(422)
    
    aID = body.get('aID')
    aName = body.get('aName')
    aDescription = body.get('aDescription')
    artifact_type = body.get('artifact_type')
    pID = body.get('pID')

    if not checkArtifact(pID, aName, aID):
        abort(422)

    if not updateArtifact(aID, aName, aDescription, artifact_type, pID, payload):
        abort(404)

    checkArtifactRequest(aID, aName)
    checkTraceabilityLinkRequest_artifact(aID)

    return jsonify({
        'success': True
    })

@mod_artifact.route('/artifact', methods=['DELETE'])
@requires_auth_type(['Remove artifact', 'Remove artifact of a specific type'])
def remove_Artifact(payload):
    aID = request.args.get('aID', None, type=str)
    if aID is None:
        abort(422)

    if not removeArtifact(aID):
        abort(404)

    checkArtifactRequest(aID, '')
    checkTraceabilityLinkRequest_artifact(aID)


    return jsonify({
        'success': True
    })