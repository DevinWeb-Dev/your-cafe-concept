import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  CAFE_STORAGE_KEY, createCafeInitialState, loadCafeState, saveCafeState,
  createSampleCafeState, getCafeStats, getTableStatus, getOpenVisit,
  getElapsedMs, formatElapsed, quoteMenuItem, quoteCart,
  reserveTable, cancelReservation, seatGuests, moveGuests, completeVisit,
  setTableCondition, placeOrder, updateOrderStatus, cancelOrder,
  recordPayment, restockInventory, getMemberPoints,
} from "../engine/cafeEngine.js";

const CafeContext = createContext(null);
const CART_KEY = "your-cafe-concept-cart-v1";
const readCart = () => {
  try { const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); return Array.isArray(data) ? data : []; }
  catch { return []; }
};

export function CafeProvider({ children }) {
  const [state, setState] = useState(loadCafeState);
  const stateRef = useRef(state);
  const [cart, setCart] = useState(readCart);
  const [now, setNow] = useState(Date.now);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("focus", tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("focus", tick);
    };
  }, []);

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
    catch { /* localStorage may be blocked */ }
  }, [cart]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === CAFE_STORAGE_KEY || event.key === null) {
        const incoming = loadCafeState();
        stateRef.current = incoming;
        setState(incoming);
      }
      if (event.key === CART_KEY) setCart(readCart());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((operation, successMessage) => {
    try {
      const next = operation(stateRef.current, Date.now());
      if (!next || !Array.isArray(next.orders) || !Array.isArray(next.tables)) throw new Error("Invalid café state returned.");
      stateRef.current = next;
      setState(next);
      setNow(Date.now());
      const saved = saveCafeState(next);
      setNotice({ type: saved ? "success" : "warning", text: saved ? successMessage : "Changes worked, but browser storage could not save them." });
      return { ok: true, state: next, saved };
    } catch (error) {
      const text = error?.message || "This action could not be completed.";
      setNotice({ type: "error", text });
      return { ok: false, error: text };
    }
  }, []);

  const actions = useMemo(() => ({
    reserveTable: (data) => commit((s, now) => reserveTable(s, data, now), "Demo table reservation confirmed."),
    cancelReservation: (id) => commit((s, now) => cancelReservation(s, id, now), "Reservation cancelled."),
    seatGuests: (data) => commit((s, now) => seatGuests(s, data, now), "Guests seated successfully."),
    moveGuests: (visitId, toTableId) => commit((s, now) => moveGuests(s, visitId, toTableId, now), "Guests moved to a new table."),
    completeVisit: (visitId) => commit((s, now) => completeVisit(s, visitId, now), "Guests checked out. Table requires cleaning."),
    setTableCondition: (tableId, field, value) => commit((s, now) => setTableCondition(s, tableId, { field, value }, now), "Table status updated."),
    placeOrder: (data) => commit((s, now) => placeOrder(s, data, now), "Demo order placed successfully."),
    updateOrderStatus: (id, status) => commit((s, now) => updateOrderStatus(s, id, status, now), `Order marked ${status}.`),
    cancelOrder: (id) => commit((s, now) => cancelOrder(s, id, now), "Order cancelled."),
    recordPayment: (id, method) => commit((s, now) => recordPayment(s, id, method, now), "Demo payment recorded."),
    restockInventory: (id, amount) => commit((s, now) => restockInventory(s, id, amount, now), "Inventory replenished."),
    loadSampleData: () => commit((s, now) => {
      if (s.visits.length || s.orders.length || s.reservations.length || s.transactions.length) throw new Error("Reset existing data before loading the sample café day.");
      return createSampleCafeState(now);
    }, "Sample café activity loaded."),
    resetDemoData: (confirmed = false) => commit(() => {
      if (!confirmed) throw new Error("Confirm before clearing all demonstration records.");
      return createCafeInitialState();
    }, "All demo records were cleared."),
  }), [commit]);

  const cartActions = useMemo(() => ({
    add(productId, quantity = 1, options = {}) {
      try {
        const line = quoteMenuItem(productId, quantity, options);
        const key = JSON.stringify([productId, line.options]);
        setCart((previous) => {
          const found = previous.find((item) => item.key === key);
          if (found) return previous.map((item) => item.key === key ? { ...item, quantity: Math.min(30, item.quantity + line.quantity) } : item);
          return [...previous, { key, productId, quantity: line.quantity, options: line.options }];
        });
        setNotice({ type: "success", text: `${line.name} added to your demo cart.` });
        return { ok: true };
      } catch (error) {
        setNotice({ type: "error", text: error.message });
        return { ok: false, error: error.message };
      }
    },
    quantity(key, quantity) {
      const n = Number(quantity);
      if (!Number.isInteger(n) || n < 0 || n > 30) return;
      setCart((items) => n === 0 ? items.filter((item) => item.key !== key) : items.map((item) => item.key === key ? { ...item, quantity: n } : item));
    },
    remove(key) { setCart((items) => items.filter((item) => item.key !== key)); },
    clear() { setCart([]); },
  }), []);

  const tables = useMemo(() => state.tables.map((table) => {
    const visit = getOpenVisit(state, table.id);
    return { ...table, status: getTableStatus(state, table.id, now), visit,
      elapsedMs: visit ? getElapsedMs(visit, now) : 0,
      elapsedLabel: visit ? formatElapsed(getElapsedMs(visit, now)) : "00:00:00" };
  }), [state, now]);

  const stats = useMemo(() => getCafeStats(state, now), [state, now]);
  const cartCount = useMemo(() => cart.reduce((n, item) => n + item.quantity, 0), [cart]);
  const cartPreview = useMemo(() => {
    if (!cart.length) return { lines: [], subtotal: 0, discount: 0, total: 0 };
    try { return quoteCart(cart); }
    catch { return { lines: [], subtotal: 0, discount: 0, total: 0 }; }
  }, [cart]);

  const placeCartOrder = useCallback((input) => {
    if (!cart.length) return { ok: false, error: "Your cart is empty." };
    const result = actions.placeOrder({ ...input, items: cart });
    if (result.ok) cartActions.clear();
    return result;
  }, [actions, cart, cartActions]);

  const value = useMemo(() => ({
    state, now, tables, stats,
    visits: state.visits, reservations: state.reservations,
    orders: state.orders, inventory: state.inventory,
    transactions: state.transactions, events: state.events,
    cart, cartCount, cartPreview, cartActions, placeCartOrder,
    actions, notice, clearNotice: () => setNotice(null),
    getMemberPoints: (name) => getMemberPoints(state, name),
  }), [state, now, tables, stats, cart, cartCount, cartPreview, cartActions, placeCartOrder, actions, notice]);

  return <CafeContext.Provider value={value}>{children}</CafeContext.Provider>;
}

export function useCafe() {
  const value = useContext(CafeContext);
  if (!value) throw new Error("useCafe must be used inside <CafeProvider>.");
  return value;
}
