from app.mod_user.models import User
from app.mod_project.data_access import *
from app.mod_user.data_access import *
from app.mod_project.models import Project, users_project
from app.mod_role.data_access import *
from app.mod_role.models import Role
from app.mod_artifactType.data_access import *
from app.mod_artifactType.models import *
from app.mod_artifact.data_access import *
from app.mod_artifact.models import *
from app.mod_traceabilityLinkType.data_access import *
from app.mod_traceabilityLinkType.models import *
from app.mod_traceabilityLink.models import Traceability_Link
from app.mod_artifactChangeRequest.models import *
from app.mod_artifactChangeRequest.data_access import *
from app.mod_traceabilityLink.data_access import *
from app.mod_notification.models import *
from app.mod_notification.data_access import *
from flask import Flask
import unittest

app = Flask(__name__)

class notificationRequestTestCase(unittest.TestCase):
        def setUp(self):
                self.app = app.test_client()
        
        def test_create_notification_success(self):
                user = User(username="ali", password="123", email="ali@test.com")
                user.insert()
                project= Project("swe", "welcome", "ali")
                project.insert()
                artifactType = Artifact_Type("artifactType1","description",project.id)
                artifactType.insert()
                artifact1 = Artifact("artifact1", "description", user.username,1 , artifactType.id, project.id )
                artifact1.insert()
                ACR = Artifact_Change_Request("request", "request description", user.username, "delete", "pending", artifact1.id, artifact1.name, artifactType.id, artifact1.description, project.id)
                ACR.insert()
                role = Role(name = "Project Manager", pID = project.id)
                storeRole(role)
                privileges = [{"name": privilege.name, "type": None} for privilege in getPrivileges()]
                addPrivileges(project.id, role.id, privileges)
                changeUsers_Role_add(project.id, user.username, [role.name])
                self.assertEqual(createNotification(ACR.id, None, project.id), True)
                project.delete()
                user.delete()
       
if __name__ == '__main__':
    unittest.main()
