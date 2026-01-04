# Clase 7: IA para Generar Código sin Conocimiento Previo II

## Hoja de Ruta

1. Introducción y objetivos
2. POC y MVP: desarrollar e iterar
3. Metodología de iteración con IA
4. Demo: iteraciones reales para No Code
5. Ejercicio - Asistente de desarrollo y debug
6. Limitaciones y responsabilidad del usuario
7. ¿Cómo funcionan los modelos de IA?
8. Human in the Loop: ¿qué es y para qué sirve?
9. Caso de estudio + ejercicio de reflexión y debate
10. Cierre, preguntas y próxima clase

---

## 1. Objetivos de la Clase

- Entender cómo usar la IA para solucionar problemas en No Code.
- Practicar la iteración con modelos de IA.
- Entender y reflexionar sobre la responsabilidad en el uso de automatizaciones e IA.
- Conocer un enfoque incremental y validado de desarrollo de soluciones.

---

## 2. Interpretar y Ajustar Resultados Automáticos

La IA no es infalible, y nosotros como desarrolladores de soluciones tampoco. El verdadero poder está en la iteración inteligente y la mejora continua de nuestros resultados.

### De Dónde Venimos y a Dónde Vamos

**Clase 6: Fundamentos**
- Aprendimos a traducir ideas en requerimientos claros y a generar prototipos funcionales con IA.

**Hoy: Validación e Iteración**
- Veremos cómo validar, ajustar y mejorar esos resultados de manera sistemática, aplicando metodologías ágiles.

**Objetivo:** Desarrollar una mentalidad de mejora continua que nos permita crear soluciones cada vez más efectivas y confiables.

---

## 3. POC y MVP: Conceptos Clave para el Desarrollo Ágil

### POC - Proof of Concept / Prueba de Concepto

- Demostración técnica de que una idea es factible.
- Se centra en validar que la tecnología puede resolver el problema planteado.
- **Características:**
  - Funcionalidad mínima.
  - Sin interfaz pulida.
  - Objetivo: ¿Se puede hacer?

### MVP - Minimum Viable Product / Producto Mínimo Viable

- Versión más simple del producto que proporciona valor real a los usuarios y permite recopilar feedback para futuras iteraciones.
- **Características:**
  - Funcionalidades core.
  - Experiencia de usuario básica.
  - Objetivo: ¿Vale la pena desarrollarlo?

**En el desarrollo con IA:** Estos conceptos son fundamentales para iterar rápidamente sin invertir demasiado tiempo en soluciones que quizás no funcionen como esperamos.

---

## 4. La Regla del 1%

> "El progreso diario pequeño pero constante supera a los grandes esfuerzos esporádicos."

### Consistencia sobre Intensidad

- Pequeñas mejoras diarias en nuestros prompts, validaciones y procesos generan resultados extraordinarios a largo plazo.

### Aprendizaje Iterativo

- Cada error es una oportunidad de mejora. Documentar y aplicar estos aprendizajes nos hace más efectivos.

### Ejemplo Cotidiano

- Mejorar prompting, luego iterar hasta obtener el resultado esperado.
- Automatizar el envío de correos (antes de una automatización de proceso completo).
- Optimizar un formulario de Google antes de crear un flujo más complejo.

---

## 5. Metodología de Iteración con IA

### Pasos para Iterar con IA

1. **Definir problema específico:** Contexto detallado y expectativas claras.
2. **Generar solución con IA:** Prompt enriquecido con información técnica.
3. **Probar en entorno controlado:** Validación con casos de prueba simples.
4. **Refinar prompt:** Incorporar aprendizajes al siguiente intento.
5. **Analizar resultados:** Identificar qué funciona y qué necesita ajuste.

---

## 6. Demo: Iterando con la IA para Desarrollar en No Code - Casos Reales

### Ejemplo de Iteración

**Problema:** Error en escenario de Make en envío de correo por Gmail.

**Solución:**
1. Definir problema específico.
2. Generar solución con IA.
3. Probar en entorno controlado.
4. Refinar prompt.
5. Analizar resultados.

---

## 7. Interactuar con Asistente de No Code

### Asistente Gemini

