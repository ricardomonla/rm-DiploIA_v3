#!/bin/bash

#  -----------------------------------------------------------------------------
#  Project:     rm-IAPrompter
#  File:        app-run.sh
#  Version:     v1.0.5
#  Date:        2025-12-07
#  Author:      Lic. Ricardo MONLA
#  Email:       rmonla@gmail.com
#  Description: Script para ejecutar la aplicación en un contenedor Docker.
#  -----------------------------------------------------------------------------

# --- Definiciones ---
ELECTRON_DIR="app-interface"
ENV_FILE=".env"
DATA_DIR="./app-data"
CONTAINER_NAME="rm-iaprompter-backend"
LOG_DIR="./app-logs"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Leer versión desde archivo centralizado
VERSION=$(node -e "const v=require('./app-version.js'); console.log(v.APP_VERSION);")

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Variables de Estado
DEBUG_MODE=false
STOP_MODE=false
RESTART_MODE=false
RESTART_FRONTEND_MODE=false
RESTART_BACKEND_MODE=false

# --- Funciones ---

function show_usage() {
    echo "Uso: $0 [opciones]"
    echo "Opciones:"
    echo "  -d, --debug                 Ejecuta en modo debug con logging activo."
    echo "  -s, --stop                  Detiene todos los servicios."
    echo "  -r, --restart               Reinicia todos los servicios."
    echo "  -rf, --restart-frontend     Reinicia solo el frontend."
    echo "  -rb, --restart-backend      Reinicia solo el backend."
    echo "  -h, --help                  Muestra esta ayuda."
    echo ""
    echo "Ejemplos:"
    echo "  $0                          Inicia la aplicación normalmente."
    echo "  $0 --restart-frontend --debug  Reinicia el frontend en modo debug."
}

function check_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker compose"
    else
        echo -e "${RED}❌ Error Crítico: No se encontró Docker Compose.${NC}"
        exit 1
    fi
}

function setup_security() {
    # Solo ejecuta si no existe la clave o si el archivo no existe
    if [ ! -f "$ENV_FILE" ] || ! grep -q "GEMINI_API_KEY_ENCRYPTED" "$ENV_FILE"; then
        echo -e "${YELLOW}>> Configuración de seguridad inicial necesaria.${NC}"
        
        read -sp "1. Introduce tu API Key de Gemini REAL: " REAL_API_KEY
        echo ""
        read -sp "2. Crea una Clave Maestra (la usarás para desbloquear la app): " MASTER_KEY
        echo ""
        
        if [ -z "$REAL_API_KEY" ] || [ -z "$MASTER_KEY" ]; then
            echo -e "${RED}Error: Las claves no pueden estar vacías.${NC}"
            exit 1
        fi

        echo "Encriptando credenciales..."
        
        # --- BLOQUE DE ENCRIPTACIÓN ---
        ENCRYPTED_VALUE=$(docker run --rm python:3.11-slim /bin/bash -c "
pip install cryptography > /dev/null 2>&1 && python -c '
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

master_key = \"$MASTER_KEY\".encode()
api_key = \"$REAL_API_KEY\"
salt = b\"mfm_assistant_salt\"

kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=480000)
key = base64.urlsafe_b64encode(kdf.derive(master_key))
f = Fernet(key)
print(f.encrypt(api_key.encode()).decode())
'")
        # ------------------------------

        if [ -z "$ENCRYPTED_VALUE" ]; then
            echo -e "${RED}Error: Falló la encriptación. Verifica Docker.${NC}"
            exit 1
        fi

        echo "GEMINI_API_KEY_ENCRYPTED=$ENCRYPTED_VALUE" > "$ENV_FILE"
        echo -e "${GREEN}✅ Archivo .env generado correctamente.${NC}"
    fi
}

function stop_services() {
    echo -e "${YELLOW}>> Deteniendo servicios...${NC}"
    $DOCKER_COMPOSE_CMD down --remove-orphans
    pkill -f "electron" || true
    echo -e "${GREEN}✅ Servicios detenidos.${NC}"
}

function stop_frontend() {
    echo -e "${YELLOW}>> Deteniendo interfaz...${NC}"
    pkill -f "electron" || true
    echo -e "${GREEN}✅ Interfaz detenida.${NC}"
}

function stop_backend() {
    echo -e "${YELLOW}>> Deteniendo backend...${NC}"
    $DOCKER_COMPOSE_CMD down --remove-orphans
    echo -e "${GREEN}✅ Backend detenido.${NC}"
}

function start_frontend() {
    echo -e "${BLUE}>> Iniciando Interfaz Electron ($ELECTRON_DIR)...${NC}"
    cd "$ELECTRON_DIR" || exit
    
    if [ ! -d "node_modules" ]; then
         echo "Instalando dependencias npm..."
         npm install > /dev/null 2>&1
    fi

    if [ "$DEBUG_MODE" = true ]; then
        TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
        FRONTEND_LOG="../$LOG_DIR/frontend_$TIMESTAMP.log"
        echo -e "${CYAN}🐛 MODO DEBUG (LOGGING ACTIVO): La terminal se liberará.${NC}"
        
        export MFM_DEBUG=true
        export ELECTRON_ENABLE_LOGGING=true
        
        npm start -- --disable-gpu --enable-logging --v=1 > "$FRONTEND_LOG" 2>&1 &
        
        echo -e "${GREEN}✨ Interfaz iniciada.${NC}"
        echo -e "   📄 Log Frontend: ${YELLOW}$FRONTEND_LOG${NC}"
        echo -e "   Usa ${YELLOW}tail -f $FRONTEND_LOG${NC} para monitorear manualmente."
        
    else
        npm start -- --disable-gpu > /dev/null 2>&1 &
        echo -e "${GREEN}✨ Interfaz iniciada en segundo plano.${NC}"
    fi
    cd ..
}

