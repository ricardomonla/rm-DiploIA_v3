//  -----------------------------------------------------------------------------
//  Project:     rm-IAPrompter
//  File:        app-version.js
//  Version:     3.1.12
//  Date:        2025-12-12
//  Author:      Lic. Ricardo MONLA
//  Email:       rmonla@gmail.com
//  Description: Sistema de versionado centralizado para la aplicación.
//  -----------------------------------------------------------------------------
/**
 * SISTEMA DE VERSIONADO CENTRALIZADO - rm-IAPrompter
 *
 * Este archivo centraliza toda la información de versionado de la aplicación.
 * Al actualizar la versión, modifica únicamente los valores aquí y ejecuta
 * el proceso de actualización automática.
 */

// ========== CONFIGURACIÓN DE VERSIÓN ==========
const APP_VERSION = "3.1.12";
const APP_NAME = "rm-IAPrompter";
const APP_FULL_NAME = `${APP_NAME} v${APP_VERSION}`;

// ========== HISTORIAL DE VERSIONES ==========
/**
 * Historial completo de versiones con cambios principales.
 * Se mantiene para referencia y documentación.
 */
const VERSION_HISTORY = {
    "3.1.12": {
        date: "2025-12-12",
        changes: [
            "Corrección de errores de linting en archivos principales",
            "Optimización de hooks en componente rmVerticalScrubber.jsx",
            "Actualización de versiones individuales de archivos"
        ],
        type: "Mejorado"
    },
    "3.1.11": {
        date: "2025-12-07",
        changes: [
            "Mejora en script de lanzamiento: Añadidas opciones --restart-frontend y --restart-backend para reinicio selectivo de componentes, con soporte para modo debug combinable"
        ],
        type: "Mejorado"
    },
    "3.1.10": {
        date: "2025-12-07",
        changes: [
            "Corrección en script de lanzamiento: Implementada lógica para flag --restart que detiene instancias previas antes de iniciar nuevas, previniendo elementos visuales superpuestos"
        ],
        type: "Corregido"
    },
    "3.1.9": {
        date: "2025-12-07",
        changes: [
            "Generación Estructurada de Prompts: Implementada generación de prompts con formato estandarizado de 4 secciones obligatorias ([ROLE], [INSTRUCTIONS], [OUTPUT FORMAT], [USER REQUEST])",
            "Scrollbar Vertical en Panel de Resultados: Implementada regla CSS overflow-y: scroll para mostrar scrollbar vertical de manera consistente",
            "Arquitectura de Prompts: Modificada función sendAI() en index.html para inyectar meta-instrucciones invisibles al usuario",
            "Consistencia Mejorada: Todos los prompts generados siguen un formato técnico optimizado para mejores resultados de IA"
        ],
        type: "Mejorado"
    },
    "3.1.8": {
        date: "2025-12-07",
        changes: [
            "Mejora en funcionalidad de exportación Markdown: implementación de diálogo de guardado y nombre de archivo sugerido con título",
            "Añadida función getCurrentDocumentTitle() para obtener título del documento actual",
            "Modificado formato de nombre de archivo a YYYYMMDD-HHMM_TítuloPrompt.md",
            "Mantenida compatibilidad con exportación TXT"
        ],
        type: "Mejorado"
    },
    "3.1.7": {
        date: "2025-12-06",
        changes: [
            "Corrección crítica de lógica de cambio de modos: solucionado conflicto de variable 'app' redeclarada",
            "Eliminada redeclaración de 'app' en handler IPC que causaba fallo de inicio",
            "Aplicación ahora inicia correctamente sin errores de Electron",
            "Mantenida funcionalidad de cambio automático entre modo mini y expandido"
        ],
        type: "Corregido"
    },
    "3.1.6": {
        date: "2025-12-06",
        changes: [
            "Rebranding de la aplicación: actualización del nombre del launcher de 'MFM Assistant' a 'rm-IAPrompter'",
            "Renombrado del contenedor Docker de 'mfm-backend' a 'rm-iaprompter-backend'",
            "Actualización de referencias en app-run.sh y docker-compose.yml",
            "Incremento de versiones individuales en archivos modificados"
        ],
        type: "Cambiado"
    },
    "3.1.5": {
        date: "2025-12-06",
        changes: [
            "Renombrado del archivo backend de app.py a app-flask.py para seguir estándar de nomenclatura",
            "Actualización de todas las referencias al archivo renombrado en configuración Docker y documentación",
            "Incremento de versiones individuales en archivos modificados"
        ],
        type: "Cambiado"
    },
    "3.1.4": {
        date: "2025-12-04",
        changes: [
            "Reestructuración completa del layout para armonía visual equilibrada",
            "Implementación de dos paneles principales con secciones armoniosas",
            "Sistema centralizado de versionado",
            "Optimización de interfaz de usuario"
        ],
        type: "Mejora(UI)"
    },
    "3.1.3": {
        date: "2025-12-01",
        changes: [
            "Refactorización completa del sistema de plantillas",
            "Migración a navegación directa tipo carrusel",
            "Implementación de edición in-place",
            "Nuevos endpoints API para gestión de plantillas"
        ],
        type: "Añadido"
    },
    "3.0.1": {
        date: "2025-12-02",
        changes: [
            "Actualización de dependencias (Electron 18.3.15)",
            "Optimización de script de inicio",
            "Mejoras en configuración Docker"
        ],
        type: "Cambiado"
    }
};

