"""empty message

Revision ID: 4283143ad346
Revises: f0eb1e5def9d
Create Date: 2021-03-06 02:42:20.339570

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4283143ad346'
down_revision = 'f0eb1e5def9d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Artifact_Change_Request', sa.Column('reject_reason', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('Artifact_Change_Request', 'reject_reason')
    # ### end Alembic commands ###
