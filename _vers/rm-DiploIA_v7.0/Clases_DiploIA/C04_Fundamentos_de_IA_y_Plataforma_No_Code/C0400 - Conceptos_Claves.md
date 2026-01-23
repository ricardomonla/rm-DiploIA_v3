# Conceptos Clave: Fundamentos de IA y Plataforma No Code

## Introducción

Esta clase explora los fundamentos de la Inteligencia Artificial (IA) y las plataformas No Code, enfocándose en cómo las máquinas aprenden, el diseño de prompts efectivos, riesgos de seguridad y cuándo usar herramientas sin código.

---

## Máquinas que Aprenden: ¿Qué es la IA?

### Proceso de Aprendizaje

- **Datos y entrenamiento:** El modelo se alimenta de ejemplos etiquetados para aprender patrones.
- **Extracción de patrones:** Algoritmos identifican relaciones y estructuras ocultas.
- **Retroalimentación iterativa:** Se evalúa desempeño y ajustan parámetros para mejorar.
- **Validación y generalización:** Pruebas con datos nuevos evitan sobreajuste.

### Tipos de IA

| **Tipo**               | **Descripción**                                                                 |
|------------------------|---------------------------------------------------------------------------------|
| **IA Débil**           | Sistemas para tareas específicas (recomendaciones, clasificación, chatbots).     |
| **IA Generativa**      | Modelos que crean contenido original (texto, imágenes) mediante lenguaje natural. |

---

## Fundamentos del Prompt Engineering

### Conceptos Básicos

- **Prompts:** Instrucciones que guían al modelo para realizar tareas.
- **Prompt Engineering:** Diseño de inputs para respuestas precisas y útiles.
- **Iteración:** Ajuste de prompts basado en respuestas previas.

### Técnicas Avanzadas

| **Técnica**               | **Descripción**                                                                 |
|---------------------------|---------------------------------------------------------------------------------|
| **Role Prompting**        | Asignar rol al modelo para mejorar estilo y relevancia.                          |
| **Goal Oriented**         | Definir claramente el objetivo.                                                 |
| **Chain-of-Thought**      | Solicitar pensamiento paso a paso para problemas complejos.                     |
| **Few-Shot Prompting**    | Proporcionar ejemplos de entrada/salida.                                        |
| **ReAct**                 | Combinar razonamiento y acciones.                                               |
| **Output Format**         | Especificar formato de respuesta (párrafo, JSON, tabla).                        |

### Ejercicio Práctico

**Prompt base mejorado:**

```plaintext
Eres un asistente de IA especialista en productividad profesional en consultoría de software.
Genera una lista de 5 consejos concretos para mejorar la productividad diaria de un profesional en implementación de IA y automatización de procesos empresariales en Argentina, para clientes locales y extranjeros.
Cada consejo debe incluir:
- Título breve (máx. 5 palabras)
- Descripción de implementación (1-2 oraciones)
- Herramienta recomendada (preferentemente gratuita)
- Tiempo estimado

Responde en lenguaje claro y directo, no más de 120 palabras total.
```

---

## Riesgos de Seguridad en IA

### Principales Riesgos

- **Exposición de Datos:** Información personal en prompts puede filtrarse.
- **Sesgos:** Modelos perpetúan prejuicios de datos históricos.
- **Ataques Adversarios:** Perturbaciones inducen errores críticos.
- **Normativa:** Cumplimiento con GDPR, LGPD, CCPA.

### Buenas Prácticas de Seguridad

- **Ocultar Información Personal:** Anonimizar datos antes de compartir.
- **Protección de Comunicaciones:** Usar HTTPS y contraseñas fuertes.
- **Gestión de Claves:** Almacenar API keys en lugares seguros.
- **Permisos Mínimos:** Acceso solo a lo necesario.

### Privacidad para Usuarios Finales

- **Consentimiento Informado:** Avisos claros antes de procesar datos.
- **Transparencia:** Informar qué datos se recopilan y cómo se usan.

---

## No Code: ¿Qué es y Cuándo Usarlo?

### Características

- **Interfaces Gráficas:** Construir apps arrastrando componentes.
- **Colaboración Multidisciplinar:** Participación de perfiles técnicos y de negocio.
- **Mínimo Código Manual:** Simplifica desarrollo sin código complejo.

### Cuándo Usar No Code

- **Prototipado y Validación Rápida:** MVPs en días para feedback temprano.
- **Procesos Internos:** Automatizaciones repetitivas, integraciones entre apps.
- **Escasez de Recursos Técnicos:** Equipos sin desarrolladores disponibles.
- **Iteración Constante:** Ajustes rápidos sin ciclos largos.
- **Conectividad Legacy:** Puentes entre sistemas sin APIs estándar.

### Cuándo NO Usar No Code

- **Rendimiento Extremo:** Alta concurrencia o requisitos críticos.
- **Lógica Compleja:** Reglas cambiantes con muchas dependencias.
- **Seguridad Estricta:** Control fino sobre cumplimiento regulatorio.
- **Escala Masiva:** Millones de usuarios superando límites de plataforma.

---

## Ejercicio Práctico

Crear cuenta gratuita en Make:

1. Ingresar a [Make](https://www.make.com/en/register).
2. Seguir el tutorial en video del aula virtual.

---

## Recursos Adicionales

- **Fuentes:** IBM, Mercity AI, Tom's Guide, European Commission, DAIR.AI, Anthropic, OpenAI.
- **Tutorial:** Video para cuenta en Make en aula virtual.

---

## Conclusión

Comprender IA y Prompt Engineering permite interacciones efectivas con modelos. Las buenas prácticas de seguridad protegen datos sensibles. No Code acelera desarrollo para casos apropiados, pero requiere evaluación de requisitos. La próxima clase cubrirá herramientas No Code para productividad.