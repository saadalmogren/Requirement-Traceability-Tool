"""empty message

Revision ID: 6822ee96acc7
Revises: 55e746eb7158
Create Date: 2021-03-16 17:53:25.711689

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6822ee96acc7'
down_revision = '55e746eb7158'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Notification',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('pID', sa.String(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('artifact_request_id', sa.String(), nullable=True),
    sa.Column('traceability_link_request_id', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['artifact_request_id'], ['Artifact_Change_Request.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['pID'], ['Project.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['traceability_link_request_id'], ['Traceability_Link_Change_Request.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['username'], ['User.username'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Notification')
    # ### end Alembic commands ###
