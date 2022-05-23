from app.mod_project.models import Project, users_project
from app.mod_user.models import User
from flask import abort
from app.mod_user.data_access import retrieveProjects, retrieveUser
from app.mod_role.models import Role, roles_privileges, users_roles, Privilege
from app.mod_role.data_access import getRolePrivileges
from app.mod_artifactType.models import Artifact_Type
from app.mod_artifact.models import Artifact
from app.mod_traceabilityLink.models import Traceability_Link
from app.mod_traceabilityLinkType.models import Traceability_Link_Type




__all__ = ["storeProject", "retrieveProject", "updateProject","checkUser", "addUser", 'removeProject', 'removeUser',
'getUserRoles', 'checkRole', 'changeUsers_Role_add', 'changeUsers_Role_delete', 'getUserPrivileges', 'getRoles', 'changeManagement',
'getArtifactTypes', 'getArtifact', 'checkArtifactType', 'getTraceabilityLinkTypes', 'getTraceabilityLinks', 'getTraceabilityLinkChangeRequests', 'getArtifactChangeRequests',
'getArtifactSentChangeRequests', 'getTraceabilityLinkSentChangeRequests', 'getTraceabilityLinksCSV', 'getArtifactsCSV','getUserNotifications',
'performImpactAnalysis', 'testCoveredArtifacts', 'testUncoveredArtifacts', 'getUncoveredNeeds', 'testCoverageFormat', 'getCoveredNeeds', 'getDirectArtifacts']



def storeProject(project):
    try:
        project.insert()
        return True
    except:
        return False

def retrieveProject(pID):
    project = Project.query.filter_by(id=pID).first()
    if project is None:
        return None

    return project

def updateProject(pID,name, pDescription):
    project = retrieveProject(pID)

    if project is None:
        return False
    else:
        project.name = name
        project.description = pDescription
        project.update()
    return True

def addUser(user, pID):
    if checkUser(user.username, pID):
        return False

    if retrieveProject(pID) is None:
        return False

    try:
        user_project = users_project(p_id = pID, username = user.username)
        user_project.insert()
        return True
    except:
        return False

def removeProject(pID):
    project = retrieveProject(pID)
    if project is None:
        return False
    else:
        project.delete()
        return True

def removeUser(username, pID):
    user_project = users_project.query.get((pID, username))
    if user_project is None:
        return False
    else:
        user_project.delete()
        return True

def checkUser(username, pID):
    projects = retrieveProjects(username)
    projects_ids = [project.id for project in projects]
    if pID in projects_ids:
        return True
    else:
        return False

def getRoles(pID):
    roles = Role.query.filter_by(pID = pID).all()
    return roles

def getUserRoles(username, pID):
    if not checkUser(username, pID):
        abort(404)
    user_roles = users_roles.query.filter_by(pID= pID, username = username).all()
    return user_roles

def checkRole(pID, rName, rPrivileges):
    artifact_types = getArtifactTypes(pID)
    artifact_types_ids = [artifact_type.id for artifact_type in artifact_types]
    if len(rPrivileges) == 0:
        return False
    for privilege in rPrivileges:
        if privilege['type'] is not None:
            if privilege['type'] not in artifact_types_ids:
                return False
    role = Role.query.filter_by(pID = pID, name = rName).first()
    if role is None:
        return True
    else:
        return False

# changeUserRoles() = changeUsers_Role_add() + changeUsers_Role_delete()
def changeUsers_Role_add(pID, username, roles):
    user = User.query.get(username)
    if user is None:
        return False
    
    for role_id in roles: 
            role = Role.query.filter_by(name = role_id, pID=pID).first()
            if role is None:
                return False
            user_role = users_roles(role_id = role.id, pID = pID, username = username)
            try:
                user_role.insert()
            except:
                return False
    
    return True

def changeUsers_Role_delete(pID, username, roles):
    user = User.query.get(username)
    if user is None:
        return False
    
    for role_id in roles:
        role = Role.query.filter_by(name = role_id, pID=pID).first()
        if role is None:
            return False
        user_role = users_roles.query.filter_by(role_id = role.id, pID = pID, username = username).first()
        if user_role is None:
            abort(404)
        user_role.delete()
    return True
