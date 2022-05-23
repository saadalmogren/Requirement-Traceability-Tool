from app.mod_user.models import User
from app.mod_project.data_access import *
from app.mod_user.data_access import *
from app.mod_project.models import Project, users_project
from app.mod_artifactType.data_access import *
from app.mod_artifactType.models import *
from app.mod_traceabilityLinkType.data_access import *
from app.mod_traceabilityLinkType.models import *
from flask import Flask
import unittest

app = Flask(__name__)

class tracabilityLinkTypeTestCase(unittest.TestCase):
        def setUp(self):
                self.app = app.test_client()
        
        def test_store_traceability_link_type_success(self):
                user = User(username="ali", password="123", email="ali@test.com")
                user.insert()
                project= Project("swe", "welcome", "ali")
                project.insert()
                AT1 = Artifact_Type("artifactType1","description",project.id)
                AT1.insert()
                AT2 = Artifact_Type("artifactType2","description",project.id)
                AT2.insert()
                TLT = Traceability_Link_Type("Traceability link type1", "ali", project.id, AT1.id, AT2.id)
                self.assertEqual(storeTraceabilityLinkType(TLT) , True)
                project.delete()
                user.delete()


        # def test_store_traceability_link_type_False(self):
        #         project= Project("swe", "welcome", "ali")
        #         project.insert()
        #         AT1 = Artifact_Type("artifactType1","description",project.id)
        #         AT1.insert()
        #         AT2 = Artifact_Type("artifactType2","description",project.id)
        #         AT2.insert()
        #         TLT = Traceability_Link_Type("Traceability link type1", "ali", project.id, AT1.id, AT2.id)
        #         TLT.insert()
        #         self.assertEqual(storeTraceabilityLinkType(TLT) , False)
        #         project.delete()
        #         AT1.delete()
        #         AT2.delete()
        #         TLT.delete()

        def test_update_traceability_link_type_success(self):
                user = User(username="ali", password="123", email="ali@test.com")
                user.insert()
                project= Project("swe", "welcome", "ali")
                project.insert()
                AT1 = Artifact_Type("artifactType1","description",project.id)
                AT1.insert()
                AT2 = Artifact_Type("artifactType2","description",project.id)
                AT2.insert()
                TLT = Traceability_Link_Type("Traceability link type1", "ali", project.id, AT1.id, AT2.id)
                TLT.insert()
                self.assertEqual(updateTraceabilityLinkType(TLT.id, "update test" , "test description", AT1.id, AT2.id), True)
                project.delete()
                user.delete()



        def test_update_traceability_link_type_false(self):
                user = User(username="ali", password="123", email="ali@test.com")
                user.insert()
                project= Project("swe", "welcome", "ali")
                project.insert()
                AT1 = Artifact_Type("artifactType1","description",project.id)
                AT1.insert()
                AT2 = Artifact_Type("artifactType2","description",project.id)
                AT2.insert()
                self.assertEqual(updateTraceabilityLinkType("testID", "update test" , "test description", AT1.id, AT2.id ), False)
                project.delete()
                user.delete() 

        def test_remove_traceability_link_type_success(self):
                user = User(username="ali", password="123", email="ali@test.com")
                user.insert()
                project= Project("swe", "welcome", "ali")
                project.insert()
                AT1 = Artifact_Type("artifactType1","description",project.id)
                AT1.insert()
                AT2 = Artifact_Type("artifactType2","description",project.id)
                AT2.insert()
                TLT = Traceability_Link_Type("Traceability link type1", "ali", project.id, AT1.id, AT2.id)
                TLT.insert()
                self.assertEqual(removeTraceabilityLinkType(TLT.id), True)
                project.delete()
                user.delete()

        def test_remove_artifact_type_false(self):
                self.assertEqual(removeTraceabilityLinkType("testID"),False)
        

if __name__ == '__main__':
    unittest.main()
