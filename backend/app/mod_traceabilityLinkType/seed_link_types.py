from app.mod_traceabilityLinkType.models import Traceability_Link_Type
from app.mod_artifactType.models import Artifact_Type
def seed_link_types(pID):
    """Seed the database."""
    try:
        aID = Artifact_Type.query.filter(Artifact_Type.id.ilike('requirement%')).first().id
        p1 = Traceability_Link_Type(name = "Depends on", description = "Link between requirement and another requirement.", project_name= pID, first_artifact_type = aID, second_artifact_type = aID)

        p2 = Traceability_Link_Type(name = "Is verified by", description = "Link between requirement and test case.", project_name= pID, first_artifact_type = aID, second_artifact_type = Artifact_Type.query.filter(Artifact_Type.id.ilike('test case%')).first().id)

        p3 = Traceability_Link_Type(name = 'Is origin of', description = "Link between business need and requirement.", project_name= pID, first_artifact_type = Artifact_Type.query.filter(Artifact_Type.id.ilike('business need%')).first().id, second_artifact_type = aID)

        p4 = Traceability_Link_Type(name = 'Is satisfied by', description = "Link between requirement and user interface.", project_name= pID, first_artifact_type = aID, second_artifact_type = Artifact_Type.query.filter(Artifact_Type.id.ilike('user interface%')).first().id)

        p5 = Traceability_Link_Type(name = 'Is implemented in', description="Link between class diagram and class.", project_name= pID, first_artifact_type = Artifact_Type.query.filter(Artifact_Type.id.ilike('design class diagram%')).first().id, second_artifact_type = Artifact_Type.query.filter(Artifact_Type.id.ilike('class%')).first().id)
    except:
        return False
    
    p1.insert()
    p2.insert()
    p3.insert()
    p4.insert()
    p5.insert()

    return True
