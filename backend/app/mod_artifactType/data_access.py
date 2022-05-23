from app.mod_artifactType.models import Artifact_Type


def storeArtifactType(artifactType):
    try:
        artifactType.insert()
        return True
    except:
        return False

def updateArtifactType(aID ,aName, aDescription, pID):
    artifact_type = Artifact_Type.query.get(aID)

    if artifact_type is None:
        return False
    else:
        artifact_type.name = aName
        artifact_type.description = aDescription
        artifact_type.update()
        return True

def removeArtifactType(aID):
    artifact_type = Artifact_Type.query.get(aID)
    if artifact_type is None:
        return False
    else:
        artifact_type.delete()
        return True
