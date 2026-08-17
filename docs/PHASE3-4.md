# Fases 3 y 4 — Motor mensual + primer prototipo jugable

## 1. Archivos nuevos

```
src/motor/
├── constants.js          # Categorías, EFFECT_MAP, etapas
├── requirements.js       # Requisitos condicionales
├── effects.js            # Consecuencias (health→salud, etc.)
├── picker.js             # Selección + anti-repetición + prioridad historias
├── loop.js               # Ciclo: startMonth → resolve → finishMonth
├── missions.js           # Misiones por mundo (capitalismo)
└── adapter/
    └── legacy.js         # Adaptador eventos slice → motor mensual

src/content/worlds/
├── index.js
├── clasico/
│   ├── events.js         # ~24 eventos representativos
│   └── meta.js           # Historias y carreras
└── capitalismo/
    ├── events.js         # 11 eventos legacy adaptados + extras
    └── meta.js           # Misiones y coleccionables

tests/motor/loop.test.js
docs/PHASE3-4.md
```

## 2. Módulos

| Módulo | Rol |
|--------|-----|
| `motor/loop.js` | Corazón reutilizable del juego |
| `motor/picker.js` | Elige evento mensual (historia > vida, peso, cooldown) |
| `motor/requirements.js` | Filtra por stats, edad, flags, pareja, historia… |
| `motor/effects.js` | Aplica consecuencias sin stats extra |
| `content/worlds/` | Catálogo por mundo (WORLD → STAGE → CATEGORY → EVENT) |
| `ui/app.js` | Conecta motor a UI existente (mínimos cambios visuales) |

## 3. Flujo de una decisión

```
EMPEZAR → elegir mundo → crear personaje (o semilla capitalismo)
    → startMonth()        # ENERO 2026 + evento
    → jugador elige opt
    → resolveDecision()   # consecuencias + registro
    → overlay juice       # "Decidiste…" + deltas
    → finishMonth()       # +1 mes
    → startMonth()        # FEBRERO 2026 + nuevo evento
```

**Regla:** no hay botón "siguiente mes". La decisión avanza el tiempo.

## 4. Representación de un evento

```javascript
{
  id: "c_ado_moral_cartera",
  worldId: "clasico",
  stage: "adolescencia",
  category: "dinero",
  eventType: "life",       // o "story"
  title: "La cartera encontrada",
  description: "...",
  requirements: { stage: "adolescencia" },
  options: [
    {
      id: "devolver",
      text: "Devolverla",
      effects: { influence: 8, happiness: 4, evil: -2 },
      resultText: "..."
    }
  ],
  weight: 1,
  cooldown: 6,
  storyId: null            // si es historia
}
```

## 5. Representación de una historia

Progreso en `player.stories`:

```javascript
{
  cantante: {
    storyId: "cantante",
    currentChapter: "juegos_uni",
    discoveredChapters: ["interes_musica", "juegos_uni"],
    completed: false
  }
}
```

Eventos encadenados vía `storyProgress`, `nextEvent`, `requirements.flags`.

## 6. Agregar un mundo nuevo

1. Crear `src/content/worlds/MUNDO/events.js`
2. Registrar en `src/content/worlds/index.js` en `WORLDS`
3. Opcional: `meta.js` con misiones, coleccionables, orígenes
4. El motor (`picker`, `loop`, `requirements`) no cambia

## 7. Catálogo inicial

### Clásico (~24 eventos)
Infancia, adolescencia, universidad, adultez, madurez — familia, estudios, trabajo, dinero, relaciones, salud, ocio, historias.

### Capitalismo (11 legacy + 1)
Todos los eventos de `src/content/events.js` adaptados a formato mensual. Textos y decisiones **preservados**.

## 8. Historias (5 líneas)

Cantante, Futbolista, Escritor, Actor, Emprendedor — con cadenas descubribles (ej. música infancia → universidad → primer show).

## 9. Carreras (ejemplos)

normal: Ayudante · especial: Artista, Futbolista, Escritor, Actor · raro: Emprendedor · legendario: Ícono musical (preparado en meta).

## 10. Capitalismo reutilizado

- `events.js` original → `adaptLegacyEvents()`
- `seeds.js` → orígenes al iniciar partida
- Efectos: health/happiness/money/status → salud/felicidad/dinero/influencia
- Cadenas diferidas → `deferred` / `nextEvent`

## 11. Preparado para futuro

- Coleccionables ocultos (capitalismo: baño de oro, etc.)
- Misiones escalonadas (1M → 10M → 50M)
- Moneda premium (arquitectura en meta, sin implementar pagos)
- Pareja con 4 rasgos internos
- Fama como desbloqueo, no stat HUD

## 12. Tests

42 tests pasando (legacy slice + foundation + motor).
