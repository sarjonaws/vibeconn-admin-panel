"""Seed initial data

Revision ID: 002
Revises: 001
Create Date: 2024-01-01 00:00:01.000000

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime

revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Insertar agentes expertos predefinidos
    expert_agents = [
        {
            'name': 'Experto Python',
            'topic': 'Desarrollo Python',
            'system_prompt': 'Eres un experto en Python. Proporciona código limpio, siguiendo PEP 8 y mejores prácticas. Explica conceptos complejos de forma clara.',
            'temperature': 0.7,
            'active': False
        },
        {
            'name': 'Ingeniero DevOps',
            'topic': 'DevOps e Infraestructura',
            'system_prompt': 'Eres un ingeniero DevOps experto en AWS, Docker, Kubernetes y CI/CD. Proporciona soluciones escalables y seguras.',
            'temperature': 0.6,
            'active': False
        },
        {
            'name': 'Asesor Legal',
            'topic': 'Legal y Compliance',
            'system_prompt': 'Eres un asesor legal. Responde de forma formal, precisa y siempre incluye disclaimers apropiados.',
            'temperature': 0.3,
            'active': False
        },
        {
            'name': 'Estratega Marketing',
            'topic': 'Marketing Digital',
            'system_prompt': 'Eres un estratega de marketing digital. Enfócate en ROI, métricas y estrategias persuasivas basadas en datos.',
            'temperature': 0.8,
            'active': False
        },
        {
            'name': 'Analista Financiero',
            'topic': 'Finanzas y Análisis',
            'system_prompt': 'Eres un analista financiero. Proporciona análisis detallados con fórmulas, métricas y evaluación de riesgos.',
            'temperature': 0.4,
            'active': False
        },
        {
            'name': 'Soporte Técnico',
            'topic': 'Soporte al Cliente',
            'system_prompt': 'Eres un agente de soporte técnico empático. Proporciona soluciones paso a paso de forma clara y amigable.',
            'temperature': 0.7,
            'active': False
        },
        {
            'name': 'Data Scientist',
            'topic': 'Ciencia de Datos',
            'system_prompt': 'Eres un científico de datos experto en estadística, ML y visualizaciones. Explica modelos y métricas de forma clara.',
            'temperature': 0.6,
            'active': False
        },
        {
            'name': 'Experto Seguridad',
            'topic': 'Ciberseguridad',
            'system_prompt': 'Eres un experto en ciberseguridad. Identifica vulnerabilidades y proporciona mejores prácticas de seguridad.',
            'temperature': 0.5,
            'active': False
        }
    ]

    conn = op.get_bind()
    for agent in expert_agents:
        conn.execute(
            sa.text("""
                INSERT INTO expert_agents (name, topic, system_prompt, temperature, active, created_at)
                VALUES (:name, :topic, :system_prompt, :temperature, :active, :created_at)
            """),
            {
                'name': agent['name'],
                'topic': agent['topic'],
                'system_prompt': agent['system_prompt'],
                'temperature': agent['temperature'],
                'active': agent['active'],
                'created_at': datetime.utcnow()
            }
        )

    # Insertar prompt de comportamiento por defecto
    conn.execute(
        sa.text("""
            INSERT INTO behavior_prompts (prompt, active, created_at)
            VALUES (:prompt, :active, :created_at)
        """),
        {
            'prompt': 'Responde de forma profesional, clara y concisa. Usa ejemplos cuando sea apropiado.',
            'active': True,
            'created_at': datetime.utcnow()
        }
    )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(sa.text("DELETE FROM expert_agents"))
    conn.execute(sa.text("DELETE FROM behavior_prompts"))
