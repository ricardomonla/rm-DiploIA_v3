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

// Reference to the app-data.json for individual file versions
const APP_DATA_REFERENCE = "app-data.json";

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
    },
    "1.0.1": {
        date: "2025-12-12",
        changes: [
            "Actualización de versiones individuales de archivos",
            "Corrección de errores de linting en app-data.js",
            "Sincronización de versiones globales e individuales"
        ],
        type: "Añadido"
    }
};

// ========== ARCHIVOS A ACTUALIZAR ==========
/**
 * Lista de archivos que requieren actualización manual al cambiar versión.
 * El sistema automático actualiza los marcados como 'auto'.
 * Nota: app-data.json se actualiza automáticamente al modificar versiones de archivos individuales.
 */
const VERSION_UPDATE_FILES = {
    auto: [
        "index.html",
        "package.json",
        "app-data/app-version.js",
        "app-data/app-data.json"
    ],
    manual: [
        "CHANGELOG.md",
        "README.md",
        "src/App.jsx",
        "src/components/rmVerticalScrubber.jsx"
    ],
    // Files managed by app-data.js functions
    dynamic: [
        "app-data/app-data.json"
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
 * Este archivo gestiona la versión GLOBAL de la aplicación (APP_VERSION).
 * app-data.json gestiona las versiones INDIVIDUALES de los archivos.
 * app-data.js proporciona funciones para gestionar ambos sistemas.
 *
 * RELACIÓN ENTRE ARCHIVOS:
 * - app-version.js: Versión global de la aplicación (ej: 1.0.0)
 * - app-data.json: Versiones individuales de archivos (ej: src/App.jsx: 1.0.1)
 * - app-data.js: Lógica para gestionar y sincronizar ambos sistemas
 *
 * PROCESO COMPLETO DE ACTUALIZACIÓN DE VERSIÓN:
 *
 * 1. **Para cambios globales (nueva release)**:
 *    - Modificar APP_VERSION en app-version.js
 *    - Agregar entrada en VERSION_HISTORY
 *    - Actualizar CHANGELOG.md
 *
 * 2. **Para cambios en archivos individuales**:
 *    - Usar funciones de app-data.js (updateFileVersion)
 *    - Esto actualiza app-data.json y sincroniza con app-version.js si es necesario
 *
 * 3. **Sincronización automática**:
 *    - Al actualizar versiones individuales, app-data.js puede actualizar
 *      automáticamente la versión global si se configura así
 *
 * EJEMPLO DE NUEVA VERSIÓN GLOBAL:
 *
 * // En app-version.js
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
 * EJEMPLO DE ACTUALIZACIÓN INDIVIDUAL:
 *
 * // Usar app-data.js
 * import { updateFileVersion } from './app-data.js';
 * await updateFileVersion('app-jsx', '1.0.2');
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
        APP_DATA_REFERENCE,
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
        APP_DATA_REFERENCE,
        VERSION_HISTORY,
        VERSION_UPDATE_FILES,
        getCurrentVersion,
        getAppFullName,
        getVersionHistory,
        validateVersion
    };
}