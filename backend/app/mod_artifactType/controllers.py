from flask import Blueprint, jsonify, request, abort
from app.mod_artifactType.models import Artifact_Type
from app.mod_artifactType.data_access import storeArtifactType, updateArtifactType, removeArtifactType
from app.mod_project.data_access import checkArtifactType
from app.mod_auth.auth import requires_auth
mod_artifactType = Blueprint('artifactType', __name__)

@mod_artifactType.route('/artifact_types', methods=['POST'])
@requires_auth('Define new artifact type')
def defineArtifactType(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'aName' not in body or 'aDescription' not in body or 'pID' not in body:
        abort(422)

    aName = body.get('aName')
    aDescription = body.get('aDescription')
    pID = body.get('pID')

    if not checkArtifactType(pID, aName, ''):
        abort(422)
    
    artifact_type = Artifact_Type(name=aName, description=aDescription, project_name=pID)
    if not storeArtifactType(artifact_type):
        abort(422)

    return jsonify({
        'success': True
    })

@mod_artifactType.route('/artifact_types', methods=['PATCH'])
@requires_auth('Modify artifact type')
def modifyArtifactType(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'aID' not in body or 'aName' not in body or 'aDescription' not in body or 'pID' not in body:
        abort(422)

    aID = body.get('aID')
    aName = body.get('aName')
    aDescription = body.get('aDescription')
    pID = body.get('pID')

    if not checkArtifactType(pID, aName, aID):
        abort(422)
    
    if not updateArtifactType(aID, aName, aDescription, pID):
        abort(422)

    return jsonify({
        'success': True
    })

@mod_artifactType.route('/artifact_types', methods=['DELETE'])
@requires_auth('Remove artifact type')
def removeType(payload):
    aID = request.args.get('aID', None, type=str)
    if aID is None:
        abort(422)

    if not removeArtifactType(aID):
        abort(404)

    return jsonify({
        'success': True
    })
