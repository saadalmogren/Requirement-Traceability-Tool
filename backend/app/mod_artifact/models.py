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


class Artifact(db.Model):
    __tablename__ = 'Artifact'
    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String())
    description = db.Column(db.String())
    created_by = Column(db.String(), ForeignKey('User.username', ondelete="CASCADE"), nullable=False)
    modified_by = Column(db.String(), nullable=True)
    modification_date = Column(db.DateTime, nullable=True)
    creation_date = db.Column(db.DateTime, nullable=False)
    version = db.Column(db.Integer, nullable=False)
    artifact_type = Column(db.String(), ForeignKey('Artifact_Type.id', ondelete="CASCADE"), nullable=False)
    project_name = Column(db.String(), ForeignKey('Project.id', ondelete="CASCADE"), nullable=False)

    def __init__(self, name, description, created_by, version, artifact_type, project_name):
        self.id = generateID(name)
        self.name = name
        self.description = description
        self.created_by = created_by
        self.creation_date = datetime.today().strftime('%Y-%m-%d')
        self.version = version
        self.artifact_type = artifact_type
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
            'name': self.name,
            'description': self.description,
            'created_by': self.created_by,
            'creation_date': self.creation_date,
            'version': self.version,
            'artifact_type': Artifact_Type.query.get(self.artifact_type).name,
            'modified_by': self.modified_by,
            'modification_date': self.modification_date,
            'project_name': self.project_name
        }
    def csvFormat(self):
        date = str(self.creation_date.year)+'-'+str(self.creation_date.month)+'-'+str(self.creation_date.day)
        if self.modified_by is None:
            return [self.name, self.description, self.created_by, date, Artifact_Type.query.get(self.artifact_type).name,'-', '-', self.version]
        else:
            modification_date = str(self.modification_date.year)+'-'+str(self.modification_date.month)+'-'+str(self.modification_date.day)
            return [self.name, self.description, self.created_by, date, Artifact_Type.query.get(self.artifact_type).name, self.modified_by, modification_date, self.version]
            