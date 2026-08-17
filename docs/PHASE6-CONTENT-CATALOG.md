# Fase 6 — Catálogo de decisiones y contenido

Motor de contenido escalable para diseñar y controlar todas las decisiones del juego sin convertirlo en un RPG.

## 1. Estructura del catálogo

```
WORLD
 └── LIFE STAGE (5 etapas)
      └── CATEGORY (10 categorías)
           └── EVENT (decisión mensual)
                └── OPTIONS (2–3 opciones con efectos/flags)
```

**Código:** `src/content/catalog/`

| Módulo | Responsabilidad |
|--------|-----------------|
| `taxonomy.js` | Etapas, categorías, tipos de evento, trabajos, rasgos de pareja |
| `schema.js` | `defineEvent()`, `normalizeEvent()`, `validateCatalog()` |
| `matrix.js` | Índice, matriz maestra, export markdown |
| `index.js` | `buildWorldCatalog()` — ensambla mundo completo |
| `fame.js` | Reglas de fama (atributo especial, no stat) |
| `careers.js` | Catálogo de trabajos por tier |
| `partner.js` | Reglas de los 4 rasgos internos de pareja |

**Integración:** `src/content/worlds/index.js` expone `CATALOGS`, `getCatalog()`, `getCatalogIndex()`, `getContentMatrix()`.

---

## 2. Ciclo mensual (regla fundamental)

```
startMonth → evento → decisión → consecuencias → desbloqueos → finishMonth → siguiente mes
```

- **No hay botón "siguiente mes".** Una decisión siempre avanza el tiempo.
- El picker (`src/motor/picker.js`) **no fue reemplazado** — solo documentado.

---

## 3. Etapas de vida (5)

| ID | Etiqueta | Edad aprox. |
|----|----------|-------------|
| `infancia` | Infancia | 0–11 |
| `adolescencia` | Adolescencia | 12–17 |
| `universidad` | Universidad / Juventud | 18–24 |
| `adultez` | Adultez | 25–59 |
| `madurez` | Madurez | 60+ |

Cada evento declara `stage` → se copia a `requirements.stage` automáticamente.

---

## 4. Categorías (10)

`familia` · `amistad` · `escuela` · `trabajo` · `dinero` · `salud` · `relaciones` · `personalidad` · `oportunidad` · `especial`

**Alias legacy** (normalizados por `defineEvent`):

| Antes | Ahora |
|-------|-------|
| social | amistad |
| ocio | oportunidad |
| estudios | escuela |
| historias | especial |
| eventos | especial |

---

## 5. Tipos de evento (metadata)

| Tipo | Uso |
|------|-----|
| `normal` | Cotidiano |
| `important` | Consecuencias mayores (primer trabajo, beats capitalismo) |
| `story` | Línea narrativa (cantante, futbolista…) |
| `special` | Raro / desbloqueable (ej. atajo con maldad alta) |
| `world` | Exclusivo de temática del mundo (capitalismo) |

No es un sistema de gameplay separado — solo metadata para diseño y priorización futura.

---

## 6. Estructura de un evento

```js
defineEvent({
  id: "c_inf_musica",
  worldId: "clasico",
  stage: "infancia",
  category: "escuela",
  kind: "story",           // opcional — se infiere de storyId
  title: "La clase de música",
  description: "...",
  weight: 1,               // peso en picker
  cooldown: 6,             // meses antes de repetir
  exclusive: false,        // si true → solo una vez por vida
  repeatable: true,        // default: !exclusive
  requirements: { flags: ["clases_musica"] },
  storyId: "cantante",
  chapterId: "interes_musica",
  options: [{
    id: "si",
    text: "Pedir clases",
    effects: { money: -40, happiness: 6 },
    storyProgress: { storyId: "cantante", chapterId: "interes_musica", flag: "clases_musica" },
    unlock: { careerId: "cantante" },       // opcional
    deferred: { type: "event", id: "...", after: 3 },
    nextEvent: "c_uni_cantante_juegos",
  }],
});
```

**Efectos** usan las 5 stats: `health/happiness/money/influence/evil` (mapeados internamente).

**Flags** vía `storyProgress.flag`, `effects.flagsAdd`, `effects.flagsRemove`.

---

## 7. Reglas del picker (anti-repetición y prioridad)

Archivo: `src/motor/picker.js`

### Orden de selección

1. **Forzado** (`forcedEventId` / `nextEvent` de decisión anterior)
2. **Diferido** (`deferred` con `monthsLeft <= 0`)
3. **Historia** (`eventType: story` elegibles) — peso aplicado
4. **Vida normal** — pool general con peso/cooldown

### Anti-repetición

| Mecanismo | Comportamiento |
|-----------|----------------|
| `cooldown` | Tras jugar evento, no reaparece N meses (default 6). Todos los cooldowns bajan 1/mes. |
| `recentEvents` | Últimos 8 IDs — peso ×0.15 si está en la lista |
| `exclusive` | Si `seenExclusive` contiene el ID, nunca más |
| `repeatable: false` | Equivalente a exclusivo |

