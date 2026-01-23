# Changelog - Clases DiploIA

## [7.0] - 2026-01-23
### Añadido
- **Preparación Clase 16**: Creada estructura para "Definición del proyecto y plan de acción" (29/01/26).
- **Metadata Enriquecida**:
    - IDs de YouTube y Campus actualizados para Clase 15.
    - Enlace de LinkedIn del docente Darío Ezequiel Alvarez en Clase 15.
- **Sincronización de Cronograma**:
    - Ajuste de nombres y carpetas según `Cronograma_del_Curso.pdf`.
    - Corrección de erratas ("botella" vs "botellas") y estandarización de mayúsculas/minúsculas en títulos.
    - Soporte para caracteres especiales (tildes) en nombres de directorios.

## [6.9] - 2026-01-18
### Añadido
- **Refinement "Cyber-Tech Refined"**:
    - **Custom Scrollbars**: Implementación de barras de desplazamiento personalizadas más delgadas y con estilos neón para eliminar la disonancia visual con el tema oscuro.
    - **Migración Integral a Lucide Icons**: Reemplazo de todos los emojis por iconos vectoriales (**Lucide Library**) para una estética geométrica, futurista y profesional.
    - **Iconografía Dinámica**: Los iconos cambian de estado visualmente según la interacción (Abrir/Cerrar, Sol/Luna).
    - **Checkmarks Modernizados**: Los marcadores de completado ahora utilizan destellos ("✨") y Lucide SVGs para un acabado más limpio.

## [6.8] - 2026-01-18
### Añadido
- **Adopción Total de Plantilla "Cyber-Tech"**:
    - Estética inspirada en `theapexweb.com` replicada íntegramente con CSS/HTML.
    - **Atmósfera Inmersiva**: Implementación de "Glow Blobs" de fondo con gradientes radiales animados y desenfoque (blur).
    - **Glassmorphism Avanzado**: Contenedores (Sidebar, Header) con `backdrop-filter` para un efecto de cristal esmerilado premium.
    - **Neo-Glow System**: Bordes con brillo neón y sombras proyectadas (`box-shadow`) en azul vibrante (#00A3FF).
    - **Identidad Visual**: Tipografía futurista **Rajdhani** para encabezados e **Inter** para cuerpo de texto.
- **Micro-interacciones**: Transiciones de escala y brillo en botones al pasar el pulsor.

## [6.7] - 2026-01-18
### Añadido
- **Simetría y Balance Visual**:
    - Estandardización de bordes redondeados (**8px**) en toda la interfaz (selectores, inputs, botones, contenedores).
    - Alineación de **eje horizontal (Axis)**: el botón de colapso y el título de clase comparten ahora el mismo eje central (vertex).
    - Centrado horizontal de controles en la barra lateral colapsada.
    - **Tooltips dinámicos** para todos los recursos en la barra lateral colapsada.
    - **Resaltado visual activo** del recurso seleccionado en el menú lateral.
- **Diseño Responsivo & Contenido**:
    - El área de contenido principal ahora ocupa el **100% del ancho** disponible.
    - Expansión automática del contenido al contraer la barra lateral.
- **Optimización de Video**:
    - Límite de altura inteligente (**80vh**) para garantizar que los controles de YouTube siempre sean visibles y accesibles.
    - Overlay de progreso "Visto: X%" refinado: visibilidad contextual solo para recursos de video.

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
