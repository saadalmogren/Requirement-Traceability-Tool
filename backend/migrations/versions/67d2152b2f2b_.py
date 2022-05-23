"""empty message

Revision ID: 67d2152b2f2b
Revises: 
Create Date: 2021-02-09 16:56:37.416326

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '67d2152b2f2b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Privilege',
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('name')
    )
    op.create_table('Project',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('User',
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('username')
    )
    op.create_table('Artifact_Type',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('project_name', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['project_name'], ['Project.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('Role',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('pID', sa.String(), nullable=True),
    sa.Column('name', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['pID'], ['Project.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users_project',
    sa.Column('p_id', sa.String(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['p_id'], ['Project.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['username'], ['User.username'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('p_id', 'username')
    )
    op.create_table('Artifact',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('created_by', sa.String(), nullable=False),
    sa.Column('creation_date', sa.DateTime(), nullable=False),
    sa.Column('version', sa.Integer(), nullable=False),
    sa.Column('artifact_type', sa.String(), nullable=False),
    sa.Column('project_name', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['artifact_type'], ['Artifact_Type.id'], ),
    sa.ForeignKeyConstraint(['created_by'], ['User.username'], ),
    sa.ForeignKeyConstraint(['project_name'], ['Project.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('roles_privileges',
    sa.Column('role_id', sa.String(), nullable=False),
    sa.Column('privilege_name', sa.String(), nullable=False),
    sa.Column('pID', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['pID'], ['Project.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['privilege_name'], ['Privilege.name'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['role_id'], ['Role.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('role_id', 'privilege_name', 'pID')
    )
    op.create_table('users_roles',
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('role_id', sa.String(), nullable=False),
    sa.Column('pID', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['pID'], ['Project.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['role_id'], ['Role.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['username'], ['User.username'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('username', 'role_id', 'pID')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users_roles')
    op.drop_table('roles_privileges')
    op.drop_table('Artifact')
    op.drop_table('users_project')
    op.drop_table('Role')
    op.drop_table('Artifact_Type')
    op.drop_table('User')
    op.drop_table('Project')
    op.drop_table('Privilege')
    # ### end Alembic commands ###
