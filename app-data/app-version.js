//  -----------------------------------------------------------------------------
//  Project:     rm-DiploIA_v3
//  File:        app-version.js
//  Version:     1.0.0
//  Date:        2025-12-12
//  Author:      Lic. Ricardo MONLA
//  Email:       rmonla@gmail.com
//  Description: Sistema de versionado centralizado para la aplicación.
//  -----------------------------------------------------------------------------
/**
 * SISTEMA DE VERSIONADO CENTRALIZADO - rm-DiploIA_v3
 *
 * Este archivo centraliza toda la información de versionado de la aplicación.
 * Al actualizar la versión, modifica únicamente los valores aquí y ejecuta
 * el proceso de actualización automática.
 */

// ========== CONFIGURACIÓN DE VERSIÓN ==========
const APP_VERSION = "1.0.0";
const APP_NAME = "rm-DiploIA_v3";
const APP_FULL_NAME = `${APP_NAME} v${APP_VERSION}`;

// ========== HISTORIAL DE VERSIONES ==========
/**
 * Historial completo de versiones con cambios principales.
 * Se mantiene para referencia y documentación.
 */
const VERSION_HISTORY = {
    "1.0.0": {
        date: "2025-12-12",
        changes: [
            "Versión inicial del proyecto rm-DiploIA_v3",
            "Configuración básica de Vite y React",
            "Componentes principales implementados",
            "Sistema de anotaciones para videos de YouTube"
        ],
        type: "Añadido"
    }
};

// ========== ARCHIVOS A ACTUALIZAR ==========
/**
 * Lista de archivos que requieren actualización manual al cambiar versión.
 * El sistema automático actualiza los marcados como 'auto'.
 */
const VERSION_UPDATE_FILES = {
    auto: [
        "index.html",
        "package.json",
        "app-data/app-version.js"
    ],
    manual: [
        "CHANGELOG.md",
        "README.md",
        "src/App.jsx",
        "src/components/rmVerticalScrubber.jsx"
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
 * const APP_VERSION = "1.0.1";
 *
 * // Agregar al historial
 * "1.0.1": {
 *     date: "2025-12-13",
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