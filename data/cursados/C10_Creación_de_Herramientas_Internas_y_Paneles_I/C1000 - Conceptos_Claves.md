# Clase 10: Creación de Herramientas Internas y Paneles I

## Hoja de Ruta

1. Entender por qué los dashboards importan.
2. Aplicar el framework de 4 pasos.
3. Dominar las 5 preguntas obligatorias.
4. Aplicar la regla de los 5 segundos.
5. Elegir el gráfico correcto para cada necesidad.
6. Conectar datos en LookerStudio.
7. Construir KPIs principales.
8. Crear gráficos comparativos.
9. Aplicar formato condicional en tablas.
10. Diferenciar analítico de operativo.

---

## Objetivos de la Clase

- Definir necesidades de información desde el negocio.
- Diseñar paneles efectivos con UX/UI.
- Construir dashboards analíticos con herramientas No-Code.
- Introducción a herramientas operativas.

---

## ¿De Dónde Venimos?

**Clases anteriores:**
- Automatización con Make.
- Generación de código con IA.
- Herramientas No-Code para productividad.

**Hoy damos el salto:**
- De automatizar tareas a visualizar y decidir.

---

## El Problema Real

### Sin Paneles

- Decisiones basadas en intuición.
- Información dispersa en múltiples lugares.
- Reuniones que podrían ser un email... o un dashboard.

### Con Paneles

- Decisiones basadas en datos.
- Información centralizada y actualizada.
- Tiempo de gestión reducido 70%.

---

## Caso Real: E-commerce Argentino

### Antes

- 3 horas semanales juntando datos en Excel.
- Reportes desactualizados.
- Decisiones de inventario a ciegas.

### Después (LookerStudio)

- Dashboard automático actualizado en tiempo real.
- 15 minutos de análisis semanal.
- Reducción de 40% en quiebres de stock.

---

## Framework: Del Problema al Dashboard

1. **Identificar:** ¿Quién lo va a usar?
2. **Definir:** ¿Qué necesitan saber?
3. **Mapear:** ¿De dónde sale la info?
4. **Frecuencia:** ¿Cada cuánto se actualiza?

---

## Las 5 Preguntas Clave

Antes de diseñar cualquier panel, responde:

1. ¿Qué decisión toma el usuario con esta info?
2. ¿Con qué frecuencia necesita decidir? (diario, semanal, mensual)
3. ¿Qué nivel de detalle necesita? (macro, medio, granular)
4. ¿Quién lo usa? (CEO, gerente, operador)
5. ¿Qué acción desencadena? (llamar, ajustar, contratar)

---

## Ejemplo: Gerente Comercial

### Contexto

- Lidera equipo de 9 comerciales.
- Reunión semanal de performance.
- Necesita identificar quién necesita apoyo.

### Traducción a Métricas

- Cumplimiento de objetivos por comercial.
- Ventas brutas vs objetivo.
- Clientes nuevos captados.
- Desvíos críticos (20% bajo objetivo).

---

## Ejercicio #1: Definir Necesidades

**Duración:** 10 minutos

**Caso:** Director comercial

**Contexto:** 9 comerciales con objetivos recurrentes. Panel para reunión semanal. Identificar quick wins.

**Tu tarea:**

1. Definir usuario final.
2. Listar 3 preguntas críticas.
3. Proponer métricas necesarias.

**Formato:** Google Doc colaborativo

---

## Anatomía de un Dashboard Efectivo

### Regla de los 5 Segundos

El usuario debe entender la idea central en 5 segundos.

### Estructura:

- **Arriba:** KPIs principales.
- **Centro:** Gráficos comparativos.
- **Abajo:** Tablas detalladas.

---

## Tipos de Gráficos y Cuándo Usarlos

| **Tipo**               | **Cuándo Usar**                          | **Ejemplo**                              |
|------------------------|------------------------------------------|------------------------------------------|
| **Scorecard/KPI**       | Métrica única destacada                  | "Ventas totales: $280K"                 |
| **Barras**             | Comparar categorías                      | Ventas por comercial                     |
| **Líneas**             | Tendencias temporales                    | Evolución mensual                        |
| **Tablas**             | Detalle completo                         | Todos los datos por persona              |
| **Gauge**              | % de cumplimiento                        | Meta: 85% Logro: 92%                     |

---

## Errores Comunes a Evitar

- Sobrecarga: 15 gráficos en una pantalla.
- Colores sin propósito: arcoíris decorativo.
- Falta de contexto: "Ventas: 50" (¿50 qué? ¿vs cuánto?).
- Gráficos incorrectos: torta con 12 categorías.
- Sin jerarquía: todo del mismo tamaño.

---

## Dashboard Bien Diseñado

- Máximo 5-7 elementos visuales.
- Colores con significado (verde=bien, rojo=alerta).
- Contexto siempre presente (período, unidad, comparación).
- Navegación intuitiva.
- Carga rápida (< 3 segundos).

---

## Demo en Vivo: LookerStudio

