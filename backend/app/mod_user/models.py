from app import db, bcrypt
from sqlalchemy import Column, String
from app.mod_project.models import Project, users_project

class User(db.Model):
    __tablename__ = 'User'
    username = db.Column(db.String(), primary_key=True)
    password = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), nullable=False)
    projects = db.relationship(
        'users_project', backref='user', lazy=True, cascade='all, delete')
    roles = db.relationship('users_roles', backref='user', lazy=True, cascade='all, delete')
    def __init__(self, username, password, email):

        self.username = username
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.email = email

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    def verify_password(self, pwd):
        return bcrypt.check_password_hash(self.password, pwd.encode('utf-8'))
