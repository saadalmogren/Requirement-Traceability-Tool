"""empty message

Revision ID: d7d22f9c6ac1
Revises: 68dd1730088d
Create Date: 2021-02-26 22:31:49.884575

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd7d22f9c6ac1'
down_revision = '68dd1730088d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Traceability_Link',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('created_by', sa.String(), nullable=False),
    sa.Column('creation_date', sa.DateTime(), nullable=False),
    sa.Column('version', sa.Integer(), nullable=False),
    sa.Column('traceability_Link_Type', sa.String(), nullable=False),
    sa.Column('project_name', sa.String(), nullable=False),
    sa.Column('first_artifact', sa.String(), nullable=False),
    sa.Column('second_artifact', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['created_by'], ['User.username'], ),
    sa.ForeignKeyConstraint(['first_artifact'], ['Artifact.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['project_name'], ['Project.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['second_artifact'], ['Artifact.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['traceability_Link_Type'], ['Traceability_Link_Type.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Traceability_Link')
    # ### end Alembic commands ###