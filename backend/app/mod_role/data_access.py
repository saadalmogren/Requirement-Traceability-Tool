from flask import abort
from app.mod_role.models import Role, Privilege, roles_privileges
from app.mod_project.models import Project, users_project

__all__ = ["storeRole", "removeRole", "getRolePrivileges", "getPrivileges", "addPrivileges", 
"updateRole", "deletePrivileges", "removeRole"]

def storeRole(role):
    try:
        role.insert()
        return True
    except:
        return False


def getPrivileges():
    privielges = Privilege.query.all()
    return privielges
    
    
def getRolePrivileges(pID, rID):
    role = Role.query.filter_by(pID = pID, id = rID).first()
    if role is None:
        return False
    privileges = []
    for privilege in role.privileges:
        try:
            privileges.append({"name":privilege.privilege_name, "type": privilege.artifact_type})
        except:
            return False
    return privileges

def updateRole(rID, rName, pID):
    check_role = Role.query.get(rID)
    if check_role is not None:
        role = Role.query.get(rID)
        role.name = rName
        role.update()
        return True
    else:
        return False

# updateRole = addPrivileges() + deletePrivileges()
def addPrivileges(pID, rID, rPrivileges):
    role = Role.query.get(rID)
    privileges = getRolePrivileges(pID, role.id)
    if role is None:
        return False    
    for privilege in rPrivileges:
        if privilege in privileges:
            return False
        try:
            role_privileges = roles_privileges(role_id = role.id, pID = pID, privilege_name = privilege["name"], artifact_type = privilege["type"])
            role.privileges.append(role_privileges)
            role.update()
        except:
            return False
    return True

def deletePrivileges(pID, rID, rPrivileges):
    role = Role.query.get(rID)
    if role is None:
        return False    
    for privilege in rPrivileges:
            try:
                role_privilege = roles_privileges.query.filter_by(role_id = rID, pID = pID, privilege_name = privilege).first()
                if role_privilege is None:
                    return False
                role_privilege.delete()
            except:
                return False
    role.update()
    return True

def removeRole(pID, rName):
    role = Role.query.filter_by(pID = pID, name = rName).first()
    if role is None:
        return False
    role.delete()
    return True