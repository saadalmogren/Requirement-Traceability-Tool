from app.mod_user.models import User
from app.mod_project.data_access import *
from app.mod_user.data_access import *
from app.mod_project.models import Project, users_project
from app.mod_role.models import *
from app.mod_role.data_access import *
from flask import Flask
import unittest

app = Flask(__name__)


class RoleTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        

    def test_store_role_success(self):
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        role= Role("admin",project.id)
        storeRole(role)
        self.assertEqual(storeRole(role), True)
        project.delete()
        user.delete()

    # def test_store_role_false(self):    
    #     project= Project("swe", "welcome", "ali")
    #     storeProject(project)
    #     role= Role("admin",project.id)
    #     storeRole(role)
    #     self.assertEqual(storeRole(role), False)
    #     project.delete()
    #     role.delete()

    def test_remove_role_success(self):
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        role= Role("admin",project.id)
        storeRole(role)
        self.assertEqual(removeRole(project.id, role.name), True)
        project.delete()
        user.delete()

    def test_remove_role_false(self):    
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        self.assertEqual(removeRole(project.id, "tester"), False)
        project.delete()
        user.delete()

    def test_get_role_privileges_success(self):    
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        role= Role("admin",project.id)
        storeRole(role)
        privileges = [{"name": "Modify artifact", "type": None}]
        addPrivileges(project.id, role.id, privileges)
        self.assertEqual(getRolePrivileges(project.id, role.id), privileges)
        project.delete()
        user.delete()


    def test_get_role_privileges_false(self): 
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        role= Role("admin",project.id)
        storeRole(role)
        self.assertEqual(getRolePrivileges(project.id, role.name), False)
        project.delete()
        user.delete()
    
    def test_update_role_success(self):    
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        role= Role("admin", project.id)
        storeRole(role)
        self.assertEqual(updateRole(role.id, role.name, project.id), True)
        project.delete()
        user.delete()

    def test_update_role_false(self):    
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        self.assertEqual(updateRole("test", "test", project.id), False)
        project.delete()
        user.delete()

    def test_add_privileges_success(self):    
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        role= Role("admin",project.id)
        storeRole(role)
        self.assertEqual(addPrivileges(project.id, role.id, [{"name": "Modify artifact", "type": None}]), True)
        project.delete()
        user.delete()

    def test_add_privileges_false(self):    
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        role= Role("admin",project.id)
        storeRole(role)
        addPrivileges(project.id, role.id, [{"name": "Modify artifact", "type": None}])
        self.assertEqual(addPrivileges(project.id, role.id, [{"name": "Modify artifact", "type": None}]), False)
        project.delete()
        user.delete()

    def test_delete_privileges_success(self):
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        role= Role("admin",project.id)
        storeRole(role)
        addPrivileges(project.id, role.id, [{"name": "Modify artifact", "type": None}])
        self.assertEqual(deletePrivileges(project.id, role.id, ["Modify artifact"]), True)
        project.delete()
        user.delete()

    def test_delete_privileges_false(self):    
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        project= Project("swe", "welcome", "ali")
        project.insert()
        self.assertEqual(deletePrivileges(project.id, "admin", "Modify artifact"), False)
        project.delete()
        user.delete()


if __name__ == '__main__':
    unittest.main()
