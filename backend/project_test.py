from app.mod_user.models import User
from app.mod_project.data_access import *
from app.mod_user.data_access import *
from app.mod_project.models import Project, users_project
from app.mod_artifactType.models import *
from app.mod_artifact.models import *
from app.mod_traceabilityLink.models import *
from app.mod_traceabilityLinkType.models import *

from flask import Flask
import unittest

app = Flask(__name__)


class ProjectTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def test_store_project_success(self):
        user = User(username="test", password="123", email="ali@email.com")
        user.insert()
        project= Project("swe", "welcome", "test")
        self.assertEqual(storeProject(project), True)
        project.delete()
        user.delete()

    def test_retrieve_project_success(self):  
        user = User(username="test", password="123", email="ali@email.com")
        user.insert()  
        project= Project("swe", "welcome", "test")
        project.insert()
        self.assertEqual(retrieveProject(project.id), project)
        project.delete()
        user.delete()

    def test_retrieve_project_false(self): 
        self.assertEqual(retrieveProject("654897"), None)

    def test_update_project_success(self):
        user = User(username="test", password="123", email="ali@email.com")
        user.insert()
        project= Project("swe", "welcome", "test")
        project.insert()
        self.assertEqual(updateProject(project.id, "test", "welcome123"), True)
        project.delete()
        user.delete()

    def test_update_project_false(self):
        self.assertEqual(updateProject("654897", "test", "welcome123"), False)
        
    def test_add_user_success(self):
        user = User(username="test", password="123", email="ali@email.com")
        user.insert()
        project= Project("swe", "welcome", "test")
        project.insert()
        user2 = User(username="ali", password="123", email="ali@test.com")
        user2.insert()
        self.assertEqual(addUser(user2, project.id), True)
        project.delete()
        user.delete()
        user2.delete()

    def test_add_user_false(self):
        user = User(username="test", password="123", email="ali@email.com")
        user.insert()
        project= Project("swe", "welcome", "test")
        project.insert()
        user2 = User(username="ali", password="123", email="ali@test.com")
        user2.insert()
        addUser(user2, project.id)
        self.assertEqual(addUser(user2, project.id), False)
        project.delete()
        user.delete()
        user2.delete()

    def test_remove_project_success(self):
        user = User(username="test", password="123", email="ali@email.com")
        user.insert()
        project= Project("swe", "welcome", "test")
        project.insert()
        self.assertEqual(removeProject(project.id), True)
        project.delete()
        user.delete()

    def test_remove_project_false(self): 
        self.assertEqual(removeProject("test"), False)

    def test_remove_user_success(self):
        user = User(username="test", password="123", email="ali@email.com")
        user.insert()
        project= Project("swe", "welcome", "test")
        project.insert()
        user2 = User(username="ali", password="123", email="ali@test.com")
        user2.insert()
        addUser(user2, project.id)
        self.assertEqual(removeUser(user2.username, project.id), True)
        project.delete()
        user.delete()
        user2.delete()
        
    def test_remove_user_false(self):
        user = User(username="test", password="123", email="ali@email.com")
        user.insert()
        project= Project("swe", "welcome", "test")
        project.insert()
        user2 = User(username="ali", password="123", email="ali@test.com")
        user2.insert()
        self.assertEqual(removeUser(user2.username, project.id), False)
        project.delete()
        user.delete()
        user2.delete()

    def test_impact_analysis(self):
        user = User(username="test", password="123", email="ali@email.com")
        user.insert()
        project= Project("swe", "welcome", "test")
        project.insert()
        Type = Artifact_Type("artifactType1", "description", project.id)
        Type.insert()
        artifact1 = Artifact("artifact1","description",user.username,1 , Type.id, project.id )
        artifact1.insert()
        artifact2 = Artifact("artifact1","description",user.username,1 , Type.id, project.id )
        artifact2.insert()
        TLT = Traceability_Link_Type("Traceability link type1", "test", project.id, Type.id, Type.id )
        TLT.insert()
        traceabilityLink = Traceability_Link("traceability", "description", "test", 1, TLT.id, project.id, artifact1.id, artifact2.id)
        traceabilityLink.insert()
        self.assertEqual(getDirectArtifacts(artifact1.id), [{"name": artifact2.name, "Traceability_Link_Type": TLT.name}])
        self.assertEqual(performImpactAnalysis(artifact1.id, artifact1.id, [], []), [])
        project.delete()
        user.delete()

    def test_test_coveage(self):
        user = User(username="test", password="123", email="ali@email.com")
        user.insert()
        project= Project("swe", "welcome", "test")
        project.insert()
        Type1 = Artifact_Type("Requirement", "description", project.id)
        Type1.insert()
        Type2 = Artifact_Type("Test Case", "description", project.id)
        Type2.insert()
        artifact1 = Artifact("artifact1","description",user.username,1 , Type1.id, project.id )
        artifact1.insert()
        artifact2 = Artifact("artifact1","description",user.username,1 , Type2.id, project.id )
        artifact2.insert()
        TLT = Traceability_Link_Type("is verified by", "test", project.id, Type1.id, Type2.id )
        TLT.insert()
        traceabilityLink = Traceability_Link("traceability", "description", "test", 1, TLT.id, project.id, artifact1.id, artifact2.id)
        traceabilityLink.insert()
        self.assertEqual(testCoveredArtifacts(project.id), [artifact1.id])
        self.assertEqual(testUncoveredArtifacts(project.id), [])
        project.delete()
        user.delete()

    def test_elaboration_coverage(self):
        user = User(username="test", password="123", email="ali@email.com")
        user.insert()
        project= Project("swe", "welcome", "test")
        project.insert()
        Type1 = Artifact_Type("Business need", "description", project.id)
        Type1.insert()
        Type2 = Artifact_Type("Requirement", "description", project.id)
        Type2.insert()
        artifact1 = Artifact("artifact1","description",user.username,1 , Type1.id, project.id )
        artifact1.insert()
        artifact2 = Artifact("artifact1","description",user.username,1 , Type2.id, project.id )
        artifact2.insert()
        TLT = Traceability_Link_Type("is origin of", "test", project.id, Type1.id, Type2.id )
        TLT.insert()
        traceabilityLink = Traceability_Link("traceability", "description", "test", 1, TLT.id, project.id, artifact1.id, artifact2.id)
        traceabilityLink.insert()
        self.assertEqual(getCoveredNeeds(project.id), [{"business_need": artifact1.name, "requirements":[artifact2.name]}])
        self.assertEqual(getUncoveredNeeds(project.id), [])
        project.delete()
        user.delete()


if __name__ == '__main__':
    unittest.main()
