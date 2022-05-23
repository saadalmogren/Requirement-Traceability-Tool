from app.mod_project.data_access import *
from app.mod_project.models import Project, users_project
from app.mod_artifactType.data_access import *
from app.mod_artifactType.models import *
from app.mod_artifact.data_access import *
from app.mod_artifact.models import *
from app.mod_user.models import User
from app.mod_user.data_access import *
from flask import Flask
import unittest

app = Flask(__name__)


class artifactTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def test_store_artifact_success(self):
        user = User(username="test", password="123", email="ali@test.com")
        user.insert()
        project = Project("swe", "welcome", "test")
        storeProject(project)
        Type = Artifact_Type("artifactType1", "description", project.id)
        Type.insert()
        artifact = Artifact("artifact1","description",user.username,1 , Type.id, project.id )
        self.assertEqual(storeArtifact(artifact) , True)
        project.delete()
        Type.delete()
        user.delete()
        artifact.delete()

    def test_update_artifact_success(self):
        user = User(username="test", password="123", email="ali@test.com")
        user.insert()
        project = Project("swe", "welcome", "test")
        project.insert()
        Type = Artifact_Type("artifactType1", "description", project.id)
        Type.insert()
        artifact = Artifact("artifact1","description",user.username,1 , Type.id, project.id )
        artifact.insert()
        self.assertEqual(updateArtifact(artifact.id,"test name", "test description", Type.id, project.id, user.username) ,True)
        project.delete()
        user.delete()
        

    def test_update_artifact_false(self):
        user = User(username="test", password="123", email="ali@test.com")
        user.insert()
        project = Project("swe", "welcome", "test")
        project.insert()
        Type = Artifact_Type("artifactType1","description",project.id)
        Type.insert()
        self.assertEqual(updateArtifact("fake ID","test name", "test description", Type.id, project.id, user.username) ,False)
        project.delete()
        user.delete()
        

    def test_remove_artifact_success(self):
        user = User(username="test", password="123", email="ali@test.com")
        user.insert()
        project = Project("swe", "welcome", "test")
        project.insert()
        Type = Artifact_Type("artifactType1", "description", project.id)
        Type.insert()
        artifact = Artifact("artifact1","description",user.username,1 , Type.id, project.id )
        artifact.insert()
        self.assertEqual(removeArtifact(artifact.id), True)
        project.delete()
        Type.delete()
        user.delete()
        artifact.delete()

    def test_remove_artifact_false(self):
        self.assertEqual(removeArtifact("test"), False)


if __name__ == '__main__':
    unittest.main()
