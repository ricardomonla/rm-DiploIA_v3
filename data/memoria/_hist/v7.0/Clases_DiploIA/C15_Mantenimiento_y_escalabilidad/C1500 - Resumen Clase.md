# Resumen Clase 15 - 22/01/2026

Acá tenés el resumen, los conceptos claves y las conclusiones de la Clase 15 sobre Mantenimiento y Escalabilidad en automatizaciones con IA.

### Resumen Ejecutivo
La clase se centra en cómo evitar que las automatizaciones "No-Code" colapsen con el tiempo. Aunque crear flujos es fácil, también es muy fácil romperlos (por ejemplo, cambiando una columna en Excel). El objetivo es pasar de simplemente "crear" a **mantener y escalar** sistemas robustos que no dependan exclusivamente de una sola persona y que puedan sobrevivir a errores o al crecimiento del negocio.

---

### Conceptos Claves

**1. La Documentación Ágil (No burocrática)**
El objetivo es que cualquier compañero pueda arreglar tu sistema si no estás. Olvidate de los manuales PDF largos.
*   **Nombres Claros:** Usá nombres descriptivos como `Autom_Carga_Leads_v2` en lugar de `Ventas_Final`.
*   **Formatos Multimedia:** Un video corto (Loom de 2 min) o notas pegadas dentro de la herramienta (Make/Miro) valen más que textos largos.
*   **Ayuda de la IA:** Podés usar un prompt para que la IA actúe como Ingeniero de Software y genere la documentación técnica describiendo inputs, procesos y outputs.

**2. Versionado y Seguridad**
*   **Nunca trabajes sobre producción:** Jamás edites el flujo que está "en vivo". Trabajá sobre copias (ej: `Bot_Whatsapp_v1.1_TEST`) y solo reemplazá cuando funcione.
*   **La Máquina del Tiempo:** Utilizá el "Historial de Versiones" de Google Sheets o Make para restaurar versiones anteriores si borrás algo por error.
*   **Versionado de Prompts:** Los prompts también se rompen si los modelos cambian; guardalos en un documento centralizado con la fecha de prueba y el modelo usado.

**3. Monitoreo y Manejo de Errores (Error Handling)**
*   **Detectar fallas:** Hay que revisar los logs semanalmente (History en Make, Zap History en Zapier) para ver si hubo errores, incluso los "silenciosos" donde el bot cree que funcionó pero no hizo nada.
*   **Caminos Alternativos:** Configurar el sistema para que no explote. Si algo falla, el flujo debe tomar un camino alternativo, como escribir el error en un Sheet y enviarte una alerta por Telegram o Email.
*   **Dependencia de Terceros:** Recordá que estamos en "terreno alquilado". Si OpenAI o Google se caen, tu bot también. Siempre tené un plan B manual documentado.

**4. Escalabilidad: El "Problema Lindo"**
Cuando el negocio crece (más clientes, más datos), lo que funcionaba antes se rompe.
*   **Límites de Google Sheets:** No es una base de datos real. A partir de las 10.000 filas o si tarda mucho en abrir, hay que migrar.
*   **Niveles de Migración:**
    *   Nivel 1: Sheets (actual).
    *   Nivel 2: Airtable / AppSheet.
    *   Nivel 3: SQL / BigQuery / MongoDB.
*   **Datos Históricos:** No mezcles datos viejos (2020) con los actuales. Separá los archivos históricos para mejorar la velocidad.
*   **Costos:** Ojo con las APIs de IA que cobran por uso. Un sistema que escala a 1000 usuarios puede disparar los costos; siempre estimá el gasto proyectado.

---

### Conclusiones

Para cerrar el bloque de herramientas técnicas, el ciclo completo de trabajo debe ser: **Crear -> Analizar -> Automatizar -> Mantener**.

Las cuatro reglas de oro para llevarse son:
1.  **Documentá:** Usá IA y videos para explicar qué hace tu bot.
2.  **Versioná:** Nunca edites sobre el sistema en producción.
3.  **Monitoreá:** Enterate de los errores revisando los logs antes que te avise el usuario.
4.  **Escalá:** Detectá a tiempo cuándo migrar a Bases de Datos más robustas.


