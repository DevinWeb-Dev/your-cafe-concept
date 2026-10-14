
import assert from "node:assert/strict";

import {
  createCafeInitialState,
  seatGuests,
  reserveTable,
  isTableFreeForPeriod,
  placeOrder,
  updateOrderStatus,
  recordPayment,
  completeVisit,
  getTableStatus,
} from "../src/engine/cafeEngine.js";

import {
  MENU_ITEMS,
  POLICIES,
} from "../src/data/config.js";

const now = Date.now();

let state = createCafeInitialState();

assert(
  state.tables.length > 0,
  "No seating is configured"
);

const table =
  state.tables.find(
    (t) => t.capacity >= 2 && t.id !== "T-001"
  ) ||
  state.tables.find((t) => t.capacity >= 2);

assert(table, "No table has capacity for 2 guests");

state = seatGuests(
  state,
  {
    tableId: table.id,
    nickname: "Batch12 Demo",
    partySize: 2,
  },
  now
);

assert.equal(
  getTableStatus(state, table.id, now),
  "occupied"
);

assert.throws(
  () =>
    seatGuests(
      state,
      {
        tableId: table.id,
        partySize: 2,
      },
      now
    ),
  /available|conflict|seated/i
);

const product =
  MENU_ITEMS.find(
    (p) =>
      p.available &&
      Array.isArray(p.recipe) &&
      p.kind === "food"
  ) ||
  MENU_ITEMS.find(
    (p) =>
      p.available &&
      Array.isArray(p.recipe) &&
      p.kind === "retail"
  ) ||
  MENU_ITEMS.find(
    (p) => p.available && Array.isArray(p.recipe)
  );

assert(
  product,
  "No available menu item with ingredients was found"
);

state = placeOrder(
  state,
  {
    type: "dinein",
    tableId: table.id,
    nickname: "Batch12 Demo",
    items: [
      {
        productId: product.id,
        quantity: 1,
        options: {},
      },
    ],
  },
  now + 1000
);

const orderId = state.orders[0].id;

assert.equal(state.orders[0].status, "received");

for (const status of [
  "accepted",
  "preparing",
  "ready",
  "completed",
]) {
  state = updateOrderStatus(
    state,
    orderId,
    status,
    now + 1000
  );
}

assert(
  state.orders[0].inventoryDeducted,
  "Stock deduction flag was not set"
);

assert.throws(
  () =>
    updateOrderStatus(
      state,
      orderId,
      "completed",
      now + 2000
    ),
  /invalid/i
);

state = recordPayment(
  state,
  orderId,
  "cash",
  now + 3000
);

assert.equal(state.transactions.length, 1);

assert.throws(
  () =>
    recordPayment(
      state,
      orderId,
      "cash",
      now + 4000
    ),
  /already/i
);

state = completeVisit(
  state,
  state.visits[0].id,
  now + 5000
);

assert.equal(
  state.visits[0].status,
  "completed"
);

assert.equal(
  getTableStatus(
    state,
    table.id,
    now + 5000
  ),
  "cleaning"
);

const other = state.tables.find(
  (t) =>
    t.id !== table.id &&
    !t.unavailable &&
    !t.cleaning
);

assert(other);

const startAt =
  now + 2 * 24 * 60 * 60 * 1000;

state = reserveTable(
  state,
  {
    tableId: other.id,
    partySize: 1,
    startAt,
  },
  now
);

assert.equal(
  isTableFreeForPeriod(
    state,
    other.id,
    startAt,
    startAt +
      POLICIES.reservationDurationMinutes * 60000,
    now
  ),
  false
);

assert.throws(
  () =>
    reserveTable(
      state,
      {
        tableId: other.id,
        partySize: 1,
        startAt,
      },
      now
    ),
  /unavailable/i
);

console.log(
  "PASS: initial seating, duplicate-seat rejection, dine-in order, barista flow, inventory deduction, payment once, checkout, cleaning, overlapping reservation rejection."
);

console.log(
  "NOTE: Pure state test only; browser layout, Netlify and real-payment behavior are NOT tested."
);
