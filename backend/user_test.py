from app.mod_user.models import User
from app.mod_user.data_access import *
from flask import Flask
import unittest

app = Flask(__name__)


class UserTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def test_check_register_success(self):
        self.assertEqual(checkRegister("test", "ali@email.com"), True)

    def test_check_register_false(self):
        user = User(username="test", password="123", email="ali@email.com")
        user.insert()
        self.assertEqual(checkRegister("test", "ali@email.com"), False)
        user.delete()

    def test_check_login_success(self):
        user = User(username="ali", password="ali123", email="ali@test.com")
        user.insert()
        self.assertEqual(checkLogin("ali", "ali123"), True)
        user.delete()

    def test_check_Login_False(self):
        user = User(username="ali", password="ali123", email="ali@test.com")
        user.insert()
        self.assertEqual(checkLogin("ali", "ali1234"), False)
        user.delete()

    def test_retrieve_user_success(self):
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        self.assertEqual(retrieveUser("ali"), user)
        user.delete()

    def test_retrieve_user_false(self):
        self.assertEqual(retrieveUser("test"), None)

    def test_update_account_information_success(self):
        user = User(username="ali2", password="ali123", email="ali2@test.com")
        user.insert()
        self.assertEqual(updateAccountInformation(user), True)
        user.delete()

    def tset_check_account_information_success(self):
        user = User(username="ali4", password="ali123", email="ali123@test.com")
        user.insert()
        self.assertEqual(checkAccountInformation("ali234@test.com"), True)
        user.delete()
    def test_check_account_information_false(self):
        user = User(username="ali4", password="ali123", email="ali123@test.com")
        user.insert()
        user2 = User(username="ali5", password="ali123", email="ali123@test.com")
        user2.insert()
        self.assertEqual(checkAccountInformation("ali123@test.com"), False)
        user.delete()
        user2.delete()


    def test_check_user_success(self):
        user = User(username="ali", password="123", email="ali@test.com")
        user.insert()
        self.assertEqual(checkUser("ali"), True)
        user.delete()

    def test_check_user_false(self):
        self.assertEqual(checkUser("test_false"), False)

    def test_store_user_success(self):
        user = User(username="ali12345", password="123", email="ali12345@test.com")
        self.assertEqual(storeUser(user), True)
        user.delete()


if __name__ == '__main__':
    unittest.main()
