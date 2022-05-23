from app.mod_user.models import User
from app.mod_project.data_access import *
from app.mod_user.data_access import *
from app.mod_project.models import Project, users_project
from app.mod_artifact.data_access import *
from app.mod_artifact.models import *
from app.mod_traceabilityLink.data_access import *
from app.mod_traceabilityLink.models import *
from app.mod_traceabilityLinkType.data_access import *
from app.mod_traceabilityLinkType.models import *
from flask import Flask
import unittest

app = Flask(__name__)

class tracabilityLinkTestCase(unittest.TestCase):
        def setUp(self):
                self.app = app.test_client()
        
        def test_store_traceability_link_success(self):
                user = User(username="ali", password="123", email="ali@test.com")
                user.insert()
                project= Project("swe", "welcome", "ali")
                project.insert()
                artifactType = Artifact_Type("artifactType1","description",project.id)
                artifactType.insert()
                artifact1 = Artifact("artifact1", "description", "ali",1 , artifactType.id, project.id )
                artifact1.insert()
                artifact2 = Artifact("artifact2", "description","ali",1 , artifactType.id, project.id )
                artifact2.insert()
                TLT = Traceability_Link_Type("Traceability link type1", "ali", project.id, artifactType.id,artifactType.id )
                TLT.insert()
                traceabilityLink = Traceability_Link("traceability", "description", "ali", 1, TLT.id, project.id, artifact1.id, artifact2.id)
                self.assertEqual(storeTraceabilityLink(traceabilityLink) , True)
                project.delete()
                user.delete()

        # def test_store_traceability_link_False(self):
        #         project= Project("swe", "welcome", "ali")
        #         project.insert()
        #         user = User(username="ali", password="123", email="ali@test.com")
        #         user.insert()
        #         artifactType = Artifact_Type("artifactType1","description",project.id)
        #         artifactType.insert()
        #         artifact1 = Artifact("artifact1", "description", "ali",1 , artifactType.id, project.id )
        #         artifact1.insert()
        #         artifact2 = Artifact("artifact2", "description", "ali",1 , artifactType.id, project.id )
        #         artifact2.insert()
        #         TLT = Traceability_Link_Type("Traceability link type1", "ali", project.id, artifactType.id, artifactType.id)
        #         TLT.insert()
        #         traceabilityLink = Traceability_Link("traceability", "description", "ali", 1, TLT.id, project.id, artifact1.id, artifact2.id)
        #         traceabilityLink.insert()
        #         self.assertEqual(storeTraceabilityLink(traceabilityLink) , False)
        #         project.delete()
        #         user.delete()
        #         TLT.delete()
        #         traceabilityLink.delete()

        def test_update_traceability_link_success(self):
                user = User(username="ali", password="123", email="ali@test.com")
                user.insert()
                project= Project("swe", "welcome", "ali")
                project.insert()
                artifactType = Artifact_Type("artifactType1","description",project.id)
                artifactType.insert()
                artifact1 = Artifact("artifact1", "description", "ali",1 , artifactType.id, project.id )
                artifact1.insert()
                artifact2 = Artifact("artifact2", "description", "ali",1 , artifactType.id, project.id )
                artifact2.insert()
                TLT = Traceability_Link_Type("Traceability link type1", "ali", project.id, artifactType.id,artifactType.id )
                TLT.insert()
                traceabilityLink = Traceability_Link("traceability", "description", "ali", 1, TLT.id, project.id, artifact1.id, artifact2.id)
                traceabilityLink.insert()
                self.assertEqual(updateTraceabilityLink(traceabilityLink.id, "test name", "test discreption", artifact1.id, artifact2.id, TLT.id, "ali") , True)
                project.delete()
                user.delete()

        def test_update_traceability_link_false(self):
                user = User(username="ali", password="123", email="ali@test.com")
                user.insert()
                project= Project("swe", "welcome", "ali")
                project.insert()
                artifactType = Artifact_Type("artifactType1","description",project.id)
                artifactType.insert()
                artifact1 = Artifact("artifact1", "description", "ali",1 , artifactType.id, project.id )
                artifact1.insert()
                artifact2 = Artifact("artifact2", "description", "ali",1 , artifactType.id, project.id )
                artifact2.insert()
                TLT = Traceability_Link_Type("Traceability link type1", "ali", project.id, artifactType.id,artifactType.id )
                TLT.insert()
                self.assertEqual(updateTraceabilityLink("testID", "test name", "test discreption", artifact1.id, artifact2.id, TLT.id, "ali") , False)
                project.delete()
                user.delete()

        def test_remove_traceability_link_success(self):
                user = User(username="ali", password="123", email="ali@test.com")
                user.insert()
                project= Project("swe", "welcome", "ali")
                project.insert()
                artifactType = Artifact_Type("artifactType1","description",project.id)
                artifactType.insert()
                artifact1 = Artifact("artifact1", "description", "ali",1 , artifactType.id, project.id )
                artifact1.insert()
                artifact2 = Artifact("artifact2", "description", "ali",1 , artifactType.id, project.id )
                artifact2.insert()
                TLT = Traceability_Link_Type("Traceability link type1", "ali", project.id, artifactType.id,artifactType.id )
                TLT.insert()
                traceabilityLink = Traceability_Link("traceability", "description", "ali", 1, TLT.id, project.id, artifact1.id, artifact2.id)
                traceabilityLink.insert()
                self.assertEqual(removeTraceabilityLink(traceabilityLink.id) , True)
                project.delete()
                user.delete()

        def test_remove_traceability_link_false(self):
                self.assertEqual(removeTraceabilityLink("testID"),False)
        

if __name__ == '__main__':
    unittest.main()
