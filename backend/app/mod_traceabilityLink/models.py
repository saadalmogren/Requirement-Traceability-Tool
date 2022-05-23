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


class Traceability_Link(db.Model):
    __tablename__ = 'Traceability_Link'
    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String())
    description = db.Column(db.String())
    created_by = Column(db.String(), ForeignKey('User.username', ondelete="CASCADE"), nullable=False)
    creation_date = db.Column(db.DateTime, nullable=False)
    modified_by = Column(db.String(), nullable=True)
    modification_date = Column(db.DateTime, nullable=True)
    version = db.Column(db.Integer, nullable=False)
    traceability_Link_Type = Column(db.String(), ForeignKey('Traceability_Link_Type.id', ondelete="CASCADE"), nullable=False)
    project_name = Column(db.String(), ForeignKey('Project.id', ondelete="CASCADE"), nullable=False)
    first_artifact = Column(db.String(), ForeignKey('Artifact.id', ondelete="CASCADE"), nullable=False)
    second_artifact = Column(db.String(), ForeignKey('Artifact.id', ondelete="CASCADE"), nullable=False)

    def __init__(self, name, description, created_by, version, traceability_Link_Type, project_name, first_artifact, second_artifact ):
        self.id = generateID(name)
        self.name = name
        self.description = description
        self.created_by = created_by
        self.creation_date = datetime.today().strftime('%Y-%m-%d')
        self.version = version
        self.traceability_Link_Type = traceability_Link_Type
        self.project_name = project_name
        self.first_artifact = first_artifact
        self.second_artifact = second_artifact

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
            'modified_by': self.modified_by,
            'modification_date': self.modification_date,
            'traceability_Link_Type': Traceability_Link_Type.query.get(self.traceability_Link_Type).name,
            'project_name': self.project_name,
            'first_artifact': Artifact.query.get(self.first_artifact).name,
            'second_artifact': Artifact.query.get(self.second_artifact).name
        }
    def csvFormat(self):
        date = str(self.creation_date.year)+'-'+str(self.creation_date.month)+'-'+str(self.creation_date.day)
        if self.modified_by is None:
            return [self.name, self.description, self.created_by, date, Traceability_Link_Type.query.get(self.traceability_Link_Type).name, Artifact.query.get(self.first_artifact).name, Artifact.query.get(self.second_artifact).name, '-', '-', self.version]
        else:
            modification_date = str(self.modification_date.year)+'-'+str(self.modification_date.month)+'-'+str(self.modification_date.day)
            return [self.name, self.description, self.created_by, date, Traceability_Link_Type.query.get(self.traceability_Link_Type).name, Artifact.query.get(self.first_artifact).name, Artifact.query.get(self.second_artifact).name, self.modified_by, modification_date, self.version]