function start_backend() {
    echo -e "${BLUE}>> Iniciando Backend...${NC}"
    $DOCKER_COMPOSE_CMD up -d --build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al iniciar Docker Compose.${NC}"
        exit 1
    fi
    if [ "$DEBUG_MODE" = true ]; then
        TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
        BACKEND_LOG="$LOG_DIR/backend_$TIMESTAMP.log"
        echo -e "${CYAN}🐛 MODO DEBUG (LOGGING ACTIVO): La terminal se liberará.${NC}"
        
        docker logs -f "$CONTAINER_NAME" > "$BACKEND_LOG" 2>&1 &
        
        echo -e "${GREEN}✨ Backend iniciado.${NC}"
        echo -e "   📄 Log Backend:  ${YELLOW}$BACKEND_LOG${NC}"
        echo -e "   Usa ${YELLOW}tail -f $BACKEND_LOG${NC} para monitorear manualmente."
    else
        echo -e "${GREEN}✨ Backend iniciado en segundo plano.${NC}"
    fi
}

function start_app() {
    # 1. Directorios
    if [ ! -d "$DATA_DIR" ]; then
        mkdir -p "$DATA_DIR"
        echo -e "${GREEN}📂 Directorio de datos creado.${NC}"
    fi
    mkdir -p "$LOG_DIR"

    # 2. Backend
    echo -e "${BLUE}>> Iniciando Backend...${NC}"

    $DOCKER_COMPOSE_CMD down --remove-orphans > /dev/null 2>&1

    $DOCKER_COMPOSE_CMD up -d --build

    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al iniciar Docker Compose.${NC}"
        exit 1
    fi

    # 3. Frontend
    echo -e "${BLUE}>> Iniciando Interfaz Electron ($ELECTRON_DIR)...${NC}"
    cd "$ELECTRON_DIR" || exit
    
    if [ ! -d "node_modules" ]; then
         echo "Instalando dependencias npm..."
         npm install > /dev/null 2>&1
    fi

    if [ "$DEBUG_MODE" = true ]; then
        # --- MODO DEBUG DESATENDIDO (BACKGROUND LOGGING) ---
        TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
        BACKEND_LOG="../$LOG_DIR/backend_$TIMESTAMP.log"
        FRONTEND_LOG="../$LOG_DIR/frontend_$TIMESTAMP.log"

        echo -e "${CYAN}🐛 MODO DEBUG (LOGGING ACTIVO): La terminal se liberará.${NC}"
        
        export MFM_DEBUG=true
        export ELECTRON_ENABLE_LOGGING=true

        # Backend Logs: Redirección directa al archivo (sin tee, sin stdout)
        # Se ejecuta en background para no bloquear
        docker logs -f "$CONTAINER_NAME" > "$BACKEND_LOG" 2>&1 &
        
        # Frontend: Ejecución en background, toda la salida al archivo
        npm start -- --disable-gpu --enable-logging --v=1 > "$FRONTEND_LOG" 2>&1 &
        
        echo -e "${GREEN}✨ Aplicación iniciada.${NC}"
        echo -e "   📄 Log Backend:  ${YELLOW}$BACKEND_LOG${NC}"
        echo -e "   📄 Log Frontend: ${YELLOW}$FRONTEND_LOG${NC}"
        echo -e "   Usa ${YELLOW}tail -f $FRONTEND_LOG${NC} para monitorear manualmente."
        
        cd ..
    else
        # --- MODO PRODUCCIÓN (ESTÁNDAR) ---
        npm start -- --disable-gpu > /dev/null 2>&1 &
        echo -e "${GREEN}✨ Aplicación iniciada en segundo plano.${NC}"
        cd ..
    fi
}

# --- Procesamiento de Argumentos ---
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -d|--debug) DEBUG_MODE=true ;;
        -s|--stop) STOP_MODE=true ;;
        -r|--restart) RESTART_MODE=true ;;
        -rf|--restart-frontend) RESTART_FRONTEND_MODE=true ;;
        -rb|--restart-backend) RESTART_BACKEND_MODE=true ;;
        -h|--help) show_usage; exit 0 ;;
        *) echo "Opción desconocida: $1"; show_usage; exit 1 ;;
    esac
    shift
done

# --- Ejecución Principal ---
echo -e "${BLUE}===== rm-IAPrompter Launcher v${VERSION} =====${NC}"

check_docker_compose
if [ "$RESTART_MODE" = true ]; then
    stop_services
elif [ "$RESTART_FRONTEND_MODE" = true ] || [ "$RESTART_BACKEND_MODE" = true ]; then
    if [ "$RESTART_FRONTEND_MODE" = true ]; then
        stop_frontend
    fi
    if [ "$RESTART_BACKEND_MODE" = true ]; then
        stop_backend
    fi
fi

if [ "$STOP_MODE" = true ]; then
    stop_services
    exit 0
fi

setup_security

if [ "$RESTART_MODE" = true ] || ( [ "$RESTART_FRONTEND_MODE" = false ] && [ "$RESTART_BACKEND_MODE" = false ] ); then
    start_app
else
    if [ "$RESTART_FRONTEND_MODE" = true ]; then
        start_frontend
    fi
    if [ "$RESTART_BACKEND_MODE" = true ]; then
        start_backend
    fi
fi