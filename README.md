# VibeConnections Admin Panel

Panel de administración minimalista para gestionar configuraciones OpenAI en tiempo real.

## 🚀 Inicio Rápido

### Windows
```bash
start_admin.bat
```

### Linux/Mac
```bash
chmod +x start_admin.sh
./start_admin.sh
```

**Acceder**: http://localhost:9000

## ⚠️ Solución de Problemas

### Error de dimensión de vectores
Si ves: `Vector dimension error: expected dim: 1536, got 384`

**Solución**:
```bash
cd admin-panel
fix_qdrant.bat
```

## 📋 Características

- ✅ Configuración OpenAI en tiempo real
- ✅ Monitoreo de estado de servicios
- ✅ Subir documentos e indexar
- ✅ Hacer preguntas RAG con OpenAI
- ✅ Ver estadísticas del sistema
- ✅ Interfaz minimalista

## 🎯 Servicios Gestionados

| Servicio | Puerto | Función |
|----------|--------|---------|
| **Compress Service** | 8002 | Compresión semántica + OpenAI embeddings |
| **Vector Engine** | 8000 | FAISS local + Qdrant |
| **Semantic Context** | 8001 | RAG + OpenAI chat completions |

## 🔧 Configuración

### Compress Service (8002)
- `openai_api_key` - API key de OpenAI
- `llm_model` - Modelo para compresión (gpt-4o-mini)
- `embedding_model` - Modelo embeddings (text-embedding-3-small)
- `domain_context` - Contexto del dominio
- `qdrant_url` - URL de Qdrant
- `qdrant_collection` - Nombre de colección

### Vector Engine (8000)
- `model_name` - Modelo local (all-MiniLM-L6-v2)
- `vector_dimension` - Dimensión vectores (384)
- `compression_service_url` - URL compress service
- `qdrant_url` - URL de Qdrant
- `qdrant_collection` - Nombre de colección

### Semantic Context (8001)
- `openai_api_key` - API key de OpenAI
- `openai_model` - Modelo chat (gpt-4o-mini)
- `vector_engine_url` - URL vector engine
- `top_k_results` - Número de resultados
- `max_context_tokens` - Tokens máximos
- `similarity_threshold` - Umbral similitud
- `llm_temperature` - Temperatura
- `default_language` - Idioma (es)

## 🔑 Configurar OpenAI

1. Obtén tu API key: https://platform.openai.com/api-keys
2. En el admin panel:
   - **Compress Service**: Pega tu API key en `openai_api_key`
   - **Semantic Context**: Pega tu API key en `openai_api_key`
3. Click "Aplicar" o "Guardar"

## 📝 Uso

### Subir Documentos
1. Ingresa ID único
2. Pega contenido
3. Click "Indexar"
4. Se comprime con OpenAI y vectoriza

### Hacer Preguntas
1. Escribe pregunta
2. Click "Consultar"
3. RAG busca contexto + OpenAI genera respuesta

## 🛠️ Tecnologías

- **Backend**: FastAPI + httpx
- **Frontend**: HTML/CSS/JS vanilla
- **LLM**: OpenAI (embeddings + chat)
- **Vectores**: FAISS + Qdrant

## 📊 Arquitectura

```
Admin Panel (9000)
  ↓
├─→ Compress (8002) - OpenAI embeddings + compresión
├─→ Vector (8000) - FAISS + Qdrant
└─→ Semantic (8001) - OpenAI chat completions + RAG
```

## 💡 Notas

- Toda la arquitectura usa OpenAI
- Cambios se aplican sin reiniciar
- API key se oculta (muestra solo primeros 8 chars)
- Configuraciones en memoria (no persisten en .env)
