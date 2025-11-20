"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Config table
    op.create_table('config',
        sa.Column('service', sa.String(), nullable=False),
        sa.Column('key', sa.String(), nullable=False),
        sa.Column('value', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('service', 'key')
    )

    # Behavior Prompts table
    op.create_table('behavior_prompts',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('prompt', sa.Text(), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Expert Agents table
    op.create_table('expert_agents',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('topic', sa.String(), nullable=False),
        sa.Column('system_prompt', sa.Text(), nullable=False),
        sa.Column('document_filters', sa.Text(), nullable=True),
        sa.Column('temperature', sa.Float(), nullable=True),
        sa.Column('active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Chat History table
    op.create_table('chat_history',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('session_id', sa.String(), nullable=False),
        sa.Column('user_message', sa.Text(), nullable=False),
        sa.Column('assistant_message', sa.Text(), nullable=False),
        sa.Column('agent_name', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_chat_history_session_id', 'chat_history', ['session_id'])

    # API Requests table
    op.create_table('api_requests',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('session_id', sa.String(), nullable=True),
        sa.Column('full_prompt', sa.Text(), nullable=False),
        sa.Column('response', sa.Text(), nullable=False),
        sa.Column('tokens_used', sa.Integer(), nullable=True),
        sa.Column('response_time_ms', sa.Float(), nullable=True),
        sa.Column('model', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_api_requests_created_at', 'api_requests', ['created_at'])


def downgrade() -> None:
    op.drop_index('ix_api_requests_created_at', table_name='api_requests')
    op.drop_table('api_requests')
    op.drop_index('ix_chat_history_session_id', table_name='chat_history')
    op.drop_table('chat_history')
    op.drop_table('expert_agents')
    op.drop_table('behavior_prompts')
    op.drop_table('config')
