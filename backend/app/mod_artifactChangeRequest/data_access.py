from app.mod_artifact.models import Artifact
from app.mod_artifactChangeRequest.models import Artifact_Change_Request

from app.mod_artifact.data_access import storeArtifact, updateArtifact, removeArtifact

__all__ = ['storeArtifactChangeRequest', 'checkArtifactRequest', 'accept_artifact_creation_request', 'accept_artifact_modification_request', 'accept_artifact_deletion_request', 'reject_artifact_request']

def storeArtifactChangeRequest(artifactChangeRequest):
    if artifactChangeRequest.request_type != 'Create Artifact':
        requests = Artifact_Change_Request.query.filter((Artifact_Change_Request.artifact_name == artifactChangeRequest.artifact_name) , (Artifact_Change_Request.created_by == artifactChangeRequest.created_by)).filter((Artifact_Change_Request.status == 'Pending')).first()
        if requests is not None:
            return False
    try:
        artifactChangeRequest.insert()
        return True
    except:
        return False

def checkArtifactRequest(aID, aName, reject_reason = 'The associated artifact has been changed or the name has been taken'):
    requests = Artifact_Change_Request.query.filter(((Artifact_Change_Request.artifact_name == aName) | (Artifact_Change_Request.artifact_id == aID)), (Artifact_Change_Request.status == 'Pending')).all()
    for request in requests:
        reject_artifact_request(request, reject_reason)


def accept_artifact_creation_request(change_request):
    artifact = Artifact(name = change_request.artifact_name, description = change_request.artifact_description, artifact_type=change_request.artifact_type,
     created_by = change_request.created_by, version=1, project_name=change_request.project_name)

    try:
        artifact.insert()
        checkArtifactRequest(change_request.artifact_id, change_request.artifact_name)
        return True
    except:
        return False

def accept_artifact_modification_request(change_request):
    if not updateArtifact(change_request.artifact_id, change_request.artifact_name, change_request.artifact_description,
     change_request.artifact_type, change_request.project_name, change_request.created_by):
        return False
    else:
        checkArtifactRequest(change_request.artifact_id, change_request.artifact_name)
        return True

def accept_artifact_deletion_request(change_request):
    if not removeArtifact(change_request.artifact_id):
        return False
    else:
        checkArtifactRequest(change_request.artifact_id, change_request.artifact_name)
        return True

def reject_artifact_request(request, reject_reason):
    try:
        request.status = 'Rejected'
        request.reject_reason = reject_reason
        request.update()
        return True
    except:
        return False
    