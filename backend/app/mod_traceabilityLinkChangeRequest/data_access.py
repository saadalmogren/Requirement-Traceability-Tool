from app.mod_traceabilityLink.models import Traceability_Link
from app.mod_traceabilityLinkChangeRequest.models import Traceability_Link_Change_Request
from app.mod_traceabilityLink.data_access import storeTraceabilityLink, updateTraceabilityLink, removeTraceabilityLink
from app.mod_artifactChangeRequest.data_access import reject_artifact_request



__all__ = ['storeTrcaeabilityLinkChangeRequest', 'checkTraceabilityLinkRequest', 'accept_traceabilit_link_creation_request', 'accept_traceabilit_link_modification_request', 'accept_traceabilit_link_deletion_request',
 'reject_traceabilit_link_request', 'checkTraceabilityLinkRequest_artifact']

def storeTrcaeabilityLinkChangeRequest(traceabilityLinkChangeRequest):
    if traceabilityLinkChangeRequest.request_type != 'Create Traceability Link':
        requests = Traceability_Link_Change_Request.query.filter((Traceability_Link_Change_Request.traceability_link_id == traceabilityLinkChangeRequest.traceability_link_id), (Traceability_Link_Change_Request.status == 'Pending'), (Traceability_Link_Change_Request.created_by == traceabilityLinkChangeRequest.created_by)).first()
        if requests is not None:
            return False
    try:
        traceabilityLinkChangeRequest.insert()
        return True
    except:
        return False

def checkTraceabilityLinkRequest(tID):
    requests = Traceability_Link_Change_Request.query.filter((Traceability_Link_Change_Request.traceability_link_id == tID), (Traceability_Link_Change_Request.status == 'Pending')).all()
    for request in requests:
        reject_traceabilit_link_request(request, 'The associated traceability link has been changed')

def checkTraceabilityLinkRequest_artifact(aID):
    requests = Traceability_Link_Change_Request.query.filter(((Traceability_Link_Change_Request.first_artifact == aID) | (Traceability_Link_Change_Request.second_artifact == aID)), (Traceability_Link_Change_Request.status == 'Pending')).all()
    for request in requests:
        reject_traceabilit_link_request(request, 'The associated artifacts have been changed')

def accept_traceabilit_link_creation_request(change_request):
    link = Traceability_Link(name = change_request.traceability_link_name, description = change_request.traceability_link_description, project_name= change_request.project_name, created_by= change_request.created_by, 
    traceability_Link_Type = change_request.traceability_link_type, first_artifact = change_request.first_artifact, second_artifact = change_request.second_artifact, version=1)

    try:
        link.insert()
        return True
    except:
        return False

def accept_traceabilit_link_modification_request(change_request):
    if not updateTraceabilityLink(change_request.traceability_link_id, change_request.traceability_link_name, change_request.traceability_link_description, change_request.first_artifact, 
      change_request.second_artifact, change_request.traceability_link_type, change_request.created_by):
        return False
    else:
        checkTraceabilityLinkRequest(change_request.traceability_link_id)
        return True

def accept_traceabilit_link_deletion_request(change_request):
    if not removeTraceabilityLink(change_request.traceability_link_id):
        return False
    else:
        checkTraceabilityLinkRequest(change_request.traceability_link_id)
        return True

def reject_traceabilit_link_request(request, reject_reason):
    try:
        request.status = 'Rejected'
        request.reject_reason = reject_reason
        request.update()
        return True
    except:
        return False