def changeManagement(oldUsername, newUsername, pID):
    project = Project.query.get(pID)
    if project is None:
        return False
    users = [user.username for user in project.users]
    
    oldUser = retrieveUser(oldUsername)
    newUser = retrieveUser(newUsername)
    if oldUser.username not in users or newUser.username not in users:
        return False

    project.manager = newUsername

    role = Role.query.filter_by(pID = pID, name = "Project Manager").first()
    if role is None:
        return False
    old_user_role = users_roles.query.filter_by(role_id = role.id).first()

    new_user_role = users_roles(role_id = role.id, pID = pID, username = newUsername)

    project.update()
    old_user_role.delete()
    new_user_role.insert()

    return True


def getUserPrivileges(username, pID):
    user_roles = getUserRoles(username, pID)
    roles_privileges = [getRolePrivileges(pID, user_role.role_id) for user_role in user_roles]
    privileges = []
    for role_privileges in roles_privileges:
        for privilege in role_privileges:
            privileges.append(privilege)
    return privileges


def getArtifactTypes(pID):
    project = retrieveProject(pID)

    return project.artifact_types

def getArtifact(pID):
    project = retrieveProject(pID)

    return project.artifacts

def checkArtifactType(pID, aName, aID):
    types = Artifact_Type.query.filter_by(name = aName, project_name = pID).first()
    if types is None:
        return True
    elif types.id == aID:
        return True
    else:
        return False

def checkArtifact(pID, aName, aID):
    artifact = Artifact.query.filter_by(name = aName, project_name = pID).first()
    if artifact is None:
        return True
    elif artifact.id == aID:
        return True
    else:
        return False

def getTraceabilityLinkTypes(pID):
    project = retrieveProject(pID)

    return project.traceability_link_types

def checkTraceabilityLinkType(pID, artifactType1, artifactType2):
    type1 = Artifact_Type.query.get(artifactType1)
    type2 = Artifact_Type.query.get(artifactType2)

    if type1 is None or type2 is None:
        return False
    elif type1.project_name != pID or type2.project_name != pID:
        return False
    else:
        return True
    
def getTraceabilityLinks(pID):
    project = retrieveProject(pID)

    return project.traceability_links

def checkTraceabilityLink(pID, artifact1, artifact2, tType):
    first_artifact = Artifact.query.get(artifact1)
    second_artifact = Artifact.query.get(artifact2)
    link_type = Traceability_Link_Type.query.get(tType)
    print(first_artifact, second_artifact, link_type)
    if first_artifact is None or second_artifact is None or link_type is None:
        return False
    elif first_artifact.project_name != pID or second_artifact.project_name != pID or link_type.project_name != pID:
        return False
    # elif (first_artifact.artifact_type != link_type.first_artifact_type or second_artifact.artifact_type != link_type.second_artifact_type) and (first_artifact.artifact_type != link_type.second_artifact_type or second_artifact.artifact_type != link_type.first_artifact_type):
    #     return False
    else:
        return True

def getArtifactChangeRequests(pID):
    project = retrieveProject(pID)

    return project.artifact_change_requests

def getTraceabilityLinkChangeRequests(pID):
    project = retrieveProject(pID)

    return project.traceability_link_change_requests

def getArtifactSentChangeRequests(pID, username):
    project = retrieveProject(pID)
    user_requests=[]
    for request in project.artifact_change_requests:
        if request.created_by == username:
            user_requests.append(request)

    return user_requests

def getTraceabilityLinkSentChangeRequests(pID, username):
    project = retrieveProject(pID)
    user_requests=[]
    for request in project.traceability_link_change_requests:
        if request.created_by == username:
            user_requests.append(request)

    return user_requests

def getUserNotifications(pID, username):
    project = retrieveProject(pID)
    user_notifications=[]
    for notification in project.notifications:
        if notification.username == username:
            user_notifications.append(notification)

    return user_notifications

def getTraceabilityLinksCSV(pID):
    project = retrieveProject(pID)
    links = project.traceability_links
    csv = [['Project name'], [project.name], ['Name ', 'Description ', 'Created by ', 'Creation date ', 'Traceability link type ', 'First artifact ', 'Second artifact ', 'Modified by', 'Modification date', 'Version']]
    for link in links:
        csv.append(link.csvFormat())

    return csv

def getArtifactsCSV(pID):
    project = retrieveProject(pID)
    artifacts = project.artifacts
    csv = [['Project name'], [project.name], ['Name ', 'Description ', 'Created by ', 'Creation date ', 'Artifact Type ','Modified by','Modification date', 'Version']]
    for artifact in artifacts:
        csv.append(artifact.csvFormat())

    return csv