- [Enlace al Asistente Gemini](https://gemini.google.com/gem/1w5TaYJB49jkAOV-INAaiPAl-XHUmuyC0?usp=sharing)

### Asistente GPT

- [Enlace al Asistente GPT](https://chatgpt.com/g/g-68d7df705d08819184f4ea5aaa99a695-asistente-de-desarrollo-y-debug-make)

---

## 8. Limitaciones y Responsabilidad del Usuario

La IA es una herramienta poderosa que requiere supervisión humana constante. Reconocer sus limitaciones nos permite usarla de manera más efectiva y responsable.

### Limitaciones de la IA

- **Sesgos en los datos:** Los modelos reflejan sesgos presentes en sus datos de entrenamiento.
- **Alucinaciones:** Generación de información falsa pero presentada con confianza.
- **Falta de contexto:** Interpretación limitada de situaciones específicas o complejas.

---

## 9. ¿Cómo Funcionan los Modelos de IA?

### Predicen y Responden

Los modelos de lenguaje funcionan mediante un sistema sofisticado de predicción basado en probabilidades estadísticas. Cada palabra generada se selecciona analizando patrones de frecuencia y co-ocurrencia aprendidos durante el entrenamiento.

### Análisis de Patrones Estadísticos

- El modelo identifica relaciones entre palabras basándose en millones de ejemplos.

### Cálculo de Probabilidades Contextuales

- Cada token recibe una puntuación según su relevancia en el contexto actual.

---

## 10. Human-in-the-Loop: La Colaboración Esencial

El concepto Human-in-the-Loop (HITL) representa la colaboración continua y estratégica entre la inteligencia artificial y la supervisión humana. Este enfoque reconoce que la IA, por muy avanzada que sea, necesita la intervención humana para funcionar de manera ética, precisa y contextualmente apropiada.

> "La verdadera revolución de la IA no está en reemplazar a los humanos, sino en amplificar nuestras capacidades a través de la colaboración inteligente."

### Estrategias de Supervisión Humana Efectiva

- **Revisión sistemática:** Evalúa cada resultado antes de implementarlo. Crea checklists de validación personalizados para tu contexto específico.
- **Feedback iterativo:** Mejora tus prompts basándote en los resultados obtenidos. Cada iteración debe ser más específica y contextual.
- **Monitoreo continuo:** Supervisa el rendimiento en tiempo real y detecta anomalías temprano mediante dashboards y alertas.
- **Control en puntos críticos:** Identifica momentos clave donde la intervención humana es esencial y diseña flujos que la faciliten.

---

## 11. Caso de Estudio: Algoritmo para Empleos

### El Problema Identificado

El algoritmo de entrega de anuncios de Facebook mostró ofertas laborales de forma distinta por género, aún sin segmentación explícita. Resultado: vacantes técnicas a más hombres y puestos de retail/servicios a más mujeres.

### La Raíz del Sesgo

- Optimización por probabilidad de clic basada en patrones históricos de comportamiento.
- Sin controles/guardrails suficientes, la IA amplifica estereotipos existentes.

### Consecuencias del Error

- Acceso desigual a oportunidades laborales.
- Perpetuación de brechas en el mercado de trabajo.
- Riesgos legales y reputacionales para plataforma y anunciantes.

---

## 12. Caso de Estudio (Extra): Sesgo en Algoritmos de Salud (2019)

### El Problema Identificado

En 2019, investigadores descubrieron que un algoritmo ampliamente utilizado para evaluar el riesgo de salud de pacientes mostraba un sesgo racial significativo. Pacientes negros con el mismo nivel de salud que pacientes blancos recibían puntuaciones de riesgo menores.

### La Raíz del Sesgo

- El modelo utilizaba gastos médicos históricos como indicador de gravedad de la condición de salud.
- Debido a desigualdades históricas en el acceso a la atención médica, la población afroamericana tenía menores gastos médicos registrados, no por estar más sana, sino por barreras de acceso.

### Consecuencias del Error

- Perpetuación de desigualdades en el sistema de salud.
- Asignación inadecuada de recursos médicos.
- Impacto negativo en la calidad de atención.

---

## 13. Ejercicio de Debate: Preguntas para la Reflexión

### Responsabilidad Compartida

- ¿Quién asume la responsabilidad principal por los sesgos detectados: los diseñadores del modelo, los proveedores de datos o la organización que lo implementa?

### Roles en la Validación

- ¿Qué rol deberían tener los desarrolladores frente a los revisores en la validación y despliegue de sistemas con IA?

### Equilibrio Velocidad-Ética

- ¿Cómo debe integrarse la supervisión humana para equilibrar rapidez de entrega y calidad ética del sistema?

### Responsabilidad del Usuario Final

- ¿Hasta qué punto el usuario final tiene la responsabilidad de cuestionar y verificar resultados antes de su uso?

---

## 14. Cierre

**Próxima Clase:**
- Automatización de Tareas I

**¡Gracias!**