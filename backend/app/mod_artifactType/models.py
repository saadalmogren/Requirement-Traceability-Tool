from app import db
from flask import jsonify
from sqlalchemy import Column, String, Table, ForeignKey, Integer
import shortuuid
from datetime import datetime
from app.mod_project.models import Project
import shortuuid

def generateID(name):
    random_string = shortuuid.ShortUUID().random(length=5)
    return str(name)+'_'+random_string
class Artifact_Type(db.Model):
    __tablename__ = 'Artifact_Type'
    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String(), nullable = False)
    description = db.Column(db.String())
    project_name = Column(db.String(), ForeignKey('Project.id', ondelete="CASCADE"), nullable=False)

    def __init__(self, name, description, project_name ):
        self.id = generateID(name)
        self.name = name
        self.description = description
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
            'project_name': self.project_name
        }
