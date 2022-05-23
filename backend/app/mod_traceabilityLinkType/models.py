from app import db
from flask import jsonify
from sqlalchemy import Column, String, Table, ForeignKey, Integer
import shortuuid
from datetime import datetime
from app.mod_project.models import Project
from app.mod_artifactType.models import Artifact_Type

def generateID(name):
    random_string = shortuuid.ShortUUID().random(length=5)
    return str(name)+'_'+random_string
class Traceability_Link_Type(db.Model):
    __tablename__ = 'Traceability_Link_Type'
    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String(), nullable = False)
    description = db.Column(db.String())
    project_name = Column(db.String(), ForeignKey('Project.id', ondelete="CASCADE"), nullable=False)
    first_artifact_type = Column(db.String(), ForeignKey('Artifact_Type.id', ondelete="CASCADE"), nullable=False)
    second_artifact_type = Column(db.String(), ForeignKey('Artifact_Type.id', ondelete="CASCADE"), nullable=False)

    def __init__(self, name, description, project_name, first_artifact_type, second_artifact_type):
        self.id = generateID(name)
        self.name = name
        self.description = description
        self.project_name = project_name
        self.first_artifact_type = first_artifact_type
        self.second_artifact_type = second_artifact_type

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
            'project_name': self.project_name,
            'first_artifact_type': Artifact_Type.query.get(self.first_artifact_type).name,
            'second_artifact_type': Artifact_Type.query.get(self.second_artifact_type).name
        }
