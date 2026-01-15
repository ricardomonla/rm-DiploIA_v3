# Clase 11: Creación de Herramientas Internas y Paneles II

## Hoja de Ruta

1. Entender la diferencia crítica: analítico vs operativo.
2. Conocer el poder de las plataformas No-Code.
3. Construir una app operativa con Glide.
4. Usar IA para generar herramientas completas.
5. Integrar inteligencia artificial en tus apps.
6. Aplicar el ciclo de iteración MVP.
7. Recolectar feedback efectivo.
8. Priorizar mejoras con método estructurado.
9. Integrar el stack completo: panel + app + automatización.
10. Aplicar aprendizajes a un caso real propio.

---

## Objetivos de la Clase

- Construir herramientas operativas con No-Code.
- Integrar IA mediante APIs (Google AI Studio).
- Diseñar ciclos de iteración basados en feedback.
- Pasar de la teoría a la práctica con apps reales.

---

## Recap Clase 10

**Lo que construimos:**
- Dashboard analítico en LookerStudio.
- Panel para visualizar performance comercial.
- Intro a herramientas operativas.

**Hoy: El Salto**
- De VER datos a ACTUAR sobre datos.
- Construimos apps funcionales sin código.
- Sumamos inteligencia artificial al stack.

---

## Analítico vs Operativo

| **Aspecto**          | **Analítico**                          | **Operativo**                          |
|-----------------------|----------------------------------------|----------------------------------------|
| **Enfoque**           | "VER DATOS"                           | "MODIFICAR DATOS"                     |
| **Tipo**              | Dashboard pasivo                       | App interactiva                        |
| **Herramientas**      | LookerStudio, Tableau                  | Glide, AppSheet, Firebase, Gemini       |
| **Pregunta Clave**    | "¿Qué pasó?"                          | "¿Qué hago?"                          |

---

## Herramientas Internas: Casos de Uso

- CRM liviano para equipos chicos.
- Sistema de gestión de oportunidades.
- Registro de incidencias de soporte.
- Base de conocimiento interna.
- Solicitudes de compras.
- Onboarding de empleados.

**Costo por Usuario/Mes:**
- Herramientas tradicionales: $50-$150.
- No-Code: $0-$10.

**Beneficio:** La democratización del software interno.

---

## Caso Inspirador: Startup Argentina

| **Aspecto**          | **Antes**                              | **Solución**                           | **Resultado**                         |
|-----------------------|----------------------------------------|----------------------------------------|----------------------------------------|
| **Contexto**          | 15 personas en equipo comercial.       | Reemplazo con Glide + Google Sheets.    | $27.000 ahorrados/año.                |
| **Herramienta**       | Salesforce ($2.250/mes).                | Costo: $0 (Free Tier).                  | Misma funcionalidad clave.            |
| **Problema**          | 50% de funciones sin usar.             | Tiempo: 2 semanas.                     | Mayor adopción del equipo.            |

---

## ¿Qué es Glide?

Plataforma No-Code que convierte Google Sheets en apps visuales al instante.

### Características:

- **Lógica Simple:**
  - Fila = Ítem en la app.
  - Columna = Campo de dato.

- **Free Tier Generoso:**
  - 500 filas de datos.
  - Apps ilimitadas.
  - Ideal para MVPs y herramientas internas.

---

## Componentes Principales de Glide

| **Componente**       | **Descripción**                                |
|-----------------------|-----------------------------------------------|
| **Listas**            | Vista general de ítems.                       |
| **Formularios**       | Input de nuevos datos.                        |
| **Vista Detalle**     | Ver/editar ítem específico.                   |
| **Acciones**          | Botones lógicos.                              |
| **Filtros**           | Segmentación dinámica.                        |

---

## Demo en Vivo: De Google Sheet a App en 5 Minutos

