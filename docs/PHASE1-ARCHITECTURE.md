# Fase 1 — Arquitectura del gameplay

Documento de ingeniería. El diseño lo definen los diseñadores; este módulo **no inventa mecánicas**.

## Objetivo

Construir la base del simulador de vida (motor temporal mensual, estado, eventos, historias, mundos, carreras, relaciones, coleccionables) **sin romper** el vertical slice jugable actual en `src/engine/`.

## Qué se reutiliza (sin cambios)

| Módulo | Rol |
|--------|-----|
| `src/engine/*` | Motor legacy por **años** y **cartas** — sigue siendo el juego en producción |
| `src/content/*` | Semillas, eventos, copy — referencia de contenido |
| `src/systems/*` | PV, perks, rank, persist — meta-loop del slice |
| `src/ui/*` | Interfaz actual del slice |
| `tests/play.test.js` etc. | Regresión del juego actual |

## Qué se añadió

Nuevo namespace: **`src/foundation/`**

```
src/foundation/
├── constants.js          # Stats universales, tipos de mes, etapas, carreras
├── stats.js              # Salud, Felicidad, Dinero, Influencia, Maldad
├── time.js               # Calendario mensual (1 mes = 1 turno)
├── stages.js             # Infancia → Madurez (extensible)
├── player.js             # Estado del jugador Fase 1
├── effects.js            # Consecuencias y pasivos de pareja (mínimo)
├── unlocks.js            # Desbloqueos (carrera, fama)
├── loop.js               # Loop mensual: beginMonth → decide → closeMonth
├── events/
│   ├── selector.js       # Frecuencia variable de meses + selección
│   └── resolver.js       # Resolver decisión
├── stories/
│   ├── registry.js       # MAIN / SECONDARY / SPECIAL / LIFE_EVENT
│   └── progress.js       # Capítulos entre etapas
├── worlds/
│   └── registry.js       # Mundo + catálogos (sin duplicar motor)
├── careers/
│   └── registry.js       # Tiers: normal → legendario
├── relationships/
│   └── partner.js        # 4 rasgos internos (no UI)
├── collectibles/
│   └── registry.js       # 5 casas, 5 vehículos, 3 especiales ocultos
├── bridge/
│   └── legacy.js         # Mapeo slice ↔ Fase 1 (referencia)
└── index.js
```

## Loop mensual (Fase 1)

```
INICIO DEL MES (beginMonth)
  → evaluar estado (edad, etapa, pasivos pareja)
  → seleccionar tipo de mes (tranquilo / normal / decisión / especial / historia)
  → asignar evento si aplica
JUGADOR DECIDE (decide) — solo si hay pendingEvent
  → aplicar consecuencias
  → avanzar capítulo de historia si aplica
CERRAR MES (closeMonth)
  → comprobar desbloqueos (carrera, fama)
  → avanzar calendario (+1 mes)
```

## Stats universales (único set visible)

| Stat | Campo | Rango |
|------|-------|-------|
| ❤️ Salud | `salud` | 0–100 |
| 😊 Felicidad | `felicidad` | 0–100 |
| 💰 Dinero | `dinero` | entero (ver decisiones pendientes) |
| 👑 Influencia | `influencia` | 0–100 |
| 😈 Maldad | `maldad` | 0–100 |

**Fama** no es stat universal: se desbloquea vía historias especiales (`player.fame`).

## Mundos

`WorldDefinition` en `worlds/registry.js`:

- Identidad visual (referencia)
- Reglas (`monthDistribution`, punteros a catálogos legacy)
- Catálogos: eventos, historias, carreras, coleccionables
- Misión principal / secundarias (estructura, sin contenido masivo)

Mundo por defecto: **`capitalismo`** — alinea con el slice actual.

## Historias

Tipos: `main`, `secondary`, `special`, `life_event`.

Capítulos con `stage`, `requireFlags`, continuidad entre etapas. Ejemplo scaffold: línea **artista** (música infancia → universidad → adultez → fama).

## Coleccionables por mundo

- 5 slots `house`
- 5 slots `vehicle`
- 3 slots `special` (ocultos hasta descubrir)

## Relaciones

Pareja con rasgos internos: empatía, cariño, ambición, riesgo. Efectos mensuales mínimos en `partner.js`. Sin simulación compleja (según diseño).

## Carreras

Tiers: `normal`, `especial`, `raro`, `elite`, `legendario`. Registro en `careers/registry.js`. Desbloqueo vía historias.

## Puente legacy

`bridge/legacy.js` traduce `Run` del engine actual → estado Fase 1 para migración futura de contenido. **No sustituye** `play.js`.

## Tests

```
tests/foundation/*.test.js   # Motor Fase 1
tests/*.test.js              # Slice legacy (intacto)
```

## Fase 2 (fuera de alcance aquí)

UI, HUD con 5 stats, navegación, Event Card, colección visual, historias UI — ver brief Fase 2. **No implementado en este entregable.**

## Decisiones pendientes de diseño

Ver `src/foundation/PENDING-DECISIONS.md` — **detener implementación** si falta definición en esos puntos.
