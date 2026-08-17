import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { advanceMonth, computeAge, formatMonthYear, createCalendar } from "../../src/foundation/time.js";

describe("foundation · tiempo", () => {
  it("avanza un mes y da la vuelta al año", () => {
    assert.deepEqual(advanceMonth({ year: 2028, month: 12 }), { year: 2029, month: 1 });
    assert.deepEqual(advanceMonth({ year: 2028, month: 3 }), { year: 2028, month: 4 });
  });

  it("formatea mes y año en español", () => {
    assert.equal(formatMonthYear({ year: 2028, month: 3 }), "MARZO 2028");
  });

  it("calcula edad desde nacimiento", () => {
    const birth = createCalendar(2012, 3);
    const cal = createCalendar(2028, 2);
    assert.equal(computeAge(birth, cal), 15);
    assert.equal(computeAge(birth, createCalendar(2028, 3)), 16);
  });
});
