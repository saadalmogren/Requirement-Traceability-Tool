from app.mod_artifact.models import Artifact
from app.mod_artifactType.models import Artifact_Type
import datetime



def storeArtifact(artifact):
    try:
        artifact.insert()
        return True
    except:
        return False


def updateArtifact(aID, aName, aDescription, artifact_type, pID, username):
    artifact = Artifact.query.get(aID)
    aType = Artifact_Type.query.get(artifact_type)

    if artifact is None or aType is None:
        return False
    else:
        artifact.name = aName
        artifact.description = aDescription
        artifact.artifact_type = artifact_type
        artifact.version +=1
        artifact.modified_by = username
        artifact.modification_date = datetime.datetime.now()
        artifact.update()
        return True


def removeArtifact(aID):
    artifact = Artifact.query.get(aID)
    if artifact is None:
        return False
    else:
        artifact.delete()
        return True
