from app import db
from flask import jsonify
from sqlalchemy import Column, String, Table, ForeignKey, Integer
import shortuuid
from datetime import datetime
from app.mod_project.models import Project
from app.mod_user.models import User
from app.mod_traceabilityLinkType.models import Traceability_Link_Type
from app.mod_artifact.models import Artifact


def generateID(name):
    random_string = shortuuid.ShortUUID().random(length=5)
    return str(name)+'_'+random_string


class Traceability_Link_Change_Request(db.Model):
    __tablename__ = 'Traceability_Link_Change_Request'
    id = db.Column(db.String(), primary_key=True)
    title = db.Column(db.String())
    description = db.Column(db.String())
    created_by = Column(db.String(), ForeignKey('User.username', ondelete="CASCADE"), nullable=False)
    creation_date = db.Column(db.DateTime, nullable=False)
    request_type = db.Column(db.String(), nullable=False)
    status = db.Column(db.String(), nullable=False)
    reject_reason = db.Column(db.String(), nullable=True)
    traceability_link_id = Column(db.String(), nullable = True)
    traceability_link_name = Column(db.String(), nullable=False)
    traceability_link_description = Column(db.String(), nullable=False)
    traceability_link_type = Column(db.String(), nullable=False)
    first_artifact = Column(db.String(), nullable=False)
    first_artifact_name = Column(db.String(), nullable=True)
    second_artifact = Column(db.String(), nullable=False)
    second_artifact_name = Column(db.String(), nullable=True)
    project_name = Column(db.String(), ForeignKey('Project.id', ondelete="CASCADE"), nullable=False)

    def __init__(self, title, description, created_by, request_type, status, traceability_link_id, traceability_link_name, traceability_link_type, traceability_link_description, first_artifact, second_artifact, project_name ):
        self.id = generateID(title)
        self.title = title
        self.description = description
        self.created_by = created_by
        self.creation_date = datetime.today().strftime('%Y-%m-%d')
        self.request_type = request_type
        self.status = status
        self.traceability_link_id = traceability_link_id
        self.traceability_link_name = traceability_link_name
        self.traceability_link_type = traceability_link_type
        self.traceability_link_description = traceability_link_description
        self.first_artifact = first_artifact
        self.first_artifact_name = Artifact.query.get(self.first_artifact).name
        self.second_artifact = second_artifact
        self.second_artifact_name = Artifact.query.get(self.second_artifact).name
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
            'traceability_link_id': self.traceability_link_id,
            'traceability_link_name': self.traceability_link_name,
            'traceability_link_type': Traceability_Link_Type.query.get(self.traceability_link_type).name,
            'traceability_link_description': self.traceability_link_description,
            'first_artifact_name': self.first_artifact_name,
            'first_artifact_id': self.first_artifact,
            'second_artifact_name': self.second_artifact_name,
            'second_artifact_id': self.second_artifact,
            'project_name': self.project_name
        }
