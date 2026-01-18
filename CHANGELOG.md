# Changelog - Clases DiploIA

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
