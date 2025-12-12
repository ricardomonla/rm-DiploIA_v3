# Documentación de Cambios en Componentes

## Resumen de Cambios

Se ha realizado una refactorización en el directorio `src/components` para consolidar la funcionalidad de anotación de marcas en un único componente principal (`rmVerticalScrubber`).

## Componentes Eliminados

Los siguientes componentes fueron eliminados por redundancia o falta de uso:

1. **VerticalScrubber**: Funcionalidad básica de scrubber sin soporte para anotaciones.
2. **VerticalTimeline**: Visualización de línea de tiempo sin interacción avanzada.
3. **FloatingBar**: Barra flotante que mostraba anotaciones sin funcionalidad de edición.
4. **EnhancedVerticalScrubber**: Versión mejorada del scrubber, pero sin la funcionalidad de acordeón.

## Componente Principal

**rmVerticalScrubber**: Este componente ha sido conservado y mejorado para centralizar toda la funcionalidad de anotación de marcas. Incluye:

- Soporte completo para anotaciones (añadir, editar, eliminar).
- Interfaz de acordeón para visualización detallada de anotaciones.
- Navegación por teclado para accesibilidad.
- Soporte para gestos táctiles en dispositivos móviles.
- Integración con la URL del video para fácil referencia.

## Justificación

- **Consolidación**: Todos los componentes eliminados tenían funcionalidades que ya estaban incluidas en `rmVerticalScrubber`.
- **Mantenimiento**: Reducir el número de componentes simplifica el mantenimiento y la actualización del código.
- **Coherencia**: Un único componente centralizado asegura una experiencia de usuario consistente.

## Impacto

- **Experiencia de Usuario**: La funcionalidad sigue siendo la misma, pero ahora está centralizada en un solo componente.
- **Rendimiento**: No hay impacto negativo en el rendimiento, ya que la funcionalidad es la misma.
- **Documentación**: Se ha creado este archivo para documentar los cambios y facilitar futuras revisiones.

## Futuras Mejoras

- Considerar la posibilidad de dividir el componente en subcomponentes más pequeños si la complejidad aumenta.
- Añadir pruebas unitarias para asegurar la estabilidad del componente.
- Mejorar la accesibilidad con más atributos ARIA y pruebas de accesibilidad.