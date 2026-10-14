import {
  BRAND, POLICIES, MENU_ITEMS, DRINK_SIZES, MILK_OPTIONS,
  DRINK_EXTRAS, DRINK_PACKAGING, PROMOTIONS, INVENTORY_ITEMS,
  PAYMENT_METHODS, createInitialTables, getMenuItem,
  getCustomizationProfile,
} from "../data/config.js";

export const CAFE_STORAGE_KEY = "your-cafe-concept-state-v1";
export const CAFE_STATE_VERSION = 1;
const MINUTE = 60_000;
const id = (prefix) => `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
const money = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const fail = (message) => { throw new Error(message); };
const overlap = (a, b, c, d) => a < d && c < b;
const log = (s, type, text, now) => ({ ...s, events: [{ id: id("evt"), type, text, at: now }, ...s.events].slice(0, 150) });
const tableById = (s, tableId) => s.tables.find((t) => t.id === tableId) || fail("Café table not found.");
const reservationById = (s, reservationId) => s.reservations.find((r) => r.id === reservationId) || fail("Reservation not found.");
const visitById = (s, visitId) => s.visits.find((v) => v.id === visitId) || fail("Visit not found.");
const orderById = (s, orderId) => s.orders.find((o) => o.id === orderId) || fail("Order not found.");
const nonEmptyName = (value) => String(value || "Café Guest").trim().slice(0, 40) || "Café Guest";
const positiveInt = (value, label, max = 100) => {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > max) fail(`${label} must be between 1 and ${max}.`);
  return n;
};

export function createCafeInitialState() {
  return {
    version: CAFE_STATE_VERSION,
    tables: createInitialTables(),
    visits: [], reservations: [], orders: [], transactions: [], events: [],
    inventory: INVENTORY_ITEMS.map((i) => ({ ...i })),
  };
}

export function loadCafeState() {
  try {
    if (typeof window === "undefined") return createCafeInitialState();
    const s = JSON.parse(window.localStorage.getItem(CAFE_STORAGE_KEY) || "null");
    if (s?.version !== CAFE_STATE_VERSION ||
      !["tables", "visits", "reservations", "orders", "transactions", "events", "inventory"].every((k) => Array.isArray(s[k])) ||
      s.tables.length !== createInitialTables().length) return createCafeInitialState();
    return s;
  } catch { return createCafeInitialState(); }
}

export function saveCafeState(state) {
  try {
    if (typeof window === "undefined") return false;
    window.localStorage.setItem(CAFE_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch { return false; }
}

export function getOpenVisit(state, tableId) {
  return state.visits.find((v) => v.tableId === tableId && v.status === "seated") || null;
}

export function getTableStatus(state, tableId, now = Date.now()) {
  const table = tableById(state, tableId);
  if (table.unavailable) return "unavailable";
  if (table.cleaning) return "cleaning";
  if (getOpenVisit(state, tableId)) return "occupied";
  return state.reservations.some((r) => r.tableId === tableId && r.status === "reserved" && r.startAt <= now && now < r.endAt)
    ? "reserved" : "available";
}

export function getElapsedMs(visit, now = Date.now()) {
  return Math.max(0, (visit.completedAt || now) - visit.seatedAt);
}

export function formatElapsed(ms) {
  const seconds = Math.floor(Math.max(0, ms) / 1000);
  return [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60]
    .map((x) => String(x).padStart(2, "0")).join(":");
}

export function isTableFreeForPeriod(state, tableId, startAt, endAt, now = Date.now(), excludeId = null) {
  const table = tableById(state, tableId);
  if (table.unavailable || table.cleaning || !Number.isFinite(startAt) || !Number.isFinite(endAt) || startAt >= endAt) return false;
  // No promised departure for a seated group: conservatively block near-term slots.
  if (getOpenVisit(state, tableId) && startAt < now + POLICIES.reservationDurationMinutes * MINUTE) return false;
  return !state.reservations.some((r) => r.id !== excludeId && r.tableId === tableId &&
    r.status === "reserved" && overlap(startAt, endAt, r.startAt, r.endAt));
}

export function reserveTable(state, input, now = Date.now()) {
  const table = tableById(state, input.tableId);
  const partySize = positiveInt(input.partySize, "Party size", POLICIES.maximumPartySize);
  if (partySize > table.capacity) fail(`${table.id} seats a maximum of ${table.capacity} guest(s).`);
  const startAt = typeof input.startAt === "number" ? input.startAt : Date.parse(input.startAt);
  const durationMinutes = positiveInt(input.durationMinutes ?? POLICIES.reservationDurationMinutes, "Reservation duration", 240);
  const endAt = startAt + durationMinutes * MINUTE;
  if (!Number.isFinite(startAt) || startAt < now + POLICIES.minimumReservationNoticeMinutes * MINUTE ||
    startAt > now + POLICIES.maximumAdvanceBookingDays * 86_400_000) fail("Choose an eligible future reservation time.");
  if (!isTableFreeForPeriod(state, table.id, startAt, endAt, now)) fail("This table is unavailable during your selected time.");
  const reservation = {
    id: id("res"), reference: `CAFE-DEMO-${now.toString(36).toUpperCase()}`,
    tableId: table.id, nickname: nonEmptyName(input.nickname), partySize,
    startAt, endAt, durationMinutes, createdAt: now, status: "reserved",
  };
  return log({ ...state, reservations: [reservation, ...state.reservations] }, "reservation", `${table.id} reserved`, now);
}

export function cancelReservation(state, reservationId, now = Date.now()) {
  const r = reservationById(state, reservationId);
  if (r.status !== "reserved") fail("Only pending reservations can be cancelled.");
  return log({ ...state, reservations: state.reservations.map((x) => x.id === r.id ? { ...x, status: "cancelled", cancelledAt: now } : x) },
    "reservation", `${r.tableId} reservation cancelled`, now);
}

export function seatGuests(state, input, now = Date.now()) {
  const table = tableById(state, input.tableId);
  const partySize = positiveInt(input.partySize ?? 1, "Party size", POLICIES.maximumPartySize);
  if (partySize > table.capacity) fail(`${table.id} has only ${table.capacity} seat(s).`);
  if (table.unavailable || table.cleaning || getOpenVisit(state, table.id)) fail("Table is not available for seating.");
  let reservation = null;
  if (input.reservationId) {
    reservation = reservationById(state, input.reservationId);
    if (reservation.tableId !== table.id || reservation.status !== "reserved") fail("Reservation does not match this table.");
    if (partySize > reservation.partySize) fail("Party size exceeds the reservation.");
    if (now < reservation.startAt - POLICIES.earliestCheckInMinutes * MINUTE || now >= reservation.endAt) fail("Reservation is outside its check-in window.");
  } else if (state.reservations.some((r) => r.tableId === table.id && r.status === "reserved" &&
    overlap(now, now + POLICIES.reservationDurationMinutes * MINUTE, r.startAt, r.endAt))) {
    fail("Upcoming reservation conflicts with this seating.");
  }
  const visit = {
    id: id("visit"), tableId: table.id, nickname: nonEmptyName(input.nickname ?? reservation?.nickname),
    partySize, seatedAt: now, completedAt: null, reservationId: reservation?.id || null, status: "seated",
  };
  const reservations = reservation ? state.reservations.map((r) => r.id === reservation.id ? { ...r, status: "checked_in", checkedInAt: now } : r) : state.reservations;
  return log({ ...state, visits: [visit, ...state.visits], reservations }, "seating", `${table.id} seated ${partySize} guest(s)`, now);
}

export function moveGuests(state, visitId, toTableId, now = Date.now()) {
  const visit = visitById(state, visitId);
  if (visit.status !== "seated") fail("Visit is already closed.");
  const target = tableById(state, toTableId);
  if (target.id === visit.tableId) fail("Choose a different table.");
  if (target.capacity < visit.partySize || !isTableFreeForPeriod(state, target.id, now, now + POLICIES.reservationDurationMinutes * MINUTE, now)) fail("Destination table has insufficient seats or is unavailable.");
  const visits = state.visits.map((v) => v.id === visitId ? { ...v, tableId: target.id } : v);
  const orders = state.orders.map((o) => o.visitId === visitId ? { ...o, tableId: target.id } : o);
  return log({ ...state, visits, orders }, "seating", `${visit.tableId} moved to ${target.id}`, now);
}

export function completeVisit(state, visitId, now = Date.now()) {
  const visit = visitById(state, visitId);
  if (visit.status !== "seated") fail("Visit is already completed.");
  const unsettled = state.orders.some((o) => o.visitId === visit.id && o.status !== "cancelled" && o.paymentStatus !== "paid");
  if (unsettled) fail("Record payments for the table's open orders before checkout.");
  const visits = state.visits.map((v) => v.id === visitId ? { ...v, status: "completed", completedAt: now } : v);
  const tables = state.tables.map((t) => t.id === visit.tableId ? { ...t, cleaning: true } : t);
  const reservations = state.reservations.map((r) => r.id === visit.reservationId ? { ...r, status: "completed", completedAt: now } : r);
  return log({ ...state, visits, tables, reservations }, "seating", `${visit.tableId} checked out; cleaning needed`, now);
}

export function setTableCondition(state, tableId, patch, now = Date.now()) {
  tableById(state, tableId);
  if (getOpenVisit(state, tableId)) fail("Check out seated guests before changing the table condition.");
  if (!["cleaning", "unavailable"].includes(patch.field) || typeof patch.value !== "boolean") fail("Invalid table condition.");
  if (patch.value && state.reservations.some((r) => r.tableId === tableId && r.status === "reserved" && r.endAt > now)) fail("Cancel future reservations before taking the table out of service.");
  const tables = state.tables.map((t) => t.id === tableId ? { ...t, [patch.field]: patch.value } : t);
  return log({ ...state, tables }, "table", `${tableId}: ${patch.field} ${patch.value ? "enabled" : "cleared"}`, now);
}

// =======================================================
// DRINK / FOOD PRICING AND INGREDIENT REQUIREMENTS
// =======================================================

export function quoteMenuItem(productId, quantity = 1, options = {}) {
  const product = getMenuItem(productId) || fail("Menu product not found.");
  if (!product.available) fail("This menu item is unavailable.");
  const qty = positiveInt(quantity, "Quantity", 30);
  const profile = getCustomizationProfile(product.customizationProfile);
  const isDrink = product.kind === "drink";
  const allowedTemps = product.allowedTemperatures || profile.temperatures;
  const size = profile.sizes.length ? (options.size || "medium") : null;
  const temperature = allowedTemps.length ? (options.temperature || allowedTemps[0]) : null;
  const milk = profile.milks.length ? (options.milk || "dairy") : null;
  const sweetness = profile.sweetness ? (options.sweetness || "regular") : null;
  const extras = options.extras || [];
  if (size && !profile.sizes.includes(size)) fail("Invalid drink size.");
  if (temperature && !allowedTemps.includes(temperature)) fail("Temperature unavailable for this product.");
  if (milk && !profile.milks.includes(milk)) fail("Milk option unavailable for this product.");
  if (sweetness && !["none", "less", "regular", "extra"].includes(sweetness)) fail("Invalid sweetness option.");
  if (!Array.isArray(extras) || extras.length > 5 || new Set(extras).size !== extras.length || extras.some((e) => !profile.extras.includes(e))) fail("One or more drink extras are not allowed.");
  const sizeOption = DRINK_SIZES.find((s) => s.id === size);
  const milkOption = MILK_OPTIONS.find((m) => m.id === milk);
  const multiplier = sizeOption?.recipeMultiplier || 1;
  const chosenExtras = extras.map((e) => DRINK_EXTRAS.find((x) => x.id === e));
  const unitPrice = money(Math.max(0, product.price + (sizeOption?.priceDelta || 0) + (milkOption?.priceDelta || 0) + chosenExtras.reduce((sum, e) => sum + e.price, 0)));
  const recipe = new Map();
  const add = (ingredientId, n) => recipe.set(ingredientId, (recipe.get(ingredientId) || 0) + n);
  for (const item of product.recipe) {
    const ingredientId = milk && item.ingredientId === "dairy-milk" ? milkOption.inventoryId : item.ingredientId;
    add(ingredientId, item.quantity * (isDrink ? multiplier : 1));
  }
  if (isDrink) {
    for (const p of DRINK_PACKAGING[temperature] || []) add(p.ingredientId, p.quantity * (p.ingredientId === "ice" ? multiplier : 1));
  }
  for (const extra of chosenExtras) for (const i of extra.recipe || []) add(i.ingredientId, i.quantity);
  return {
    productId: product.id, name: product.name, image: product.image, quantity: qty,
    options: { size, temperature, milk, sweetness, extras: [...extras] },
    unitPrice, lineTotal: money(unitPrice * qty),
    ingredients: [...recipe].map(([ingredientId, amount]) => ({ ingredientId, quantity: Math.ceil(amount * qty) })),
  };
}

export function quoteCart(items, promoCode = "") {
  if (!Array.isArray(items) || !items.length) fail("Add at least one item to the order.");
  const lines = items.map((i) => quoteMenuItem(i.productId, i.quantity, i.options || {}));
  const subtotal = money(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const code = String(promoCode || "").trim().toUpperCase();
  const promo = code ? PROMOTIONS.find((p) => p.active && p.code.toUpperCase() === code) : null;
  if (code && !promo) fail("Promotion code is invalid.");
  if (promo && subtotal < promo.minimumSpend) fail(`This offer requires a subtotal of at least ₱${promo.minimumSpend}.`);
  const discount = !promo ? 0 : money(Math.min(subtotal, promo.type === "percentage" ? subtotal * promo.value / 100 : promo.value));
  return { lines, subtotal, discount, total: money(subtotal - discount), promoCode: promo?.code || "" };
}

export function placeOrder(state, input, now = Date.now()) {
  const type = input.type === "pickup" ? "pickup" : input.type === "dinein" ? "dinein" : fail("Select dine-in or pickup.");
  if (type === "pickup" && !POLICIES.allowPickupOrders) fail("Pickup ordering is disabled.");
  if (type === "dinein" && !POLICIES.allowDineInOrders) fail("Dine-in ordering is disabled.");
  let visit = null;
  let tableId = null;
  if (input.tableId) {
    if (type !== "dinein") fail("Pickup orders cannot be assigned to tables.");
    tableById(state, input.tableId);
    visit = getOpenVisit(state, input.tableId);
    if (!visit) fail("Seat guests before assigning an order to this table.");
    tableId = visit.tableId;
  }
  const quote = quoteCart(input.items, input.promoCode);
  const order = {
    id: id("ord"), reference: `CAFE-DEMO-${now.toString(36).toUpperCase()}`,
    type, tableId, visitId: visit?.id || null, nickname: nonEmptyName(input.nickname || visit?.nickname),
    note: String(input.note || "").trim().slice(0, 220),
    ...quote, status: "received", paymentStatus: "unpaid", inventoryDeducted: false,
    createdAt: now, updatedAt: now,
  };
  return log({ ...state, orders: [order, ...state.orders] }, "order", `${order.reference} received`, now);
}

export function updateOrderStatus(state, orderId, nextStatus, now = Date.now()) {
  const order = orderById(state, orderId);
  const allowed = { received: "accepted", accepted: "preparing", preparing: "ready", ready: "completed" };
  if (allowed[order.status] !== nextStatus) fail("Invalid order status transition.");
  let inventory = state.inventory;
  if (nextStatus === "completed" && !order.inventoryDeducted) {
    const required = new Map();
    for (const line of order.lines) for (const ing of line.ingredients) required.set(ing.ingredientId, (required.get(ing.ingredientId) || 0) + ing.quantity);
    inventory = state.inventory.map((stock) => {
      const needed = required.get(stock.id) || 0;
      if (stock.quantity < needed) fail(`Not enough inventory: ${stock.name}.`);
      required.delete(stock.id);
      return { ...stock, quantity: stock.quantity - needed };
    });
    if (required.size) fail(`Missing inventory configuration: ${[...required.keys()].join(", ")}`);
  }
  const orders = state.orders.map((o) => o.id === orderId ? { ...o, status: nextStatus, updatedAt: now,
    inventoryDeducted: nextStatus === "completed" ? true : o.inventoryDeducted } : o);
  return log({ ...state, orders, inventory }, "order", `${order.reference} marked ${nextStatus}`, now);
}

export function cancelOrder(state, orderId, now = Date.now()) {
  const order = orderById(state, orderId);
  if (!["received", "accepted"].includes(order.status) || order.paymentStatus === "paid") fail("Only unpaid orders awaiting preparation can be cancelled.");
  return log({ ...state, orders: state.orders.map((o) => o.id === orderId ? { ...o, status: "cancelled", updatedAt: now } : o) }, "order", `${order.reference} cancelled`, now);
}

export function recordPayment(state, orderId, methodId, now = Date.now()) {
  const order = orderById(state, orderId);
  if (order.status === "cancelled") fail("Cancelled orders cannot be paid.");
  if (order.paymentStatus === "paid") fail("Payment already recorded for this order.");
  if (!PAYMENT_METHODS.some((m) => m.id === methodId)) fail("Choose a supported demo payment method.");
  const transaction = { id: id("tx"), orderId, reference: order.reference, amount: order.total, methodId, at: now, status: "paid" };
  return log({ ...state,
    transactions: [transaction, ...state.transactions],
    orders: state.orders.map((o) => o.id === orderId ? { ...o, paymentStatus: "paid", paidAt: now } : o),
  }, "payment", `${order.reference} paid via ${methodId} (demo)`, now);
}

export function restockInventory(state, ingredientId, amount, now = Date.now()) {
  const qty = positiveInt(amount, "Restock amount", 100000);
  if (!state.inventory.some((i) => i.id === ingredientId)) fail("Ingredient not found.");
  return log({ ...state, inventory: state.inventory.map((i) => i.id === ingredientId ? { ...i, quantity: i.quantity + qty } : i) },
    "inventory", `${ingredientId} restocked by ${qty}`, now);
}

export function getCafeStats(state, now = Date.now()) {
  const statuses = state.tables.map((t) => getTableStatus(state, t.id, now));
  const count = (x) => statuses.filter((s) => s === x).length;
  const today = new Date(now).toDateString();
  const paidToday = state.transactions.filter((t) => t.status === "paid" && new Date(t.at).toDateString() === today);
  const todaysOrders = state.orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const revenue = money(paidToday.reduce((sum, t) => sum + t.amount, 0));
  const occupied = count("occupied");
  return {
    totalTables: state.tables.length, available: count("available"), occupied, reserved: count("reserved"),
    cleaning: count("cleaning"), unavailable: count("unavailable"),
    occupancyPercent: state.tables.length ? Math.round(occupied / state.tables.length * 100) : 0,
    activeOrders: state.orders.filter((o) => !["completed", "cancelled"].includes(o.status)).length,
    received: state.orders.filter((o) => o.status === "received").length,
    preparing: state.orders.filter((o) => o.status === "preparing").length,
    ready: state.orders.filter((o) => o.status === "ready").length,
    todayVisits: state.visits.filter((v) => new Date(v.seatedAt).toDateString() === today).length,
    todayOrders: todaysOrders.length, todayRevenue: revenue,
    averagePaidOrder: paidToday.length ? money(revenue / paidToday.length) : 0,
    lowStock: state.inventory.filter((i) => i.quantity <= i.lowStockAt).length,
  };
}

export function getMemberPoints(state, nickname) {
  const name = nonEmptyName(nickname).toLowerCase();
  return state.orders.filter((o) => o.nickname.toLowerCase() === name && o.paymentStatus === "paid")
    .reduce((sum, o) => sum + Math.floor(o.total / POLICIES.loyaltySpendPerPoint), 0);
}

export function createSampleCafeState(now = Date.now()) {
  let state = createCafeInitialState();
  state = seatGuests(state, { tableId: "T-001", partySize: 2, nickname: "Morning Guests" }, now - 28 * MINUTE);
  state = seatGuests(state, { tableId: "T-006", partySize: 3, nickname: "Weekend Group" }, now - 46 * MINUTE);
  state = placeOrder(state, { type: "dinein", tableId: "T-006", items: [{ productId: "spanish-latte", quantity: 2, options: { temperature: "iced" } }, { productId: "butter-croissant", quantity: 1 }] }, now - 10 * MINUTE);
  return state;
}
