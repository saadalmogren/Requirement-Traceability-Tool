from flask import Blueprint
from app.mod_role.models import Role, roles_privileges, users_roles, Privilege

seed_privileges = Blueprint('seed', __name__)


@seed_privileges.cli.command('privileges')
def seed():
    """Seed the database."""
    p1 = Privilege(name='Create artifact')
    p1.insert()

    p2 = Privilege(name='Modify artifact')
    p2.insert()

    p3 = Privilege(name='Remove artifact')
    p3.insert()

    p4 = Privilege(name='Create traceability link')
    p4.insert()

    
    p24 = Privilege(name='Modify traceability link')
    p24.insert()

    p25 = Privilege(name='Remove traceability link')
    p25.insert()


    p5 = Privilege(name='Define new artifact type')
    p5.insert()

    p6 = Privilege(name='Modify artifact type')
    p6.insert()

    p7 = Privilege(name='Remove artifact type')
    p7.insert()

    p8 = Privilege(name='Define new traceability link type')
    p8.insert()

    p9 = Privilege(name='Modify traceability link type')
    p9.insert()

    p10 = Privilege(name='Remove traceability link type')
    p10.insert()

    p11 = Privilege(name='View, accept, and reject change request')
    p11.insert()

    p12 = Privilege(name='Add user to project')
    p12.insert()

    p13 = Privilege(name='Remove user from project')
    p13.insert()

# Unique Privileges
    p14 = Privilege(name='Modify project information')
    p14.insert()

    p15 = Privilege(name='View project roles')
    p15.insert()

    p16 = Privilege(name='Create new role')
    p16.insert()

    p17 = Privilege(name='Modify role')
    p17.insert()

    p18 = Privilege(name='Remove role')
    p18.insert()

    p19 = Privilege(name='Change user role')
    p19.insert()

    p20 = Privilege(name='Change management')
    p20.insert()

# of a specific type
    p21 = Privilege(name='Create artifact of a specific type')
    p21.insert()

    p22 = Privilege(name='Modify artifact of a specific type')
    p22.insert()

    p23 = Privilege(name='Remove artifact of a specific type')
    p23.insert()
