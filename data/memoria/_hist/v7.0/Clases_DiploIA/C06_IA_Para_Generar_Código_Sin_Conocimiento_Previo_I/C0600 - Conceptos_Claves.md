# Clase 6: IA para Generar Código sin Conocimiento Previo I

## Hoja de Ruta

1. Introducción y objetivos
2. Requerimientos en lenguaje natural
3. Ejercicio 1: Proyecto de desarrollo con IA
4. IA para generar código: AI Code y Vibe Coding
5. Firebase, desarrollo sin código en Google - Demo
6. Ejercicio 2: Tu primer Vibe-app
7. IA para desarrollar en No Code
8. Cierre, preguntas y próxima clase

---

## 1. Objetivos de la Clase

- Comprender el paradigma de desarrollo de código con IA.
- Entender las diferencias entre AI Code, Vibe Coding y No/Low Code.
- Generar requerimientos y código con IA.
- Conocer herramientas y plataformas.

---

## 2. Requerimientos en Lenguaje Natural

Un requerimiento en lenguaje natural es la descripción de qué se necesita que haga un sistema o proyecto, expresada en texto comprensible para personas sin conocimientos técnicos.

**Objetivo:** Traducir ideas de negocio en instrucciones claras y estructuradas que luego una IA o un equipo de desarrollo pueda interpretar y ejecutar.

**Valor:** Facilita la comunicación entre stakeholders, reduce ambigüedades y sirve de base para generar documentación o incluso código mediante IA.

**Ejemplo:** App de gestión de gastos personales

> "La aplicación debe registrar gastos diarios ingresados por el usuario, clasificarlos en categorías (alimentación, transporte, ocio) y mostrar un resumen semanal en forma de gráfico de torta."

### Componentes de un Buen Requerimiento

- **Contexto:** ¿Para qué sirve? ¿Quién lo utilizará?
- **Acción principal:** Verbo claro: "Generar", "Listar", "Validar", "Crear", etc.
- **Datos de entrada:** Qué información se aporta (campos, formatos, ejemplos).
- **Salida esperada:** Formato y estructura del resultado (lista, tabla, JSON, diagrama).
- **Criterios de calidad:** Límites de tiempo, validaciones, excepciones a manejar.

---

## 3. Ejercicio 1: Proyecto con IA

**Objetivo:** Formular un prompt que genere la documentación de un proyecto sencillo.

**Pasos:**
1. Elige una idea simple (ej. "app de lista de tareas colaborativa").
2. Redacta un prompt siguiendo el esquema de las "Buenas prácticas" para obtener:
   - Contexto (2–3 frases).
   - Lista de pasos/pantallas/funcionalidades.
   - Especificación de datos de entrada y salida de la app.
3. Comparte los resultados (prompt, iteración y resultados).

---

## 4. IA para Generar Código

### ¿Qué es AI-Code y "Vibe Coding"?

**AI-Code:**
- Asistencia de IA en la escritura, refactorización y pruebas de código.
- Funciona como un asistente digital que sugiere soluciones mientras programas.

**Vibe Coding:**
- La IA "al mando" del desarrollo, con los usuarios guiando con instrucciones (prompts).
- Se mantiene ritmo y creatividad sin bloqueos, dependiendo de las capacidades del modelo y nuestro prompting.

### ¿Cuándo Utilizarlos?

| **Aspecto**               | **AI Code**                                                                 | **Vibe Coding**                                                                 |
|----------------------------|-----------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **Perfil de usuario**      | Técnico (lógica básica y algo de código)                                    | No técnico (sin experiencia en programación)                                    |
| **Necesidad**              | Fragmentos puntuales: validaciones, scripts, cálculos, integraciones pequeñas | Prototipado rápido: estructura completa de un proyecto, esqueleto de archivos   |
| **Escalabilidad**           | Alta, siempre que el usuario conozca y pueda ajustar manualmente el código   | Limitada: depende del perfil del usuario y de las herramientas                   |
| **Ejemplo de uso**         | Equipo de desarrollo que incorpora AI code en Visual Studio Code             | Usuario no técnico que arma una app simple de carrito de compras                |

**Clave:**
- **AI Code** crece con tu conocimiento técnico. "Píldoras" de código para usuarios que saben dónde y cómo insertarlas.
- **Vibe Coding** ofrece velocidad inicial, pero su escalado está condicionado por quien lo use y la plataforma empleada. "Todo de un golpe" para usuarios que parten de la idea y quieren un prototipo listo.

---

## 5. Firebase, Vibe App de Google

Firebase genera automáticamente estructura de archivos y código base para iniciar proyectos rápidamente.

### Características:

- **Plantillas predefinidas:** Ofrece estructura básica para aplicaciones web, móviles y backends con configuraciones optimizadas según el caso de uso.
- **Integración con funciones Google:** Genera código para que responda a eventos y se conecta con otros servicios de Google Cloud.
- **Extensiones listas para usar:** Implementa funcionalidades completas como autenticación, pagos o gestión de contenidos con mínimo código personalizado.

### Demo - Firebase

- **Enlace:** [Firebase Studio](https://studio.firebase.google.com/)

---

## 6. Ejercicio 2: Tu Primer "Vibe App"

**Pasos:**
1. Ingresa a [Firebase Studio](https://studio.firebase.google.com/).
2. Crea una cuenta.
3. Arma, por medio de prompts, una app tipo MVP funcional, utilizando el resultado del ejercicio 1.

---

## 7. IA para Generar (NO)Código

Usar IA para desarrollar en plataformas No/Low Code.

### Dos Caminos Posibles

**IA como Acompañante:**
- Te ayuda a diseñar flujos paso a paso.
- Propone ideas de automatización y sugiere buenas prácticas.
- Resuelve dudas puntuales (ej. "¿cómo filtrar campos vacíos?", "¿cómo conectar con Google Drive?").
- Ideal para usuarios que aprenden y experimentan.
- Mejor en el largo plazo, genera aprendizaje y gobernanza.

**IA como Generadora de Nodos:**
- Crea directamente el JSON de los nodos listo para importar en Make (u otra herramienta).
- Reduce el tiempo de armado técnico cuando ya sabes qué flujo necesitas.
- Ejemplo: IA genera un nodo HTTP ya configurado para consumir una API externa.
- Útil para usuarios que quieren rapidez y tienen claro el resultado buscado.
- Difícil de que sea 100% utilizable, y necesidad de realizar ajustes + riesgo de posible pérdida de gobernanza.

### Ejemplos de Prompts

**Acompañante:**
> "Explícame paso a paso cómo armar un flujo en Make que guarde archivos adjuntos de Gmail en Google Drive y luego avise por Slack."

**Generadora de Nodos:**
> "Crea el JSON (blueprint) para un nodo HTTP en Make que consulte la API de OpenWeather con mi clave y devuelva la temperatura de Buenos Aires."

---

## 8. Cierre

**Preguntas:**
- ¿Dudas o comentarios sobre los temas de hoy?

**Próxima Clase:**
- IA para generar código sin conocimiento previo II

**¡Gracias!**