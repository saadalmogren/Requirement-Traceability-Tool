from app.mod_notification.models import Notification
from app.mod_project.data_access import getUserPrivileges, retrieveProject
from app.mod_artifactChangeRequest.models import Artifact_Change_Request
from app.mod_traceabilityLinkChangeRequest.models import Traceability_Link_Change_Request


def createNotification(artifact_request_id,traceability_request_id, pID):
    users = retrieveProject(pID).users
    request = ''
    if artifact_request_id is not None:
        request = Artifact_Change_Request.query.get(artifact_request_id)
    else:
        request = Traceability_Link_Change_Request.query.get(traceability_request_id)
    for user in users:
        if user.username == request.created_by:
            continue
        user_privilegs = getUserPrivileges(user.username, pID)
        if {'name': 'View, accept, and reject change request', 'type': None} in user_privilegs:      
            notify = Notification(username = user.username, artifact_request_id = artifact_request_id, traceability_link_request_id = traceability_request_id, pID = pID)
            try:
                notify.insert()
            except:
                return False
    return True

def createNotification_sent(artifact_request_id,traceability_request_id, username ,pID):
    notify = Notification(username = username, artifact_request_id = artifact_request_id, traceability_link_request_id = traceability_request_id, pID = pID)
    try:
        notify.insert()
    except:
        return False
    return True