// ========== ARCHIVOS A ACTUALIZAR ==========
/**
 * Lista de archivos que requieren actualización manual al cambiar versión.
 * El sistema automático actualiza los marcados como 'auto'.
 */
const VERSION_UPDATE_FILES = {
    auto: [
        "app-interface/index.html",  // Título y comentarios
        "app-run.sh",               // Mensaje de launcher
        "app-interface/version.js"  // Constante APP_VERSION (este archivo)
    ],
    manual: [
        "CHANGELOG.md",             // Agregar nueva entrada
        "README.md",                // Actualizar versión en documentación
        "app-interface/package.json", // Si aplica
        "app-flask.py"              // Comentarios de versión
    ]
};

// ========== FUNCIONES DE VERSIONADO ==========
/**
 * Obtiene la versión actual formateada
 */
function getCurrentVersion() {
    return APP_VERSION;
}

/**
 * Obtiene el nombre completo de la aplicación
 */
function getAppFullName() {
    return APP_FULL_NAME;
}

/**
 * Obtiene el historial de versiones
 */
function getVersionHistory() {
    return VERSION_HISTORY;
}

/**
 * Valida que la versión siga el formato semántico (major.minor.patch)
 */
function validateVersion(version = APP_VERSION) {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    return semverRegex.test(version);
}

// ========== PROCESO DE ACTUALIZACIÓN DE VERSIÓN ==========
/**
 * IMPORTANTE: CLARIFICACIÓN SOBRE VERSIONADO
 *
 * Este archivo gestiona la versión de la aplicación en general (APP_VERSION).
 * Cada archivo individual del proyecto mantiene su propia versión independiente,
 * que no necesariamente coincide con la versión global de la aplicación.
 * Estos dos esquemas de versionado (individual vs. aplicación general) son
 * distintos y separados.
 *
 * PROCESO COMPLETO DE ACTUALIZACIÓN DE VERSIÓN:
 *
 * 1. **Modificar APP_VERSION** en este archivo (incrementar según semver: major.minor.patch)
 * 2. **Agregar entrada en VERSION_HISTORY** con fecha, cambios y tipo
 * 3. **Actualizar CHANGELOG.md**:
 *    - Crear nueva sección [X.Y.Z] - YYYY-MM-DD
 *    - Documentar cambios bajo categorías: Añadido, Cambiado, Corregido
 * 4. **Actualizar README.md** si las modificaciones afectan la documentación principal
 * 5. **Verificar package.json** si es necesario (para dependencias)
 * 6. **Actualizar encabezados de archivos** individuales si corresponde (versión independiente)
 * 7. **Probar aplicación** completamente y verificar estabilidad
 * 8. **Ejecutar commit** con mensaje descriptivo siguiendo el formato: "vX.Y.Z: Descripción de cambios"
 *
 * EJEMPLO DE NUEVA VERSIÓN:
 *
 * // Cambiar aquí
 * const APP_VERSION = "3.1.5";
 *
 * // Agregar al historial
 * "3.1.5": {
 *     date: "2025-12-04",
 *     changes: [
 *         "Nueva funcionalidad implementada",
 *         "Corrección de bug en módulo X"
 *     ],
 *     type: "Añadido"
 * }
 *
 * NOTA: Los commits deben reflejar cambios significativos en la aplicación general.
 * Cambios menores en archivos individuales no requieren actualización de APP_VERSION.
 */

// ========== EXPORTACIONES ==========
if (typeof module !== 'undefined' && module.exports) {
    // Para Node.js
    module.exports = {
        APP_VERSION,
        APP_NAME,
        APP_FULL_NAME,
        VERSION_HISTORY,
        VERSION_UPDATE_FILES,
        getCurrentVersion,
        getAppFullName,
        getVersionHistory,
        validateVersion
    };
} else {
    // Para navegador (global)
    window.AppVersion = {
        APP_VERSION,
        APP_NAME,
        APP_FULL_NAME,
        VERSION_HISTORY,
        VERSION_UPDATE_FILES,
        getCurrentVersion,
        getAppFullName,
        getVersionHistory,
        validateVersion
    };
}