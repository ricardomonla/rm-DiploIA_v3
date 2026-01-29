# Transición a Flujo de Trabajo Solo Navegador (v7.0)

Se ha completado la reestructuración de la plataforma para permitir la gestión total del contenido desde la interfaz web, eliminando la necesidad de editar archivos JSON manualmente.

## Cambios Principales

### 1. Respaldo de Seguridad
- Se creó la carpeta `_vers/rm-DiploIA_v7.0` conteniendo la versión funcional previa.

### 2. Nueva Jerarquía de Datos
- **index.json**: Se migró la estructura plana de clases a una jerarquía de **Cursados -> Clases -> Recursos**.
- Los recursos ahora están tipificados (`Video_YouTube`, `Documento`).

### 3. Servidor y Estructura Estándar
- **Estructura de Carpetas**: Se ha estandarizado la ubicación de los archivos en `data/cursados/` para una mejor organización.
- **index.json**: Se ha limpiado el archivo de datos obsoletos y se ha configurado para apuntar a la nueva ruta base.
- **Creación Automática**: El servidor sigue gestionando la creación de carpetas dentro de la nueva estructura estándar.

### 4. Gestión Rápida desde el Sidebar
- Se han incorporado botones **"+"** directamente en la barra lateral:
  - **Junto al selector**: Para añadir una nueva clase al cursado actual instantáneamente.
  - **Bajo la lista de documentos**: Para añadir un video de YouTube a la clase seleccionada sin navegar por menús complejos.
- La gestión es ahora 100% reactiva al JSON; el servidor solo sincroniza archivos físicos (PDFs) pero respeta la estructura definida en la web.

## Cómo Utilizar el Nuevo Sistema

1.  Haz clic en el icono de engranaje ⚙️ en el pie de la barra lateral.
2.  Desde el modal, puedes editar los nombres de los cursados, niveles y detalles de las clases.
3.  Usa el botón **"＋ YouTube"** para añadir un video a una clase específica.
4.  Haz clic en **"Guardar Cambios"** para persistir la información en el servidor.

> [!TIP]
> Al añadir una clase con un nuevo nombre de carpeta, el servidor la creará por ti en el directorio de documentos.

## Verificación Realizada
- [x] Migración de datos exitosa.
- [x] Navegación funcional entre cursados y clases.
- [x] Guardado de cambios mediante POST verificado.
- [x] Respaldo de seguridad confirmado.
