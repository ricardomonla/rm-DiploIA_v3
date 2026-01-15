# Clase 12: Integración de IA en Aplicaciones No Code

## Hoja de Ruta

1. Introducción y objetivos.
2. ¿Dónde agrega valor la IA?
3. Consola de desarrolladores.
4. Demo: consolas de los principales proveedores.
5. ¿Qué es una API Key? - Creación de API Key.
6. ¿Qué son los Tokens? ¿Cuánto pesan?
7. Ejercicio 1 - Pesar tus prompts.
8. Ejercicio 2 - Tu primer presupuesto con IA.
9. Cierre, preguntas y próxima clase.

---

## 1. Objetivos

- Entender dónde usar IA.
- Reconocer en qué pasos un modelo de IA puede potenciar una automatización.
- Conocer las plataformas.
- Familiarizarse con las consolas de desarrollador de OpenAI y Google.
- Identificar parámetros.
- Comprender los parámetros principales de configuración de LLMs.
- Cotizar soluciones con IA.
- Practicar con ejercicios para aprender a estimar los costos de una automatización con IA.

---

## 2. Dónde la IA Agrega Valor Real

La inteligencia artificial no es solo una tecnología del futuro: ya está transformando operaciones cotidianas en organizaciones de todos los tamaños. Conocer dónde aplicarla marca la diferencia entre experimentos costosos y mejoras tangibles en productividad.

### Áreas de Valor

| **Área**                     | **Descripción**                                                                 | **Ejemplo**                                                                 |
|------------------------------|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **Clasificación Inteligente** | Enrutamiento automático de tickets entre ventas y soporte técnico.              | Evaluación de CVs identificando candidatos aptos o no aptos, con justificación clara del criterio aplicado. |
| **Resumen y Generación**     | Conversión de emails extensos en 2-3 puntos accionables.                         | Transformación de actas de reuniones en listas concisas de acuerdos alcanzados y tareas pendientes. |
| **Predicción Ligera**        | Asignación sugerida de prioridad (alta, media o baja) basada en señales simples del contexto. | Ayudando a tomar decisiones más rápidas y fundamentadas.                     |

---

## 3. Consolas de Desarrollador

### Componentes Principales

| **Componente**               | **Descripción**                                                                 |
|------------------------------|---------------------------------------------------------------------------------|
| **Selector de modo/modelo**  | Permite elegir entre diferentes modelos del proveedor.                          |
| **Caja de prompt**           | Área principal donde escribir las instrucciones para el modelo.                 |
| **Show code**                | Muestra el código necesario para implementar la misma llamada en tu aplicación. |

---

## 4. Parámetros de los Modelos

### Parámetros Clave

| **Parámetro**               | **Descripción**                                                                 | **Ejemplo de Ajuste**                                                                 |
|------------------------------|---------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| **Temperature**              | Controla la aleatoriedad de las respuestas. Valores más altos (como 0.8) hacen la salida más aleatoria, mientras que valores más bajos (como 0.2) la hacen más determinista. | Bajo: 0.2 (Predecible, estable). Alto: 0.8 (Creativo, variable).                     |
| **Top-p**                    | Sampling con núcleo. El modelo considera los resultados de los tokens con probabilidad top_p. 0.1 significa que solo se consideran los tokens que comprenden el 10% superior de la masa de probabilidad. | Bajo: 0.3 (Palabras comunes). Alto: 1.0 (Léxico más variado).                         |
| **Max tokens**               | Limita la longitud de la respuesta generada. Un token es aproximadamente 4 caracteres o 3/4 de una palabra en inglés. | Bajo: 40 (Completo). Alto: 8 (Puede cortar).                                            |
| **Frequency/Presence penalty** | Penaliza nuevas palabras basadas en su frecuencia existente en el texto (frequency) o simplemente si ya han aparecido (presence). | Bajo: 0.0/0.0 (Repite). Alto: 0.9/0.9 (Diversifica).                                    |

### Riesgos Típicos

| **Parámetro**               | **Riesgo**                                                                       |
|------------------------------|---------------------------------------------------------------------------------|
| **Temperature**              | Divagar / inconsistencia.                                                        |
| **Top-p**                    | Términos raros.                                                                 |
| **Max tokens**               | Respuestas truncadas.                                                           |
| **Frequency/Presence penalty** | Pérdida de tono si es excesivo.                                                 |

---

## 5. Demo: Consola de Desarrolladores

### OpenAI Console

