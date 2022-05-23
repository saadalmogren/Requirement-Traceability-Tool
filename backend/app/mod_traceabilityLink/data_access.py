from app.mod_traceabilityLink.models import Traceability_Link
import datetime

def storeTraceabilityLink(traceabilityLink):
    try:
        traceabilityLink.insert()
        return True
    except:
        return False

def updateTraceabilityLink(tID, tName, tDescription, artifact1, artifact2, tType, username):
    link = Traceability_Link.query.get(tID)

    if link is None:
        return False
    else:
        try:
            link.name = tName
            link.description = tDescription
            link.first_artifact = artifact1
            link.second_artifact = artifact2
            link.traceability_Link_Type = tType
            link.version +=1
            link.modified_by = username
            link.modification_date = datetime.datetime.now()
        except:
            return False
        link.update()
        return True

def removeTraceabilityLink(tID):
    link = Traceability_Link.query.get(tID)
    if link is None:
        return False
    else:
        link.delete()
        return True
