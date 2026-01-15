# Clase 9: Automatización de Tareas II

## Hoja de Ruta

1. Introducción y objetivos
2. Diseño de flujos de disparadores: ¿qué son los triggers?
3. Validación inicial de datos - Semáforo
4. Demo y ejercicio: trigger + validación de datos
5. Acciones con IA: la IA decidiendo y enriqueciendo
6. Monitoreo y gestión de errores
7. Estrategias de reintentos y notificaciones
8. Demo y ejercicio: monitoreo de errores y notificación
9. Cierre, preguntas y próxima clase

---

## 1. Objetivos de la Clase

- Entender cómo se disparan las automatizaciones.
- Entender las buenas prácticas implicadas en la gestión de errores.
- Revisar casos reales de triggers y gestión de errores.
- Reflexionar sobre cómo llevar esto a nuestros procesos.

---

## 2. Diseño de Flujos de Disparadores: ¿Qué son los Triggers?

Los triggers son el punto de inicio de cualquier flujo de automatización. Actúan como sensores que detectan cuándo debe ejecutarse un proceso, transformando eventos del mundo real en acciones automatizadas.

Comprender los diferentes tipos de triggers y cuándo usarlos es fundamental para diseñar flujos eficientes y confiables. Cada tipo tiene sus casos de uso específicos y características técnicas que debes conocer.

---

## 3. Tipos Principales de Triggers

### Webhook

- **Descripción:** Recibe datos en tiempo real desde aplicaciones externas.
- **Uso Ideal:** Integraciones entre sistemas que necesitan comunicación instantánea.

### Cron (Programado/Scheduled)

- **Descripción:** Ejecuta tareas a intervalos específicos (cada hora, diario, semanal).
- **Uso Ideal:** Procesos batch y reportes periódicos.

### Nuevo Registro en Plataformas

- **Descripción:** Se activa cuando se agrega una nueva fila en una hoja de cálculo, por ejemplo.
- **Uso Ideal:** Procesar formularios y datos tabulares.

### Formulario Web

- **Descripción:** Dispara el flujo cuando un usuario envía un formulario.
- **Uso Ideal:** Captura de leads y solicitudes de servicio.

---

## 4. El Semáforo de Entrada: Validación Inicial

Antes de procesar cualquier dato, implementa un semáforo de entrada que valide campos mínimos requeridos. Este paso crítico previene errores costosos downstream.

### Pasos para la Validación:

1. **Define campos obligatorios:** Establece qué información es imprescindible para continuar (email, nombre, ID de cliente, etc.).
2. **Valida formato y tipo:** Verifica que los datos tengan el formato correcto antes de procesarlos (email válido, número de teléfono, fecha).
3. **Detén el flujo si falta algo:** Si la validación falla, el flujo no debe continuar. Envía el caso a una cola de revisión manual.

---

## 5. Demo: Sumar un Trigger + Validación de Datos

### Caso de Ejemplo:

- **Trigger:** Cron (correr cada 5 minutos).
- **Validación:** Procesar solo los archivos tipo PDF (filtrado por tipo de archivo encontrado).

---

## 6. Ejercicio: Sumar un Trigger + Validación de Datos en tu Escenario

### Pasos:

1. En un escenario armado, configurar un trigger tipo Cron (correr cada 5 minutos).
2. Sumar un filtro relevante para validar que lleguen los datos necesarios para el proceso.
3. Activar el escenario.
4. Aguardar a que ejecute.
5. **IMPORTANTE:** Desactivar el escenario al finalizar.

---

## 7. Acciones con IA: La IA como Enriquecedor y Decisor

Los pasos de IA no solo procesan datos, sino que toman decisiones inteligentes que determinan el camino del flujo. Son el cerebro de tu automatización.

### Roles de la IA en el Flujo:

- **Clasificar:** Categoriza tickets, emails o documentos.
- **Extraer:** Obtiene información estructurada de texto libre.
- **Rutear:** Decide el siguiente paso según el contenido.

