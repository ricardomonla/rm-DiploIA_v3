Clase 4

Ejercicio 4

**PROMPT**
Para la tarea miren que pasa si ponene este prompt:
_Estoy tratando de aprender Prompting y quisiera ver ejemplos de esto referido a *las TICs*. Podes generarme ejemplos de prompt usando Role Prompting, Goal oriented, Chain-of-Thought, Few-Shot Prompting, ReAct, Output Format. Al final muetrame un prompt usando todos._

**RESPUESTA**
Excelente decisión 👏 — aprender **prompting aplicado a TICs** te va a dar una ventaja enorme, sobre todo si querés usar IA (como ChatGPT, Copilot o Claude) para documentar, automatizar, o analizar procesos técnicos.

A continuación te muestro ejemplos **concretos y técnicos**, organizados por tipo de técnica de prompting — todos orientados al contexto **TIC / SysAdmin / redes / soporte técnico / documentación**.
Al final vas a ver un **prompt combinado avanzado**, usando todos los enfoques juntos.

---

## 🧩 1. **Role Prompting**

*(Asignás un rol claro a la IA para que responda con el enfoque correcto)*

> **Prompt:**
> Actuá como un administrador de sistemas Linux con 10 años de experiencia en servidores Debian.
> Necesito que me expliques paso a paso cómo configurar un servicio Nginx como proxy inverso para una aplicación Node.js, incluyendo los archivos de configuración y comandos necesarios.

✅ Resultado: lenguaje técnico preciso, sin explicaciones genéricas.

---

## 🎯 2. **Goal-Oriented Prompting**

*(Le das un objetivo concreto y medible)*

> **Prompt:**
> Quiero optimizar el tiempo de despliegue de mis contenedores Docker en un servidor con poca RAM.
> Tu objetivo es **reducir el uso de memoria en al menos un 30%** sin perder funcionalidad.
> Indicá los pasos exactos, configuraciones recomendadas y cómo medir la mejora.

✅ Resultado: la IA se enfoca en **lograr un objetivo cuantificable**, no solo en explicar.

---

## 🧠 3. **Chain-of-Thought Prompting**

*(Pedís que razone paso a paso para llegar a la respuesta)*

> **Prompt:**
> Explicá paso a paso cómo diagnosticar por qué un servidor Apache no levanta el servicio.
> Empezá analizando posibles causas, después los comandos de diagnóstico, y finalmente cómo resolver según el caso.
> Mostrá tu razonamiento antes de cada solución.

✅ Resultado: la IA detalla su proceso mental, no solo la solución final.

---

## 🧪 4. **Few-Shot Prompting**

*(Le das ejemplos previos para que imite el estilo o formato)*

> **Prompt:**
> A continuación te muestro ejemplos del formato que quiero:
> **Ejemplo 1:**
> Problema: Servidor no responde al ping.
> Diagnóstico: Verificar conectividad física y configuración IP.
> Solución: Reiniciar interfaz o revisar cableado.
>
> **Ejemplo 2:**
> Problema: Base de datos MySQL no inicia.
> Diagnóstico: Revisar logs de `/var/log/mysql/`.
> Solución: Liberar espacio en disco.
>
> Ahora generá un caso similar para:
> “El servicio SSH no permite acceso remoto.”

✅ Resultado: mantiene **estructura, tono y formato idéntico** a los ejemplos.

---

## 🔁 5. **ReAct Prompting (Reason + Act)**

*(La IA alterna entre razonar y actuar con pasos explícitos)*

> **Prompt:**
> Actuá como un técnico de soporte de redes.
> Cuando te dé un incidente, primero **razoná (Reason)** qué podría estar pasando y qué datos necesitás.
> Luego **actuá (Act)** proponiendo los comandos o pasos a seguir.
>
> **Incidente:** “El servidor DHCP no asigna direcciones IP a los clientes.”

✅ Resultado:
La IA genera algo como:

```
Reason: Puede haber falla del servicio o saturación del pool de IP.  
Act: Ejecutar `systemctl status isc-dhcp-server`, revisar logs y verificar rango en dhcpd.conf.
```

---

## 🗂️ 6. **Output Format Prompting**

*(Le definís el formato exacto de salida que querés)*

> **Prompt:**
> Generá la documentación técnica del servicio Nginx en el siguiente formato Markdown:
>
> ```
> # Servicio: Nginx  
> **Función:**  
> **Ubicación del archivo de configuración:**  
> **Comandos útiles:**  
> **Logs principales:**  
> **Errores comunes y soluciones:**  
> ```
>
> Completá cada campo con información verificada para Debian 12.

✅ Resultado: respuesta lista para copiar a documentación o wiki técnica.

---

## 🧩🧠💬 7. **Prompt combinado (todos los tipos juntos)**

*(Un ejemplo integral, aplicando todo: rol, objetivo, razonamiento, formato y ejemplos)*

> **Prompt maestro:**
> Actuá como **Administrador Senior de Sistemas Linux** especializado en **infraestructura y automatización**.
>
> **Objetivo:** Diseñar una guía práctica para **automatizar respaldos incrementales de bases de datos MySQL** en un servidor Debian 12 usando `cron` y `bash`.
>
> **Ejemplo de formato deseado:**
>
> ```
> # Tarea  
> # Diagnóstico  
> # Solución paso a paso  
> # Comandos utilizados  
> # Validación  
> ```
>
> **Instrucciones:**
>
> 1. Razoná paso a paso antes de proponer la solución.
> 2. Explicá brevemente el porqué de cada comando (Chain-of-Thought).
> 3. Alterná entre **Reason** y **Act** (ReAct Prompting).
> 4. Mantené el tono profesional, técnico y claro.
> 5. Mostrá el resultado final en el formato indicado (Output Format).
>
> **Ejemplo previo (Few-Shot):**
>
> * *Ejemplo:* Automatización de limpieza de logs en `/var/log/old/` con `cron.daily`.
> * *Solución:* Script `cleanup_logs.sh` con find y rm, permiso 755, entrada en `/etc/cron.daily`.
>
> Ahora generá la guía para la automatización de respaldos incrementales MySQL según el formato indicado.

---

¿Querés que te genere el resultado completo de ese **prompt maestro**, para que veas cómo se comporta el modelo al aplicarlo todo junto?
Puedo mostrarte la **salida simulada** como ejemplo de entrenamiento.