def getDirectArtifacts(aID):
    direct_artifacts = []
    links_first = Traceability_Link.query.filter_by(first_artifact = aID).all()
    for link in links_first:
        direct_artifacts.append({'name': Artifact.query.get(link.second_artifact).name,
         'Traceability_Link_Type': Traceability_Link_Type.query.get(link.traceability_Link_Type).name})
    return direct_artifacts

def isDirect(aID, node):
    neighbors = Traceability_Link.query.filter_by(first_artifact = aID).all()
    for neighbor in neighbors:
        if node == neighbor.second_artifact:
            return True
    return False
        

def performImpactAnalysis(aID, node,visited_artifacts, indirect_artifacts):
    links = Traceability_Link.query.filter_by(first_artifact = node)
    if not isDirect(aID, node) and not node == aID:
        indirect_artifacts.append(node)
    visited_artifacts.append(node)
    for link in links:
        if link.second_artifact not in visited_artifacts:
            performImpactAnalysis(aID, link.second_artifact, visited_artifacts, indirect_artifacts)
    
    return indirect_artifacts

def testCoveredArtifacts(pID):
    requirements = Artifact.query.filter((Artifact.artifact_type.ilike('Requirement%')), (Artifact.project_name == pID))
    covered_artifacts = []
    for requirement in requirements:
        links = Traceability_Link.query.filter_by(first_artifact = requirement.id).filter(Traceability_Link.traceability_Link_Type.ilike('is verified by%'))
        for link in links:
            if link.first_artifact not in covered_artifacts:
                covered_artifacts.append(link.first_artifact)
    return covered_artifacts

def testUncoveredArtifacts(pID):
    requirements = Artifact.query.filter((Artifact.artifact_type.ilike('Requirement%')), (Artifact.project_name == pID))
    uncovered_artifacts = []
    for requirement in requirements:
        links = Traceability_Link.query.filter_by(first_artifact = requirement.id).filter(Traceability_Link.traceability_Link_Type.ilike('is verified by%')).all()
        if len(links) == 0:
            uncovered_artifacts.append(requirement.name)
    return uncovered_artifacts

def testCoverageFormat(covered_artifacts):
    covered_artifacts_format=[]
    for artifact in covered_artifacts:
        link = Traceability_Link.query.filter_by(first_artifact = artifact).filter(Traceability_Link.traceability_Link_Type.ilike('is verified by%')).first()
        covered_artifacts_format.append({'name': Artifact.query.get(artifact).name, 'test_case': Artifact.query.get(link.second_artifact).name, 'traceability_link_name': link.name})
    return covered_artifacts_format

def getCoveredNeeds(pID):
    covered_needs = []
    artifacts = Artifact.query.filter((Artifact.artifact_type.ilike('%Business need%')), (Artifact.project_name == pID))
    for artifact in artifacts:
        requirements=[]
        links = Traceability_Link.query.filter_by(first_artifact = artifact.id).filter(Traceability_Link.traceability_Link_Type.ilike('is origin of%')).all()
        if len(links) != 0:  
            for link in links:
                requirements.append(Artifact.query.get(link.second_artifact).name)
            covered_needs.append({"business_need": artifact.name, "requirements":requirements})
    return covered_needs

def getUncoveredNeeds(pID):
    uncovered_needs = []
    artifacts = Artifact.query.filter((Artifact.artifact_type.ilike('%Business need%')), (Artifact.project_name == pID))
    for artifact in artifacts:
        links = Traceability_Link.query.filter_by(first_artifact = artifact.id).filter(Traceability_Link.traceability_Link_Type.ilike('is origin of%')).all()
        if len(links) == 0:
            uncovered_needs.append(artifact.name)
    return uncovered_needs


def elaborationCoverageFormat(covered_artifacts):
    covered_artifacts_format=[]
    for artifact in covered_artifacts:
        link = Traceability_Link.query.filter_by(second_artifact = artifact).filter(Traceability_Link.traceability_Link_Type.ilike('is origin of%')).first()
        covered_artifacts_format.append({'name': Artifact.query.get(artifact).name, 'business_need': Artifact.query.get(link.first_artifact).name, 'traceability_link_name': link.name})
    return covered_artifacts_format