**Enlace:** [Glide Apps](https://glideapps.com)

---

## Ejercicio #3: App Oportunidades

**Duración:** 25 minutos

**Misión:** Crear app móvil para registrar oportunidades desde la calle.

**Dataset:** Ventas_Trimestrales.xlsx

**Contexto:** Empresa B2B Tech.

---

## El Caso de Negocio

| **Problema Actual**               | **Solución Glide**                          |
|-----------------------------------|--------------------------------------------|
| Carga manual en Excel post-oficina.| Carga en tiempo real desde celular.        |
| Info siempre desactualizada.       | Datos disponibles al instante.             |
| Pipeline poco confiable.           | Notificaciones automáticas.                |

---

## Estructura de Datos

El Excel contiene las siguientes columnas clave:

- Fecha de Inicio.
- Orden de Entrega (ID).
- Jefe de Equipo.
- Segmento (Empresas, VIP, etc.).
- Razón Social (Cliente).
- Estado Cuenta (Prospect, Customer).
- Business Plan.
- Product Offering.
- Usuario Initiator.
- Moneda y Precio Recurrente.

---

## Requerimientos de la App

1. **Pantalla Lista:**
   - Cards con info clave.
   - Filtros por Líder/Segmento.
   - Buscador por Cliente.

2. **Formulario:**
   - Alta de nueva oportunidad.
   - Campos obligatorios.
   - Auto-completados.

3. **Detalle:**
   - Ver toda la info.
   - Editar estado/precio.
   - Eliminar (propietario).

---

## Prompt para Glide

Usaremos Gemini para diseñar la estructura de la app.

**Pasos:**

1. Copiar el prompt del material.
2. Ejecutar en Gemini.
3. Obtener la guía de configuración paso a paso.
4. Configurar en Glide siguiendo la guía.

---

## Paso a Paso del Ejercicio

1. **Datos (5 min):**
   - Subir Excel a Drive.
   - Abrir con Sheets.
   - Verificar cabeceras.

2. **App (5 min):**
   - Ir a [Glide Apps](https://glideapps.com).
   - New App → Google Sheets.
   - Seleccionar archivo.

3. **Prompt (15 min):**
   - Generar instrucciones con IA.
   - Configurar Vistas.
   - Configurar Forms.

---

## Resultado Esperado

**App Funcional B2B:**

- Comercial carga oportunidad en 2 minutos desde el celular.
- Jefe ve pipeline actualizado en tiempo real.
- Todo sin escribir una sola línea de código.

---

## Google AI Studio: El Secreto

### ¿Qué es?

Plataforma de Google para prototipar con Gemini.

### Características:

- Permite crear prompts estructurados y exportar código.
- Completamente gratuito.

---

## ¿Por qué es Poderoso?

- **Testing Interactivo:** Prueba prompts con variables reales.
- **Configuración Avanzada:** Control de temperatura y safety.
- **Exportación:** Genera código cURL, Python, JS listo para usar.
- **Sin Límites Estrictos:** Ideal para desarrollo y MVPs.

---

## Demo: Asistente de Categorización

### Problema

Al cargar oportunidad, el comercial no sabe qué producto técnico sugerir ante la necesidad del cliente.

### Solución AI Studio

- IA analiza descripción del cliente.
- Sugiere Business Plan + Producto.
- Justifica la recomendación.

---

## El Prompt Estructurado

**Ejemplo de Prompt:**

```plaintext
Analiza la siguiente descripción del cliente y sugiere el mejor Business Plan y Product Offering:

Cliente: "Estudio contable"
Segmento: "Soho/Profesional"
Necesidad: "Compartir archivos y video"

Respuesta en formato JSON:
{
  "plan": "Colaboración",
  "producto": "Workspace",
  "razon": "Ideal para..."
}
```

---

## Testing en AI Studio

| **Input**                          | **Output (JSON)**                          |
|-------------------------------------|--------------------------------------------|
| Cliente: "Estudio contable"         | {"plan": "Colaboración",                |
| Segmento: "Soho/Profesional"         | "producto": "Workspace",                |
| Necesidad: "Compartir archivos..."   | "razon": "Ideal para..."}               |

---

## Exportar Código

Una vez validado el prompt, AI Studio genera el código de conexión.

| **Lenguaje**       | **Descripción**                            |
|--------------------|--------------------------------------------|
| Python             | Listo para integrar en scripts.            |
| JavaScript         | Para aplicaciones web.                    |
| cURL / API         | Para integración en Make o n8n.           |

---

## 3 Opciones de Integración

| **Opción**         | **Descripción**                            | **Ventajas**                              |
|--------------------|--------------------------------------------|--------------------------------------------|
| **A. Make/n8n**    | Trigger: Nueva fila. Action: API AI Studio. Update: Google Sheet. | La más robusta.                           |
| **B. Apps Generadas** | v0 / Lovable. Prompt genera UI + Backend. Deploy automático. | Rápido para prototipos.                   |
| **C. Glide AI**    | Componentes nativos. Menos control. Más fácil de usar. | Ideal para usuarios no técnicos.         |

---

## Caso Real: CRM con Voz + IA

### El Flujo

1. Comercial cierra reunión.
2. Dicta notas de voz en la App.
3. IA Transcribe (Gemini 3).
4. IA Resume y extrae datos (Gemini).
5. CRM se actualiza solo.

### Datos Extraídos

- Próximos pasos.
- Pain points detectados.
- Productos mencionados.
- Fecha seguimiento.

---

## Metodología de Iteración

### El Ciclo Infinito

1. **MVP:** Versión mínima viable.
2. **Medir:** Recopilar datos de uso.
3. **Feedback:** Obtener opiniones de usuarios.
4. **Iterar:** Mejorar basado en feedback.

**Nota:** Ninguna herramienta sale perfecta en v1.

---

## Recolectar Feedback Efectivo

1. **Formularios Cortos:**
   - 1-2 preguntas máximo post-uso.
   - Ejemplo: "¿Qué te faltó hoy?"

2. **Observación:**
   - Ver cómo usan la app.
   - Detectar fricciones no dichas.

3. **Métricas:**
   - % Usuarios Activos.
   - Frecuencia de uso.

4. **1 a 1:**
   - Charlas con Power Users.
   - Charlas con detractores.

---

## Matriz: Impacto vs Esfuerzo

| **Impacto**       | **Alto Esfuerzo**       | **Bajo Esfuerzo**        |
|-------------------|-------------------------|-------------------------|
| **Alto**          | Planificar              | 🔥 HACER YA (Quick Wins) |
| **Bajo**          | No Hacer                | Considerar              |

**Nota:** Empieza siempre por los Quick Wins (Cuadrante Verde).

---

## Caso Real: Evolución

| **Semana**        | **Versión**             | **Adopción** | **Feedback**               |
|-------------------|-------------------------|--------------|----------------------------|
| Semana 1 (MVP)    | Google Forms.           | 30%          | "Lento"                   |
| Semana 3 (v2)     | App Glide Personal.     | 70%          | "Falta data"              |
| Semana 5 (v3)     | Dashboard + Alertas.    | 95%          | Éxito Total                |

---

## Ejercicio #4: Priorizar

### Feedback Recibido (Caso LookerStudio)

1. "No entiendo 'Down Total'" (3 users).
2. "Necesito histórico 3 meses" (8 users).
3. "Alerta email si < 80%" (2 users).
4. "Gráfico tendencia semanal" (5 users).
5. "Lento en mobile" (1 user).
6. "Exportar a Excel" (6 users).

**Tu tarea:** Clasificar en Matriz y elegir Top 3.

---

## Discusión

- ¿Qué priorizarías?
- ¿Cuáles tienen mayor impacto?
- ¿Cuáles son más fáciles?
- ¿Cuál es indispensable para operar?

---

## Casos Avanzados: IA en Herramientas

1. **Chatbot Soporte:**
   - En la app interna.
   - Consulta documentación con un Agente.
   - Ejemplo: "¿Cómo cargo cliente VIP?"

2. **Auto-completado:**
   - Predice campos.
   - Aprende patrones históricos.
   - Ahorra tiempo de carga.

3. **Sentiment Analysis:**
   - Detecta urgencia en feedback.
   - Prioriza tickets molestos.

---

## Casos Avanzados (Cont.)

4. **Reportes Naturales:**
   - Comercial: "Dame resumen Q1".
   - IA Genera texto + gráficos.

5. **Anomalías:**
   - Detecta precios fuera de rango.
   - Alerta: "¿Es correcto este monto?"
   - Previene errores humanos.

---

## Ejemplo Teórico: Make + AppScript

### Flujo Automatizado

1. **Trigger Sheet:** Nueva fila en Google Sheets.
2. **AppScript (Gemini):** Procesa datos con IA.
3. **Email Action:** Envía email con recomendaciones.

**Resultado:** Cada oportunidad nueva recibe un plan de acción generado por IA.

---

## El Sistema Completo

**Integración de Stack:**

- **Panel Analítico:** LookerStudio.
- **App Operativa:** Glide.
- **Automatización:** Make.
- **IA:** Google AI Studio.

---

## Errores Comunes al Iterar

- ❌ Cambiar todo de golpe: Usuarios perdidos.
- ❌ No medir impacto: ¿Mejoró o empeoró?
- ❌ Ignorar usuario: Construir para mí, no para ellos.
- ❌ Sobre-automatizar: Complejidad innecesaria.

---

## Principios Ganadores

- ✅ MVP Siempre: Mínimo funcional primero.
- ✅ Iterar Rápido: Semanas, no meses.
- ✅ Documentar: El "por qué" de los cambios.
- ✅ Medir Adopción: El único KPI real.

---

## Challenge para Llevar

**Pensá en tu trabajo actual:**

1. ¿Qué necesitás VER? (Dashboard)
2. ¿Qué necesitás HACER? (App Operativa)
3. ¿Qué podés AUTOMATIZAR con IA?

**Compartí en el foro tu caso de uso.**

---

## Recap Clase 11

**Lo que vimos:**

- Apps operativas con Glide.
- Prompting para generar herramientas.
- Google AI Studio para IA.
- Metodología de iteración.
- Integración Make + APIs.

**Próxima Clase:**
- Profundización en IA.

---

## Recursos

| **Materiales**               | **Enlaces**                                |
|------------------------------|--------------------------------------------|
| Datasets (Excel)             | [Glide Apps](https://glideapps.com)        |
| Checklists PDF               | [Google AI Studio](https://aistudio.google.com) |
| Biblioteca Prompts           | [Google Support](https://support.google.com) |

---

## Preguntas

- ¿Dudas o comentarios sobre los temas de hoy?

---

## Cierre

**Próxima Clase:**
- Integración de IA en aplicaciones No Code

**¡Gracias!**