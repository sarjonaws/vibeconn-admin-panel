#!/usr/bin/env python3
"""
Script para arreglar las secuencias de autoincremento en PostgreSQL
"""
from sqlalchemy import text
from database import engine

def fix_sequences():
    """
    Sincroniza las secuencias de PostgreSQL con los valores máximos actuales
    """
    tables_with_sequences = [
        ('behavior_prompts', 'id'),
        ('expert_agents', 'id'),
        ('chat_history', 'id'),
        ('api_requests', 'id')
    ]
    
    with engine.connect() as conn:
        print("🔧 Arreglando secuencias de PostgreSQL...\n")
        
        for table_name, column_name in tables_with_sequences:
            try:
                # Obtener el valor máximo actual
                result = conn.execute(text(f"SELECT MAX({column_name}) FROM {table_name}"))
                max_id = result.scalar()
                
                if max_id is None:
                    max_id = 0
                
                # Obtener el nombre de la secuencia
                sequence_name = f"{table_name}_{column_name}_seq"
                
                # Actualizar la secuencia al valor máximo + 1
                new_value = max_id + 1
                conn.execute(text(f"SELECT setval('{sequence_name}', {new_value}, false)"))
                conn.commit()
                
                print(f"✅ {table_name}: secuencia ajustada a {new_value}")
                
            except Exception as e:
                print(f"⚠️  Error en {table_name}: {e}")
        
        print("\n✅ Secuencias arregladas correctamente")

if __name__ == "__main__":
    fix_sequences()