**Recursos:**
- Dataset: Ejemplo_Dashboard_1.xlsx
- Caso: Performance de equipo de ventas B2B

**Pasos:**

1. Conexión a Google Sheets.
2. KPIs principales del equipo.
3. Gráfico de barras: ventas vs objetivo.
4. Tabla detallada con formato condicional.

---

## Nuestro Caso: Equipo Comercial

**Datos disponibles (9 comerciales):**

- Cumplimiento: % de logro.
- Objetivo en Monto Recurrente.
- Ventas en Monto Recurrente.
- Objetivo de Clientes Nuevos.
- Clientes Nuevos captados.
- Ventas Brutas.
- Down (pérdidas).

---

## Demo: Paso a Paso

1. **Conectar datos:**
   - Subir Excel a Google Drive.
   - LookerStudio: Crear → Informe → Sheets.

2. **KPIs superiores:**
   - Cumplimiento promedio (%).
   - Ventas brutas totales (USD).
   - Clientes nuevos (número).

3. **Gráfico de barras:**
   - Ventas vs Objetivo por comercial.
   - Ordenar descendente.
   - Colores diferenciados.

4. **Tabla detallada:**
   - Todos los campos + formato condicional.
   - Verde: 100%.
   - Amarillo: 80-100%.
   - Rojo: < 80%.

---

## Ejercicio #2: Construir Dashboard

**Duración:** 20 minutos

**Objetivo:**

- ¿Qué % del equipo cumple objetivos?
- ¿Quiénes son los top performers?
- ¿Dónde están las oportunidades de mejora?

**Recursos:**
- Dataset: Ejemplo_Dashboard_1.xlsx
- Seguí el checklist paso a paso (siguientes slides).

---

## Checklist LookerStudio (1/3)

**Paso 1: Preparar datos**
- Subir Excel a Drive.
- Abrir con Sheets.
- Verificar nombres de columnas.
- Copiar URL.

**Paso 2: Crear reporte**
- Ir a lookerstudio.google.com.
- Crear → Informe → Sheets.
- Conectar.

---

## Checklist LookerStudio (2/3)

**Paso 3: KPIs principales**
- Insertar 3 scorecards.
- KPI 1: Cumplimiento promedio (%).
- KPI 2: Ventas brutas totales (USD).
- KPI 3: Clientes nuevos (número).

**Paso 4: Gráfico comparativo**
- Barras: Comercial vs Ventas + Objetivo.
- Ordenar descendente.
- Colores diferenciados.

---

## Checklist LookerStudio (3/3)

**Paso 5: Tabla detallada**
- Campos: Comercial, Cumplimiento, Ventas, Objetivo, Clientes.
- Formato condicional:
  - Verde: 100%.
  - Amarillo: 80-100%.
  - Rojo: < 80%.

**Paso 6: Ajustes finales**
- Título del reporte.
- Alinear elementos.
- Compartir con "ver".

---

## Resultado Esperado

**Dashboard ejecutivo que muestra:**

- Estado general del equipo en un vistazo.
- Top performers identificados rápidamente.
- Alertas visuales sobre quién necesita apoyo.
- Datos actualizados automáticamente desde el Sheet.

**Todo sin escribir una línea de código.**

---

## Preguntas & Respuestas #1

**Temas:** Metodología | Diseño | LookerStudio

---

## De Analítico a Operativo

### Panel Analítico

- **Propósito:** "¿Qué está pasando?"
- **Acción:** Ver, analizar, decidir.
- **Ejemplo:** Dashboard de ventas.

### Herramienta Operativa

- **Propósito:** "¿Qué hago al respecto?"
- **Acción:** Cargar, modificar, procesar.
- **Ejemplo:** Formulario de carga.

**Nota:** Se complementan en un sistema completo.

---

## Caso de Uso: Pipeline de Ventas

1. **Operativo:** App para registrar (Glide).
   - Comercial carga nueva reunión.

2. **Analítico:** Dashboard (LookerStudio).
   - Gerente ve evolución.

3. **Automatización:** Alertas (Make).
   - Recordatorios automáticos.

---

## Demo Rápida: HTML + Gemini

**Pregunta a Gemini:**
> "Crea un formulario HTML responsivo para registrar métricas de ventas semanales de un comercial. Campos: nombre comercial (texto), ventas monto recurrente (número), clientes nuevos (número), observaciones (textarea). Estilo moderno con CSS integrado."

**Resultado:** Formulario funcional en 30 segundos.

**Key takeaway:** Con IA generamos interfaces operativas sin programar.

---

## Recap Clase 10

**Lo que vimos:**

- Framework para definir necesidades.
- Diseño de dashboards efectivos.
- Práctica con LookerStudio.
- Analítico vs Operativo.
- Intro a interfaces con IA.

**Próxima clase:**

- Herramientas operativas con Glide.
- Integración de IA en apps.
- Metodología de iteración.

---

## Preguntas

- ¿Dudas o comentarios sobre los temas de hoy?

---

## Cierre

**Próxima Clase:**
- Creación de herramientas internas y paneles II

**¡Gracias!**