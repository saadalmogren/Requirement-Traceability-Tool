from flask import abort
from app.mod_user.models import User
from app.mod_project.models import Project, users_project

__all__ = ["storeUser", "checkRegister", "checkLogin", "retrieveUser", 
"updateAccountInformation", "checkAccountInformation", "checkUser"]

def storeUser(user):
    try:
        user.insert()
        return True
    except:
        return False

# added email
def checkRegister(username, email):
    users_u = User.query.filter_by(username=username).count()
    users_e = User.query.filter_by(email=email).count()

    if users_e != 0 or users_u != 0:
        return False
    else:
        return True


def checkLogin(username, password):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return False
    if not user.verify_password(password):
        return False

    return True


def retrieveUser(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return None

    return user



def retrieveProjects(username):
    user = User.query.get(username)
    if user is None:
        abort(404)
    projects_ids = user.projects
    projects = [Project.query.filter_by(id=project.p_id).first() for project in projects_ids]
    return projects

def updateAccountInformation(user):
    user = User.query.filter_by(username=user.username).first()
    if user is None:
        return False
    if checkAccountInformation(user.email):
        user.update()
        return True
    else:
        return False


def checkAccountInformation(email):
    user = User.query.filter_by(email=email).count()

    if user > 1:
        return False

    else:
        return True


def checkUser(username):
    users = User.query.filter_by(username=username).count()

    if users == 0:
        return False
    else:
        return True