- [Enlace a OpenAI Console](https://platform.openai.com/)

### Google AI Studio

- [Enlace a Google AI Studio](https://aistudio.google.com/)

---

## 6. ¿Qué es una API Key?

### Características

- **Identificador único:** Cadena alfanumérica que identifica tu aplicación ante un servicio externo.
- **Autenticación y autorización:** Verifica que la petición proviene de un cliente válido.
- **Facturación:** Asocia el uso a tu cuenta para imputar el consumo.

---

## Creación de API Keys en Google AI Studio

### Pasos

1. **Acceso a la consola:**
   - Entra en [console.cloud.google.com](https://console.cloud.google.com) y selecciona tu proyecto.

2. **Sección de credenciales:**
   - Ve a APIs & Services → Credentials.

3. **Crear nueva clave:**
   - Haz clic en "Create credentials" → "API key".

4. **Configurar restricciones:**
   - Establece límites por HTTP referrer, IP o aplicación.

---

## 7. ¿Qué son los Tokens?

### Definición

- **Tokens:** Fragmentos de texto que el modelo utiliza para procesar entrada y generar salida.
- **Equivalencia:** En inglés, 1 token ≈ ¾ de palabra. Varía según idioma y vocabulario.

### Importancia

- El coste se basa en tokens de input + output. Conocerlos permite estimar presupuestos.

### Tipos de Tokens

| **Tipo**               | **Descripción**                                                                 |
|------------------------|---------------------------------------------------------------------------------|
| **Tokens de entrada**  | Texto que envías al modelo: instrucciones, contexto y datos.                     |
| **Tokens de salida**   | Texto generado por el modelo. Depende del "max_tokens".                        |

---

## ¿Cuánto pesa un prompt?

### Tokenizadores

Herramientas oficiales para calcular el peso de un prompt.

- [OpenAI Tokenizer](https://platform.openai.com/tokenizer)

---

## 8. Ejercicio 1: "Pesar tus prompts"

### Pasos

1. Accede a [OpenAI Tokenizer](https://platform.openai.com/tokenizer).
2. Obtén el texto de un archivo input, súbelo al tokenizer y anota el número de tokens que indica.
3. Pega tu prompt y anota el número de tokens que indica.
4. Ingresa a Chat GPT (o similar) ejecuta la prompt con el input.
5. Pega la respuesta obtenida en el tokenizer y registra también sus tokens.

---

## Pricing de Modelos de IA

Los modelos de IA tienen estructuras de precios basadas principalmente en el uso de tokens. Comprender estas tarifas es fundamental para tomar decisiones informadas sobre qué modelo utilizar en cada caso de uso.

### Factores de Influencia

- **Capacidades del modelo:** Modelos más avanzados como GPT-5 cuestan más en su versión "thinking" (razonador).
- **Longitud del contexto:** Modelos con ventanas de contexto más grandes (128k vs 8k tokens) tienen precios premium.
- **Volumen de uso:** Algunos proveedores ofrecen descuentos por volumen mensual comprometido.

### Estructura de Precios

- El pricing se presenta generalmente por cada 1,000,000 de tokens procesados, con costos diferenciados para tokens de entrada (prompt) y salida (respuesta generada).
- Los proveedores como OpenAI publican sus tarifas oficiales en su documentación.
- Típicamente, los tokens de salida cuestan más que los de entrada debido al mayor procesamiento requerido.

---

## 9. Presupuesto de Soluciones con IA

Calcular el costo real de una implementación de IA requiere considerar tanto tokens de entrada como de salida. Veamos un ejemplo práctico con números concretos.

### Ejemplo de Cálculo

| **Concepto**               | **Cálculo**                                                                 | **Resultado**              |
|----------------------------|-----------------------------------------------------------------------------|-----------------------------|
| **Costo Input**            | Tokens × Precio = (500,000/1,000,000) × $2.00 = $1.00                       | $1.00                       |
| **Costo Output**           | Tokens × Precio = (200,000/1,000,000) × $4.00 = $0.80                       | $0.80                       |
| **Total por Llamada**      | Input + Output = $1.00 + $0.80 = $1.80                                       | $1.80                       |
| **Proyección Mensual**     | Con 10 llamadas al mes, el costo total sería: $1.80 × 10 = $18.00 mensuales. | $18.00                      |

**Nota:** Este método de cálculo te permite escalar fácilmente para cualquier volumen de uso. Multiplica el costo por llamada por tu estimación realista de ejecuciones mensuales para obtener tu presupuesto base.

---

## Cálculo de Presupuesto

### Pasos

1. **Estimar volumen:** Número de usuarios y peticiones por día.
2. **Aplicar fórmula:** Calcular coste diario y mensual.
3. **Escenarios:** Conservador, medio y optimista.
4. **Costes adicionales:** Networking, storage y licencias.

---

## 10. Ejercicio 2: Cotizando Soluciones de IA

### Pasos

1. Tomar los resultados del Ejercicio 1 (tokens totales por ejecución).
2. Seleccionar un modelo acorde:
   - [OpenAI Models](https://platform.openai.com/docs/models)
   - [Google Gemini Models](https://ai.google.dev/gemini-api/docs/models)
3. Consultar el pricing del modelo:
   - [OpenAI Pricing](https://openai.com/api/pricing/)
   - [Google Gemini Pricing](https://ai.google.dev/gemini-api/docs/pricing)
4. Calcular el coste por ejecución: (Tokens totales / 1,000) × Precio.
5. Estimar un coste mensual para 1,000 ejecuciones.

---

## Cierre

**Próxima Clase:**
- Creación de asistentes virtuales

**¡Gracias!**