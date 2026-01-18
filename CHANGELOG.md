# Changelog - Clases DiploIA

## [6.6] - 2026-01-17
### Añadido
- Arquitectura ultra-simplificada: Consolidación total de todos los archivos `data.json` de clase en el manifiesto central `index.json`.
- Eliminación de la carga diferida (lazy loading) de archivos JSON individuales, reduciendo el número de peticiones HTTP totales a una sola para toda la metadata del curso.

## [6.5] - 2026-01-17
### Cambiado
- Refactorización de claves en `index.json` por consistencia:
    - `campus_url` -> `url_base_campus`
    - `youtube_base_url` -> `url_base_youtube`

## [6.4] - 2026-01-17
### Añadido
- Progreso de video en Sidebar: el porcentaje visto se muestra ahora en el menú lateral.
- Sincronización en tiempo real del progreso en la interfaz lateral.
- Refinamiento de la persistencia de estado Play/Pause.

## [6.3] - 2026-01-17
### Añadido
- Persistencia del estado de reproducción: el video ahora recuerda si estaba en pausa o "play".
- Indicador visual de progreso: se muestra el porcentaje de reproducción sobre el video.

## [6.2] - 2026-01-17
### Añadido
- Arquitectura unificada: Consolidación de `docus.json` e `index.json` en un manifiesto único.
- Lógica de inicialización optimizada en `script.js` para reducir peticiones HTTP.

## [6.1] - 2026-01-17
### Añadido
- Nueva interfaz de usuario con **Modo Oscuro** (nativo).
- **Sidebar colapsable** y responsivo.
- **Barra de búsqueda** en tiempo real para filtrar clases.
- Integración con la **API de YouTube** para persistencia de progreso (timestamps).
- Resaltado de sintaxis con **Prism.js** para documentos Markdown y YAML.
- Indicadores visuales de progreso (✅/✓) en el selector de clases y lista de documentos.
- Sistema de **Lazy Loading** para carga de metadatos de clase.

### Cambiado
- Estructura de carga de datos: abandono del scraping de HTML por discovery basado en manifiesto.

## [6.0] - Pre-Antigravity
- Versión base de la aplicación con carga dinámica de clases vía scraping y visualización simple de documentos.
