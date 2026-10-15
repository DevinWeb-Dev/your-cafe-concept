import assert from "node:assert/strict";

import {
  POLICIES,
  MENU_ITEMS,
} from "../src/data/config.js";

import {
  createCafeInitialState,
  reserveTable,
  cancelReservation,
  isTableFreeForPeriod,
  seatGuests,
  getTableStatus,
  completeVisit,
  setTableCondition,
  quoteMenuItem,
  quoteCart,
  placeOrder,
  updateOrderStatus,
  recordPayment,
  getMemberPoints,
  getCafeStats,
} from "../src/engine/cafeEngine.js";

const now = Date.now();

const minute = 60_000;

const future =
  now + 24 * 60 * minute;

let state = createCafeInitialState();

let count = 0;

function test(label, callback) {
  try {
    callback();

    count++;

    console.log(
      `  ✔ ${label}`
    );
  } catch (error) {
    console.error(
      `  ✖ ${label}: ${error.message}`
    );

    process.exitCode = 1;
  }
}

console.log(
  "\nYOUR CAFÉ. / BATCH 6 ENGINE SMOKE TEST\n"
);

const tableId =
  state.tables.find(
    (table) =>
      table.capacity >= 2
  )?.id;

let reservationId = null;

// TEST 01

test(
  "28 original café seating units retained",
  () => {
    assert.equal(
      state.tables.length,
      28
    );

    assert.ok(tableId);
  }
);

// TEST 02

test(
  "Future demo reservation succeeds",
  () => {
    state = reserveTable(
      state,
      {
        tableId,
        nickname: "QA Guest",
        partySize: 2,
        startAt: future,

        durationMinutes:
          POLICIES.reservationDurationMinutes,
      },
      now
    );

    reservationId =
      state.reservations[0].id;

    assert.equal(
      state.reservations[0].status,
      "reserved"
    );
  }
);

// TEST 03

test(
  "Conflicting reservation is blocked",
  () => {
    assert.equal(
      isTableFreeForPeriod(
        state,
        tableId,
        future,
        future + 60 * minute,
        now
      ),
      false
    );

    assert.throws(
      () =>
        reserveTable(
          state,
          {
            tableId,

            nickname:
              "Another Guest",

            partySize: 2,
            startAt: future,
            durationMinutes: 60,
          },
          now
        ),
      /unavailable/i
    );
  }
);

// TEST 04

test(
  "Reservation cancellation releases the slot",
  () => {
    state = cancelReservation(
      state,
      reservationId,
      now
    );

    assert.equal(
      isTableFreeForPeriod(
        state,
        tableId,
        future,
        future + 60 * minute,
        now
      ),
      true
    );
  }
);

// TEST 05

const drink = MENU_ITEMS.find(
  (item) =>
    item.available &&
    item.kind === "drink"
);

let chosen = null;
let orderId = null;

test(
  "Menu price quote produces a valid line",
  () => {
    assert.ok(drink);

    chosen = quoteMenuItem(
      drink.id,
      2
    );

    assert.equal(
      chosen.quantity,
      2
    );

    assert.ok(
      chosen.lineTotal > 0
    );
  }
);

// TEST 06

test(
  "Cart quote equals combined line price",
  () => {
    const quote = quoteCart([
      {
        productId: drink.id,
        quantity: 2,
      },
    ]);

    assert.equal(
      quote.lines.length,
      1
    );

    assert.equal(
      quote.total,
      chosen.lineTotal
    );
  }
);

// TEST 07

test(
  "Demo checkout creates an order",
  () => {
    state = placeOrder(
      state,
      {
        type: "pickup",

        nickname: "QA Guest",

        items: [
          {
            productId: drink.id,
            quantity: 2,
          },
        ],
      },
      now
    );

    orderId =
      state.orders[0].id;

    assert.equal(
      state.orders[0].status,
      "received"
    );
  }
);

// TEST 08

test(
  "Payment is recorded only once",
  () => {
    state = recordPayment(
      state,
      orderId,
      "cash",
      now
    );

    assert.equal(
      state.transactions.length,
      1
    );

    assert.throws(
      () =>
        recordPayment(
          state,
          orderId,
          "cash",
          now
        ),
      /already/i
    );
  }
);

// TEST 09

test(
  "Barista order progresses through original states",
  () => {
    for (const step of [
      "accepted",
      "preparing",
      "ready",
    ]) {
      state = updateOrderStatus(
        state,
        orderId,
        step,
        now
      );
    }

    assert.equal(
      state.orders[0].status,
      "ready"
    );
  }
);

// TEST 10

test(
  "Completing an order deducts inventory exactly once",
  () => {
    const needed =
      state.orders[0]
        .lines[0]
        .ingredients.find(
          (item) =>
            item.quantity > 0
        );

    assert.ok(needed);

    const before =
      state.inventory.find(
        (item) =>
          item.id ===
          needed.ingredientId
      ).quantity;

    state = updateOrderStatus(
      state,
      orderId,
      "completed",
      now
    );

    const after =
      state.inventory.find(
        (item) =>
          item.id ===
          needed.ingredientId
      ).quantity;

    assert.equal(
      before - after,
      needed.quantity
    );

    assert.throws(
      () =>
        updateOrderStatus(
          state,
          orderId,
          "completed",
          now
        ),
      /Invalid order status/i
    );
  }
);

// TEST 11

test(
  "Loyalty points come from paid orders",
  () => {
    assert.equal(
      getMemberPoints(
        state,
        "QA Guest"
      ),

      Math.floor(
        state.orders[0].total /
          POLICIES.loyaltySpendPerPoint
      )
    );
  }
);

// TEST 12

test(
  "Dashboard totals reflect paid demo transactions",
  () => {
    const stats = getCafeStats(
      state,
      now
    );

    assert.equal(
      stats.todayRevenue,
      state.transactions[0].amount
    );

    assert.equal(
      stats.totalTables,
      28
    );
  }
);

// TEST 13

test(
  "Table check-in, checkout and cleaning status work",
  () => {
    state = seatGuests(
      state,
      {
        tableId,

        nickname: "QA Guest",
        partySize: 2,
      },
      now
    );

    assert.equal(
      getTableStatus(
        state,
        tableId,
        now
      ),
      "occupied"
    );

    state = completeVisit(
      state,
      state.visits[0].id,
      now
    );

    assert.equal(
      getTableStatus(
        state,
        tableId,
        now
      ),
      "cleaning"
    );

    state = setTableCondition(
      state,
      tableId,
      {
        field: "cleaning",
        value: false,
      },
      now
    );

    assert.equal(
      getTableStatus(
        state,
        tableId,
        now
      ),
      "available"
    );
  }
);

console.log(
  `\n${count} smoke tests passed${
    process.exitCode
      ? " (some failed)"
      : ""
  }.`
);

if (!process.exitCode) {
  console.log(
    "All test data was in memory. No browser storage was changed."
  );
}