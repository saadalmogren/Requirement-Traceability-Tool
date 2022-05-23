from app import db
from sqlalchemy import Column, String
from app.mod_project.models import Project
from app.mod_user.models import User

import shortuuid

def generateID(name):
    random_string = shortuuid.ShortUUID().random(length=5)
    return str(name)+'_'+random_string

class Role(db.Model):
    __tablename__ = 'Role'
    id = db.Column(db.String(), primary_key=True)
    pID = db.Column(db.String(), db.ForeignKey("Project.id", ondelete="CASCADE"))
    name = db.Column(db.String(), nullable = False)
    users =  db.relationship('users_roles', backref='role', lazy=True, cascade='save-update, merge, delete, delete-orphan')
    privileges = db.relationship('roles_privileges', backref='role', lazy=True, cascade='save-update, merge, delete, delete-orphan')
    
    def __init__(self, name, pID):
        self.id = generateID(name)
        self.name = name
        self.pID = pID

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'name': self.name,
            'pID': self.pID,
        }

# mistake in database schema cant reference role_name (it is not unique)
class users_roles(db.Model):
    __tablename__ = 'users_roles'
    username = db.Column(db.String(),  db.ForeignKey("User.username", ondelete="CASCADE"), primary_key=True)
    role_id = db.Column(db.String(),  db.ForeignKey("Role.id", ondelete="CASCADE"), primary_key=True)
    # role_name = db.Column(db.String(), db.ForeignKey("Role.name", ondelete="CASCADE"), primary_key=True)
    pID = db.Column(db.String(), db.ForeignKey("Project.id", ondelete="CASCADE"), primary_key=True)

    def __init__(self, username, role_id, pID):
        self.username = username
        self.role_id = role_id
        self.pID = pID

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'username': self.username,
            'role_id': self.role_id,
            'pID': self.pID
        }

class Privilege(db.Model):
    __tablename__ = 'Privilege'
    name = db.Column(db.String(), primary_key=True)

    def __init__(self, name):
        self.name = name

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'name': self.name
        }
# mistake in database schema cant reference role_name (it is not unique)
class roles_privileges(db.Model):
    __tablename__ = 'roles_privileges'
    # role_name = db.Column(db.String(), db.ForeignKey("Role.name", ondelete="CASCADE"))
    role_id = db.Column(db.String(),  db.ForeignKey("Role.id", ondelete="CASCADE"), primary_key=True)
    privilege_name = db.Column(db.String(), db.ForeignKey("Privilege.name", ondelete="CASCADE"), primary_key=True)
    pID = db.Column(db.String(), db.ForeignKey("Project.id", ondelete="CASCADE"), primary_key=True)
    artifact_type = db.Column(db.String(), db.ForeignKey("Artifact_Type.id", ondelete="CASCADE"))




    def __init__(self, role_id, privilege_name, pID, artifact_type):
        self.role_id = role_id
        self.privilege_name = privilege_name
        self.pID = pID
        self.artifact_type = artifact_type


    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'role_id': self.role_id,
            'privilege_name': self.privilege_name,
            'pID': self.pID,
            # 'artifact_type': self.artifact_type
        }