**Los eventos NO se eliminan permanentemente** salvo `exclusive: true`.

### Peso

- Base: `weight` (default 1)
- `rarity: rare` → ×0.6
- En `recentEvents` → ×0.15
- Tag de etapa actual → ×1.2

### Prioridad deseada (diseño)

1. Historia disponible
2. Especial desbloqueado
3. Importante
4. Normal

El picker ya prioriza historias en paso 3. Tipos `important`/`special`/`world` tienen mayor `weight` en contenido existente (beats ×1.4, cooldown ×12).

---

## 8. Maldad

- Stat base #5 — crece por decisiones, no por sistema moral automático.
- **No castiga automáticamente** — abre caminos distintos.
- Ejemplo: `c_adu_maldad_atajo` requiere `evilMin: 15`, da dinero + maldad o influencia − maldad.
- Gates: `evilMin`, `evilMax` en `requirements.js`.

---

## 9. Pareja (4 rasgos internos)

`empatia` · `carrino` · `ambicion` · `riesgo` — **no visibles al jugador**.

Implementación: `src/foundation/relationships/partner.js`  
Reglas documentadas: `src/content/catalog/partner.js`

Efectos pasivos mensuales sobre los 5 stats. Generan eventos futuros (ej. `c_adu_pareja_viaje` requiere `hasPartner: true`).

---

## 10. Fama

**No es stat principal.** Se desbloquea vía `unlock.fame` o progreso de historia.

- Gates: `requirements.fameLine`, flags `fame_*`
- Líneas: cantante, futbolista, actor, escritor
- Documentación: `src/content/catalog/fame.js`

---

## 11. Trabajos (5 tiers)

`normal` → `especial` → `raro` → `elite` → `legendario`

Catálogo: `src/content/catalog/careers.js` + `clasico/meta.js`

Cada trabajo: dinero, felicidad, eventos exclusivos (futuro). Sin productividad/estrés/habilidades.

---

## 12. Las 5 historias especiales

| Historia | Origen (infancia/adolescencia) | Flag | Cadena principal |
|----------|-------------------------------|------|------------------|
| **Cantante** | `c_inf_musica` | `clases_musica` | juegos uni → productor → primer show → carrera |
| **Futbolista** | `c_inf_futbol` | `futbol_nino` | prueba semipro |
| **Escritor** | `c_ado_escritor_diario` | `escribe_diario` | (estructura para capítulos futuros) |
| **Actor** | `c_adu_actor_casting` | `actor_casting` | (estructura para capítulos futuros) |
| **Emprendedor** | `c_uni_emprendedor_idea` | `tiene_idea` | (estructura para capítulos futuros) |

Arcos en: `src/content/stories/definitions.js` (campo `arc`).

**Regla:** el jugador descubre el camino por decisiones — no hay mensaje "desbloqueaste carrera de cantante" en infancia.

---

## 13. Resumen por mundo

| Mundo | Eventos | Historias | Misiones | Colección |
|-------|---------|-----------|----------|-----------|
| Clásico | 25 | 5 (9 eventos story) | — | — |
| Capitalismo | 12 (11 legacy + hint) | — | 3 | casas/coches/objetos |

---

## 14. Matriz maestra de contenido

