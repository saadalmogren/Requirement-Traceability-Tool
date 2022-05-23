from app.mod_user.models import User
from app.mod_project.data_access import *
from app.mod_user.data_access import *
from app.mod_project.models import Project, users_project
from app.mod_artifactType.data_access import *
from app.mod_artifactType.models import *
from app.mod_artifact.data_access import *
from app.mod_artifact.models import *
from app.mod_traceabilityLinkType.data_access import *
from app.mod_traceabilityLinkType.models import *
from app.mod_traceabilityLink.models import Traceability_Link
from app.mod_traceabilityLinkChangeRequest.models import *
from app.mod_traceabilityLinkChangeRequest.data_access import *
from app.mod_traceabilityLink.data_access import *
from flask import Flask
import unittest

app = Flask(__name__)

class tracabilityLinkChangeRequestTestCase(unittest.TestCase):
        def setUp(self):
                self.app = app.test_client()
        
        def test_store_Traceability_Link_Change_Request_success(self):
                user = User(username="ali", password="123", email="ali@test.com")
                user.insert()
                project= Project("swe", "welcome", "ali")
                project.insert()
                artifactType = Artifact_Type("artifactType1","description",project.id)
                artifactType.insert()
                artifact1 = Artifact("artifact1", "description", user.username,1 , artifactType.id, project.id )
                artifact1.insert()
                artifact2 = Artifact("artifact2", "description", user.username,1 , artifactType.id, project.id )
                artifact2.insert()
                TLT = Traceability_Link_Type("Traceability link type1", "test", project.id, artifactType.id,artifactType.id )
                TLT.insert()
                traceabilityLink = Traceability_Link("traceability", "description", user.username, 1, TLT.id, project.id, artifact1.id, artifact2.id)
                traceabilityLink.insert()
                TLCR = Traceability_Link_Change_Request("request1","request description", user.username, "delete", "pending", traceabilityLink.id, traceabilityLink.name, TLT.id, traceabilityLink.description, artifact1.id, artifact2.id, project.id)
                self.assertEqual(storeTrcaeabilityLinkChangeRequest(TLCR) , True)
                project.delete()
                user.delete()
        def test_store_Traceability_Link_Change_Request_false(self):
                user = User(username="ali", password="123", email="ali@test.com")
                user.insert()
                project= Project("swe", "welcome", "ali")
                project.insert()
                artifactType = Artifact_Type("artifactType1","description",project.id)
                artifactType.insert()
                artifact1 = Artifact("artifact1", "description", user.username,1 , artifactType.id, project.id )
                artifact1.insert()
                artifact2 = Artifact("artifact2", "description", user.username,1 , artifactType.id, project.id )
                artifact2.insert()
                TLT = Traceability_Link_Type("Traceability link type1", "test", project.id, artifactType.id,artifactType.id )
                TLT.insert()
                traceabilityLink = Traceability_Link("traceability", "description", user.username, 1, TLT.id, project.id, artifact1.id, artifact2.id)
                traceabilityLink.insert()
                TLCR = Traceability_Link_Change_Request("request1","request description", user.username, "delete", "Pending", traceabilityLink.id, traceabilityLink.name, TLT.id, traceabilityLink.description, artifact1.id, artifact2.id, project.id)
                TLCR.insert()
                TLCR2 = Traceability_Link_Change_Request("request2","request description2", user.username, "delete", "Pending", traceabilityLink.id, traceabilityLink.name, TLT.id, traceabilityLink.description, artifact1.id, artifact2.id, project.id)
                self.assertEqual(storeTrcaeabilityLinkChangeRequest(TLCR2), False)
                project.delete()
                user.delete()
if __name__ == '__main__':
    unittest.main()
