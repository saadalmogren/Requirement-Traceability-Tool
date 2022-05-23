from app import db
from flask import jsonify
import shortuuid

def generateID():
    random_string = shortuuid.ShortUUID().random(length=5)
    return random_string

class Notification(db.Model):

    __tablename__ = 'Notification'
    id = db.Column(db.String(),  primary_key=True)
    pID = db.Column(db.String(), db.ForeignKey("Project.id", ondelete="CASCADE"), nullable = False)
    username = db.Column(db.String(), db.ForeignKey("User.username", ondelete="CASCADE"), nullable = False)
    artifact_request_id = db.Column(db.String(), db.ForeignKey("Artifact_Change_Request.id", ondelete="CASCADE"), nullable = True)
    traceability_link_request_id = db.Column(db.String(), db.ForeignKey("Traceability_Link_Change_Request.id", ondelete="CASCADE"), nullable = True)


    def __init__(self, pID, username, artifact_request_id, traceability_link_request_id):
        self.id = generateID()
        self.pID = pID
        self.username = username
        self.artifact_request_id = artifact_request_id
        self.traceability_link_request_id = traceability_link_request_id

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        if self.artifact_request_id is None:
            return {
                'id': self.id,
                'pID': self.pID,
                'username': self.username,
                'traceability_link_request_id': self.traceability_link_request_id
            }
        else:
            return{
                'id': self.id,
                'pID': self.pID,
                'username': self.username,
                'artifact_request_id': self.artifact_request_id    
            }