| Mundo | Etapa | Categoría | Tipo | ID | Evento | Historia | Requisitos | Repetible |
|-------|-------|-----------|------|-----|--------|----------|------------|-----------|
| clasico | Infancia | Amistad | Normal | c_inf_escuela_amigo | El nuevo de la clase | — | etapa:infancia | sí |
| clasico | Infancia | Escuela / Universidad | Historia | c_inf_musica | La clase de música | cantante | etapa:infancia | sí |
| clasico | Infancia | Familia | Normal | c_inf_familia_cena | La cena familiar | — | etapa:infancia | sí |
| clasico | Infancia | Oportunidad | Historia | c_inf_futbol | El balón nuevo | futbolista | etapa:infancia | sí |
| clasico | Infancia | Oportunidad | Normal | c_inf_ocio_patio | El partido del recreo | — | etapa:infancia | sí |
| clasico | Adolescencia | Escuela / Universidad | Normal | c_ado_estudio_fiesta | Fiesta o examen | — | etapa:adolescencia | sí |
| clasico | Adolescencia | Oportunidad | Historia | c_ado_escritor_diario | El cuaderno secreto | escritor | etapa:adolescencia | sí |
| clasico | Adolescencia | Personalidad | Importante | c_ado_moral_cartera | La cartera encontrada | — | etapa:adolescencia | sí |
| clasico | Adolescencia | Relaciones | Normal | c_ado_romance_nota | La nota anónima | — | etapa:adolescencia | sí |
| clasico | Adolescencia | Trabajo | Importante | c_ado_trabajo_verano | Trabajo de verano | — | etapa:adolescencia | sí |
| clasico | Universidad / Juventud | Escuela / Universidad | Normal | c_uni_estudio_beca | La beca complicada | — | etapa:universidad | sí |
| clasico | Universidad / Juventud | Oportunidad | Historia | c_uni_cantante_juegos | Los juegos universitarios | cantante | etapa:universidad, flags:clases_musica | sí |
| clasico | Universidad / Juventud | Oportunidad | Historia | c_uni_cantante_productor | El productor | cantante | etapa:universidad, flags:clases_musica | sí |
| clasico | Universidad / Juventud | Oportunidad | Historia | c_uni_emprendedor_idea | La idea en una servilleta | emprendedor | etapa:universidad | sí |
| clasico | Universidad / Juventud | Relaciones | Normal | c_uni_relacion_inicio | Café después de clase | — | etapa:universidad | sí |
| clasico | Adultez | Dinero | Normal | c_adu_dinero_prestamo | Tu amigo necesita dinero | — | etapa:adultez | sí |
| clasico | Adultez | Especial | Especial | c_adu_maldad_atajo | El atajo sucio | — | etapa:adultez, maldad≥15 | sí |
| clasico | Adultez | Oportunidad | Historia | c_adu_actor_casting | El casting | actor | etapa:adultez | sí |
| clasico | Adultez | Oportunidad | Historia | c_adu_futbol_prueba | La prueba semiprofesional | futbolista | etapa:adultez, flags:futbol_nino | sí |
| clasico | Adultez | Relaciones | Normal | c_adu_pareja_viaje | El viaje sorpresa | — | etapa:adultez, pareja | sí |
| clasico | Adultez | Salud | Normal | c_adu_salud_checkup | El chequeo anual | — | etapa:adultez | sí |
| clasico | Adultez | Trabajo | Historia | c_adu_cantante_primer_show | Tu primer show pagado | cantante | etapa:adultez, flags:clases_musica | sí |
| clasico | Adultez | Trabajo | Normal | c_adu_trabajo_extra | Horas extra | — | etapa:adultez | sí |
| clasico | Madurez | Familia | Normal | c_mad_familia_nietos | Visita familiar | — | etapa:madurez | sí |
| clasico | Madurez | Salud | Normal | c_mad_salud_rutina | La rutina del médico | — | etapa:madurez | sí |
| capitalismo | Adolescencia | Escuela / Universidad | Importante | el_atajo | El atajo | — | etapa:adolescencia | sí |
| capitalismo | Adolescencia | Oportunidad | Mundo | el_finde | El único domingo | — | etapa:adolescencia | sí |
| capitalismo | Universidad / Juventud | Dinero | Importante | el_techo | El techo | — | etapa:universidad | sí |
| capitalismo | Universidad / Juventud | Trabajo | Mundo | primer_contrato | El contrato sonríe | — | etapa:universidad | sí |
| capitalismo | Adultez | Dinero | Mundo | cap_mision_hint | El primer millón | — | etapa:adultez | sí |
| capitalismo | Adultez | Dinero | Mundo | la_cuota | La cuota tiene tu cara | — | etapa:adultez, req:cuotas | sí |
| capitalismo | Adultez | Dinero | Importante | la_hipoteca | La hipoteca emocional | — | etapa:adultez, req:deuda | sí |
| capitalismo | Adultez | Dinero | Mundo | semaforo | El semáforo te evalúa | — | etapa:adultez | sí |
| capitalismo | Adultez | Especial | Importante | el_acta | El comité de tu vida | — | etapa:adultez | sí |
| capitalismo | Adultez | Salud | Mundo | la_factura | La factura | — | etapa:adultez | sí |
| capitalismo | Adultez | Trabajo | Mundo | la_entrevista | La entrevista que pedía título | — | etapa:adultez, req:atajo | sí |
| capitalismo | Adultez | Trabajo | Importante | synergy | Lead of Synergy | — | etapa:adultez | sí |

Regenerar: `node -e "import { formatMatrixMarkdown } from './src/content/catalog/matrix.js'; import { CATALOGS } from './src/content/worlds/index.js'; ..."`

---

## 15. Tests

`tests/phase6/catalog.test.js` — 14 tests nuevos.

**Total: 68/68** (54 anteriores + 14 fase 6).

Cubre: etapa, categoría, requisitos, cooldown, historia, repetible, transición mensual, índice, matriz.

---

## 16. Deliberadamente NO implementado

- Nuevos mundos (Romance, Apocalipsis…)
- Monetización / tienda / anuncios
- Nuevos stats, habilidades, energía, stamina, niveles
- Árbol de talentos / inventario complejo
- UI de catálogo para el jugador
- Cientos de eventos nuevos
- Cambios al picker (solo documentación)
- Psicología visible / IA adaptativa

---

## 17. Cómo agregar contenido

1. Crear evento con `defineEvent({ worldId, stage, category, ... })` en `worlds/<mundo>/events.js`
2. Validar: `validateCatalog(events, { worldId })`
3. Verificar matriz: `getContentMatrix(worldId)`
4. Si es historia: enlazar `storyId`, `chapterId`, flags en `storyProgress`
5. Ejecutar `npm test`
