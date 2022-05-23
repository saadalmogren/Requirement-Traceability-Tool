from app.mod_user.models import User
from app.mod_project.data_access import *
from app.mod_user.data_access import *
from app.mod_project.models import Project, users_project
from app.mod_artifactType.data_access import *
from app.mod_artifactType.models import *
from flask import Flask
import unittest

app = Flask(__name__)


class artifactTypeTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_store_artifact_type_success(self):
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        Type = Artifact_Type("artifactType1", "description", project.id)
        self.assertEqual(storeArtifactType(Type), True)
        project.delete()
        user.delete()

    def test_update_artifact_type_success(self):
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        Type = Artifact_Type("artifactType1", "description", project.id)
        storeArtifactType(Type)
        self.assertEqual(updateArtifactType(
            Type.id, "test Type", "test description", project.id), True)
        project.delete()
        user.delete()

    def test_update_artifact_type_false(self):
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        self.assertEqual(updateArtifactType(
            "test", "test Type", "test description", project.id), False)
        project.delete()
        user.delete()

    def test_remove_artifact_type_success(self):
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        Type = Artifact_Type("artifactType1", "description", project.id)
        storeArtifactType(Type)
        self.assertEqual(removeArtifactType(Type.id), True)
        project.delete()
        user.delete()

    def test_remove_artifact_type_false(self):
        self.assertEqual(removeArtifactType("test"), False)

if __name__ == '__main__':
    unittest.main()
