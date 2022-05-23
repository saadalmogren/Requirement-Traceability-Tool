from flask import Blueprint, jsonify, request, abort
from app.mod_project.data_access import retrieveProject, checkTraceabilityLinkType
from app.mod_traceabilityLinkType.models import Traceability_Link_Type
from app.mod_traceabilityLinkType.data_access import storeTraceabilityLinkType, updateTraceabilityLinkType, removeTraceabilityLinkType
from app.mod_auth.auth import requires_auth, AuthError



mod_traceabilityLinkType = Blueprint('traceabilityLinkType', __name__)

@mod_traceabilityLinkType.route('/traceability_link_types', methods=['POST'])
@requires_auth('Define new traceability link type')
def create_traceability_link_type(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'pID' not in body or 'tName' not in body or 'tDescription' not in body or 'artifactType1' not in body or 'artifactType2' not in body:
        abort(422)

    pID = body.get('pID')
    tName = body.get('tName')
    tDescription = body.get('tDescription')
    artifactType1 = body.get('artifactType1')
    artifactType2 = body.get('artifactType2')

    if retrieveProject(pID) is None:
        abort(404)

    if not checkTraceabilityLinkType(pID, artifactType1, artifactType2):
        abort(422)

    link = Traceability_Link_Type(name = tName, description = tDescription, project_name= pID, first_artifact_type = artifactType1, second_artifact_type = artifactType2)
    if not storeTraceabilityLinkType(link):
        abort(500)

    return jsonify({
        'success': True
    })

@mod_traceabilityLinkType.route('/traceability_link_types', methods=['PATCH'])
@requires_auth('Modify traceability link type')
def modify_traceability_link_type(payload):
    if request.get_json() is None:
        abort(422)
    body = request.get_json()

    if 'pID' not in body or 'tID' not in body or 'tName' not in body or 'tDescription' not in body or 'artifactType1' not in body or 'artifactType2' not in body:
        abort(422)

    pID = body.get('pID')
    tID = body.get('tID')
    tName = body.get('tName')
    tDescription = body.get('tDescription')
    artifactType1 = body.get('artifactType1')
    artifactType2 = body.get('artifactType2')

    if retrieveProject(pID) is None:
        abort(404)

    if not checkTraceabilityLinkType(pID, artifactType1, artifactType2):
        abort(422)
    if not updateTraceabilityLinkType(tID, tName, tDescription, artifactType1, artifactType2):
        abort(422)


    return jsonify({
        'success': True
    })

@mod_traceabilityLinkType.route('/traceability_link_types', methods=['DELETE'])
@requires_auth('Remove traceability link type')
def remove_traceability_link_type(payload):
    tID = request.args.get('tID', None, type=str)
    if tID is None:
        abort(422)

    if not removeTraceabilityLinkType(tID):
        abort(404)

    return jsonify({
        'success': True
    })