### Ejemplo: Flujo de Clasificación Automática

1. **Email entrante:** Nuevo mensaje llega al sistema.
2. **Validación:** Semáforo verifica campos mínimos.
3. **IA clasifica:** Determina categoría (ventas, soporte, facturación).
4. **Ruteo:** Envía al equipo correcto automáticamente.

---

## 8. Monitoreo y Gestión de Errores

Todo flujo de producción enfrentará problemas. La diferencia entre un sistema robusto y uno frágil está en cómo detectas, manejas y resuelves estos errores. No es cuestión de si ocurrirán problemas, sino cuándo.

Una estrategia sólida de gestión de errores te permite mantener la operación funcionando mientras identificas y corriges issues sistemáticamente.

---

## 9. Dos Categorías de Problemas

### Errores Técnicos

- Problemas de infraestructura y conectividad que escapan al control del negocio:
  - Cortes de servicio y timeouts.
  - Códigos HTTP 4xx/5xx.
  - Límites de cuota API excedidos.
  - Datos con formato técnicamente inválido.

### Errores de Negocio

- Problemas relacionados con la lógica y datos del negocio:
  - Campos requeridos faltantes.
  - Clasificación que retorna vacía.
  - Email sin formato válido.
  - Datos fuera de rango esperado.

---

## 10. Estrategia de Reintentos

### Pasos para Manejar Errores:

1. **Detecta el Error:** El sistema identifica un fallo técnico (timeout, 500, rate limit).
2. **Sleep Corto:** Espera 5-10 segundos antes de reintentar.
3. **Reintento Automático:** Ejecuta la acción nuevamente una vez.
4. **Si Persiste: Notificación y Registro:** Si falla de nuevo, envía un correo o mensaje al responsable y suma un registro en la Dead Letter Queue (hoja de errores).

**Nota:** El reintento simple resuelve la mayoría de errores transitorios sin intervención manual, mejorando la resiliencia del sistema.

---

## 11. Trazabilidad: El Mapa de Cada Ejecución para Entender Errores

Mantén un registro detallado de cada paso para debugging y auditoría. La trazabilidad completa es esencial en producción.

### Campos Clave para la Trazabilidad:

1. **ID de Ejecución:** Identificador único de cada ejecución.
2. **ID de Escenario:** Identificador del escenario ejecutado.
3. **Entrada Original (Input):** Datos de entrada al flujo.
4. **Tipo de Error:** Categoría del error (técnico, negocio).
5. **Mensaje del Error:** Descripción del error.
6. **Detalle del Error:** Información adicional sobre el error.

**Nota:** Estos campos permiten reconstruir exactamente qué pasó en cualquier ejecución, facilitando la resolución de problemas y mejora continua.

---

## 12. Separación con Router: OK vs Error

Implementa un router que separe explícitamente los casos exitosos de los errores de negocio. Esto permite manejarlos de forma diferenciada.

- **Errores Técnicos:** Deben ir directo a reintentos.
- **Errores de Negocio:** Necesitan intervención humana o lógica diferente.

**Nota:** Esta separación clara simplifica el debugging y mejora la visibilidad operacional del sistema.

---

## 13. Demo: Sumar Gestión de Errores en el Escenario

### Caso de Ejemplo:

- Necesito que el flujo NO "rompa" (finalice con error) cuando no se pueda enviar un correo.
- Que me llegue un correo a mi casilla, avisando del error y entregando detalles del mismo.

---

## 14. Ejercicio: Sumar un Manejo de Error en un Nodo del Escenario

### Pasos:

1. En un escenario armado, configurar un "Error handler" a uno de los nodos.
2. Que el tipo, mensaje y detalle del error se envíe por correo.

---

## 15. Cierre

**Preguntas:**
- ¿Dudas o comentarios sobre los temas de hoy?

**Próxima Clase:**
- Creación de herramientas internas y paneles I

**¡Gracias!**