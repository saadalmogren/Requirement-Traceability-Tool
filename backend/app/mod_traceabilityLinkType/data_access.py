from app.mod_traceabilityLinkType.models import Traceability_Link_Type

def storeTraceabilityLinkType(traceabilityLinkType):
    try:
        traceabilityLinkType.insert()
        return True
    except:
        return False

def updateTraceabilityLinkType(tID, tName, tDescription, artifactType1, artifactType2):
    link = Traceability_Link_Type.query.get(tID)

    if link is None:
        return False
    else:
        try:
            link.name = tName
            link.description = tDescription
            link.first_artifact_type = artifactType1
            link.second_artifact_type = artifactType2
        except:
            return False
        link.update()
        return True

def removeTraceabilityLinkType(tID):
    link = Traceability_Link_Type.query.get(tID)
    if link is None:
        return False
    else:
        link.delete()
        return True
