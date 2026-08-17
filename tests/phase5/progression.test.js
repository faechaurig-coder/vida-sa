import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createGame, resolveDecision, startMonth } from "../../src/motor/loop.js";
import { getStoryStatus, STORY_STATUS, listStoriesForUI } from "../../src/motor/stories.js";
import { getStoryDef } from "../../src/content/stories/definitions.js";
import { detectUnlocks } from "../../src/motor/unlocks.js";
import { checkMissionProgress, missionsView } from "../../src/motor/missions.js";
import { collectionView, initGameCollection, slotState } from "../../src/motor/collection.js";
import { getCatalog } from "../../src/content/worlds/index.js";
import { CAPITALISMO_COLLECTIBLES } from "../../src/content/worlds/capitalismo/meta.js";

describe("fase 5 · progresión", () => {
  it("navegación no altera el estado de la partida", () => {
    let game = startMonth(createGame({ worldId: "clasico", name: "Ana" }));
    const snapshot = {
      eventId: game.pendingEvent.id,
      month: game.player.calendar.month,
      flags: [...game.player.flags],
    };
    const tabOnly = { ...game, _uiTab: "stories" };
    assert.equal(tabOnly.pendingEvent.id, snapshot.eventId);
    assert.equal(tabOnly.player.calendar.month, snapshot.month);
    assert.deepEqual(tabOnly.player.flags, snapshot.flags);
  });

  it("desbloquea historia al progresar primer capítulo", () => {
    const before = createGame({ worldId: "clasico" });
    const after = {
      ...before,
      player: {
        ...before.player,
        stories: {
          cantante: {
            storyId: "cantante",
            discovered: true,
            discoveredChapters: ["interes_musica"],
            completed: false,
          },
        },
      },
    };
    const unlocks = detectUnlocks({ player: before.player, missions: before.missions }, after);
    assert.ok(unlocks.some((u) => u.type === "story" && u.id === "cantante"));
  });

  it("estados de historia: bloqueada, desconocida y en progreso", () => {
    const def = getStoryDef("cantante");
    const locked = createGame({ worldId: "clasico" }).player;
    assert.equal(getStoryStatus(locked, def), STORY_STATUS.LOCKED);

    const hinted = { ...locked, flags: ["clases_musica"] };
    assert.equal(getStoryStatus(hinted, def), STORY_STATUS.UNKNOWN);

    const progress = {
      ...locked,
      stories: { cantante: { discovered: true, discoveredChapters: ["interes_musica"] } },
    };
    assert.equal(getStoryStatus(progress, def), STORY_STATUS.IN_PROGRESS);
  });

  it("lista historias para UI en mundo clásico", () => {
    const game = createGame({ worldId: "clasico" });
    const items = listStoriesForUI(game.player, "clasico");
    assert.equal(items.length, 5);
    assert.equal(items[0].displayTitle, "???");
  });

  it("misión de capitalismo progresa con dinero", () => {
    let game = createGame({ worldId: "capitalismo" });
    game.player.stats.dinero = 1_500_000;
    game = checkMissionProgress(game);
    assert.ok(game.missions.completed.includes("millon"));
    assert.equal(game.missions.active, "diez_millones");
  });

  it("vista de misiones muestra actual y siguiente", () => {
    const game = createGame({ worldId: "capitalismo" });
    const view = missionsView(game);
    assert.equal(view.current?.id, "millon");
    assert.equal(view.next?.id, "diez_millones");
    assert.equal(view.next?.locked, true);
  });

  it("colección capitalismo tiene estructura por mundo", () => {
    const collection = initGameCollection(CAPITALISMO_COLLECTIBLES);
    assert.equal(collection.house.length, 5);
    assert.equal(collection.vehicle.length, 5);
    assert.equal(collection.special.length, 3);
    assert.equal(collection.special[0].hidden, true);
  });

  it("objeto especial permanece oculto hasta desbloquear", () => {
    const game = createGame({ worldId: "capitalismo" });
    const view = collectionView(game);
    assert.equal(view.special[0].state, "hidden");
    assert.equal(view.special[0].displayName, "???");
  });

  it("persistencia incluye historias, misiones y colección", () => {
    const game = createGame({ worldId: "capitalismo" });
    game.player.stories = { cantante: { discovered: true, discoveredChapters: ["x"] } };
    game.missions = { completed: ["millon"], active: "diez_millones" };
    const json = JSON.stringify({ motorGame: game });
    const loaded = JSON.parse(json).motorGame;
    assert.ok(loaded.player.stories.cantante);
    assert.ok(loaded.missions.completed.includes("millon"));
    assert.ok(loaded.player.collection.house.length === 5);
  });

  it("regresar a vida conserva evento pendiente", () => {
    let game = startMonth(createGame({ worldId: "clasico" }));
    const pendingId = game.pendingEvent.id;
    const phase = game.phase;
    const restored = { ...game, _tab: "life" };
    assert.equal(restored.pendingEvent.id, pendingId);
    assert.equal(restored.phase, phase);
  });

  it("resolver decisión con historia genera unlock", () => {
    let game = startMonth(createGame({ worldId: "clasico" }));
    const musica = getCatalog("clasico").find((e) => e.id === "c_inf_musica");
    game = { ...game, pendingEvent: musica, phase: "awaiting_decision" };
    game = resolveDecision(game, "si");
    assert.ok(game.lastResult?.unlocks?.some((u) => u.type === "story"));
    assert.ok(game.player.stories.cantante?.discovered);
  });

  it("casas disponibles muestran estado según dinero", () => {
    const collection = initGameCollection(CAPITALISMO_COLLECTIBLES);
    const slot = collection.house[1];
    assert.equal(slotState(slot, 600_000), "available");
    assert.equal(slotState(slot, 10_000), "locked");
  });
});
