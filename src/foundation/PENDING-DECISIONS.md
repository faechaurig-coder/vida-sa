# Decisiones de diseño pendientes — Fase 1

Cursor **no debe inventar** respuestas a estos puntos. Reportar al equipo de diseño antes de conectar contenido o UI.

## Críticas (bloquean integración completa)

### 1. Dinero — escala
- **Hoy en foundation:** entero absoluto (como `money` del slice).
- **Pregunta:** ¿Dinero es cantidad en moneda o escala 0–100 como las demás stats?

### 2. Convivencia de motores
- **Hoy:** `src/engine/` (años + cartas) sigue siendo el juego jugable.
- **Pregunta:** ¿El motor mensual **reemplaza** al legacy en una fecha concreta, o coexisten por mundo/modo?

### 3. Distribución mensual exacta
- **Hoy:** pesos placeholder en `world.rules.monthDistribution` (28/34/26/8/4 %).
- **Pregunta:** ¿Probabilidades oficiales por mundo? ¿Dependen de etapa o stats?

### 4. Economía mensual
- **Hoy:** el slice usa `income`, `expenses`, `debt`, tick anual.
- **Pregunta:** ¿Se mantienen campos económicos ocultos además de `dinero`? ¿Tick mensual de ingresos/gastos?

### 5. Stat `bonds` / vínculos del slice
- **Hoy:** `bonds` existe en legacy; Fase 1 no lo lista como stat universal.
- **Pregunta:** ¿Se elimina, se fusiona con relaciones, o queda oculto?

### 6. Meta-loop PV / perks / rank
- **Hoy:** sistemas del slice no están en el brief Fase 1.
- **Pregunta:** ¿Siguen vigentes en el producto final o se deprecan con el motor mensual?

## Importantes (no bloquean scaffold)

### 7. Fecha de inicio por semilla
- ¿Todas las vidas empiezan en la misma fecha calendario o depende del origen?

### 8. Fin de vida
- ¿Colapso por salud/dinero? ¿Edad máxima? ¿Por historia?

### 9. Maldad — valor inicial y efectos
- ¿Empieza en 0 siempre? ¿Qué umbrales modifican eventos? (solo estructura preparada)

### 10. Pareja — generación
- ¿Cuándo aparece? ¿Traits fijos o generados? (solo stub de 4 rasgos)

### 11. Mapeo etapas legacy → nuevas
- Tabla provisional en `bridge/legacy.js` — requiere confirmación.

### 12. Mundo 2
- Solo placeholder en UI. ¿ID, reglas y desbloqueo oficiales?

---

**Estado:** scaffold arquitectónico listo. Contenido masivo y UI (Fase 2) esperan respuestas en ítems 1–6.
