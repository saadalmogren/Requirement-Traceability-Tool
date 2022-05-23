from app import db
from flask import jsonify
from sqlalchemy import Column, String, Table, ForeignKey, Integer
import shortuuid
from datetime import datetime
from app.mod_project.models import Project
from app.mod_user.models import User
from app.mod_artifactType.models import Artifact_Type


def generateID(name):
    random_string = shortuuid.ShortUUID().random(length=5)
    return str(name)+'_'+random_string


class Artifact_Change_Request(db.Model):
    __tablename__ = 'Artifact_Change_Request'
    id = db.Column(db.String(), primary_key=True)
    title = db.Column(db.String())
    description = db.Column(db.String())
    created_by = Column(db.String(), ForeignKey('User.username', ondelete="CASCADE"), nullable=False)
    creation_date = db.Column(db.DateTime, nullable=False)
    request_type = db.Column(db.String(), nullable=False)
    status = db.Column(db.String(), nullable=False)
    reject_reason = db.Column(db.String(), nullable=True)
    artifact_id = Column(db.String(), nullable = True)
    artifact_name = Column(db.String(), nullable=False)
    artifact_description = Column(db.String(), nullable=False)
    artifact_type = Column(db.String(), nullable=False)
    project_name = Column(db.String(), ForeignKey('Project.id', ondelete="CASCADE"), nullable=False)

    def __init__(self, title, description, created_by, request_type, status, artifact_id, artifact_name, artifact_type, artifact_description, project_name ):
        self.id = generateID(title)
        self.title = title
        self.description = description
        self.created_by = created_by
        self.creation_date = datetime.today().strftime('%Y-%m-%d')
        self.request_type = request_type
        self.status = status
        self.artifact_id = artifact_id
        self.artifact_name = artifact_name
        self.artifact_type = artifact_type
        self.artifact_description = artifact_description
        self.project_name = project_name

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
            'title': self.title,
            'description': self.description,
            'created_by': self.created_by,
            'creation_date': self.creation_date,
            'request_type': self.request_type,
            'status': self.status,
            'reject_reason': self.reject_reason,
            'artifact_id': self.artifact_id,
            'artifact_name': self.artifact_name,
            'artifact_type': Artifact_Type.query.get(self.artifact_type).name,
            'artifact_description': self.artifact_description,
            'project_name': self.project_name
        }
