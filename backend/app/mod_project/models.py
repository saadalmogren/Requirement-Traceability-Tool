from app import db
from flask import jsonify
from sqlalchemy import Column, String, Table
import shortuuid

def generateID(name):
    random_string = shortuuid.ShortUUID().random(length=5)
    return str(name)+'_'+random_string

class Project(db.Model):
    __tablename__ = 'Project'
    id = db.Column(db.String(), primary_key=True)
    manager = db.Column(db.String(), db.ForeignKey("User.username", ondelete="CASCADE"))
    name = db.Column(db.String(), nullable=False)
    description = db.Column(db.String())
    users = db.relationship(
        'users_project', backref='project', lazy=True, cascade='all, delete')
    roles = db.relationship('roles_privileges', backref='project', lazy=True, cascade='all, delete')
    artifact_types = db.relationship('Artifact_Type', backref='project', lazy=True, cascade='all, delete')
    artifacts = db.relationship('Artifact', backref='project', lazy=True, cascade='all, delete')
    traceability_link_types = db.relationship('Traceability_Link_Type', backref='project', lazy=True, cascade='all, delete')
    traceability_links = db.relationship('Traceability_Link', backref='project', lazy=True, cascade='all, delete')
    artifact_change_requests = db.relationship('Artifact_Change_Request', backref='project', lazy=True, cascade='all, delete')
    traceability_link_change_requests = db.relationship('Traceability_Link_Change_Request', backref='project', lazy=True, cascade='all, delete')
    notifications = db.relationship('Notification', backref='project', lazy=True, cascade='all, delete')




    def __init__(self, name, description, manager):
        self.id = generateID(name)
        self.name = name
        self.description = description
        self.manager = manager

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
            'description': self.description,
            'manager': self.manager
        }

    


class users_project (db.Model):
    __tablename__ = 'users_project'
    p_id = db.Column(db.String(), db.ForeignKey("Project.id", ondelete="CASCADE"), primary_key=True)
    username = db.Column(db.String(), db.ForeignKey("User.username", ondelete="CASCADE"), primary_key=True)

    def __init__(self, p_id, username):

        self.p_id = p_id
        self.username = username

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()