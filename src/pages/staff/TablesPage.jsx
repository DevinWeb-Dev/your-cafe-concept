// YOUR CAFÉ — Batch 6 / interactive café floor operations
// Uses the existing CafeContext and TableFloorMap; no duplicated table state.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Armchair, CheckCircle2, Coffee, CreditCard,
  Eraser, Lock, Plus, RefreshCw, Users,
} from "lucide-react";
import { MENU_ITEMS, PAYMENT_METHODS, TABLE_STATUSES, formatPeso, getSeatingZone } from "../../data/config.js";
import { useCafe } from "../../context/CafeContext.jsx";
import TableFloorMap from "../../components/TableFloorMap.jsx";

export default function TablesPage() {
  const { tables, orders, reservations, stats, actions, now } = useCafe();
  const [selectedId, setSelectedId] = useState("T-001");
  const [partySize, setPartySize] = useState(1);
  const [nickname, setNickname] = useState("");
  const [moveTo, setMoveTo] = useState("");
  const [quickItem, setQuickItem] = useState("cafe-latte");
  const [paymentMethods, setPaymentMethods] = useState({});
  const [message, setMessage] = useState(null);
  const table = tables.find((item) => item.id === selectedId) || tables[0];
  const visit = table?.visit;
  const seatCount = table?.capacity ?? 1;
  const status = TABLE_STATUSES[table?.status] || TABLE_STATUSES.unavailable;
  const tableOrders = useMemo(() => orders.filter((order) => order.visitId === visit?.id), [orders, visit?.id]);
  const openBalance = tableOrders.filter((o) => o.paymentStatus !== "paid" && o.status !== "cancelled");
  const due = openBalance.reduce((total, order) => total + order.total, 0);
  const transferable = tables.filter((t) => t.id !== table?.id && t.status === "available" && t.capacity >= (visit?.partySize || 1));
  const reservation = reservations.find((r) => r.tableId === table?.id && r.status === "reserved" &&
    now >= r.startAt - 15 * 60_000 && now < r.endAt);
  const items = MENU_ITEMS.filter((item) => item.available && item.kind !== "retail");

  function run(action, successMessage) {
    const result = action();
    setMessage({ ok: result.ok, text: result.ok ? successMessage : result.error });
    return result;
  }
  function chooseTable(id) {
    setSelectedId(id);
    setPartySize(1);
    setNickname("");
    setMoveTo("");
    setMessage(null);
  }
  function seat(event) {
    event.preventDefault();
    run(() => actions.seatGuests({ tableId: table.id, nickname, partySize }), `${table.id} now has a seated party.`);
  }
  function checkIn() {
    if (!reservation) return;
    run(() => actions.seatGuests({ tableId: table.id, partySize: reservation.partySize, nickname: reservation.nickname, reservationId: reservation.id }), "Reservation guest checked in.");
  }
  function quickOrder() {
    if (!visit) return;
    run(() => actions.placeOrder({
      type: "dinein", tableId: table.id, nickname: visit.nickname,
      items: [{ productId: quickItem, quantity: 1, options: {} }],
    }), "New demo order sent to the barista queue.");
  }
  function pay(orderId) {
    const method = paymentMethods[orderId] || "cash";
    run(() => actions.recordPayment(orderId, method), "Demo payment recorded.");
  }

  return <section className="yc6-tables">
    <style>{`
      .yc6-tables{min-width:0;color:#33261e}.yc6-tables .yc6-head{display:flex;align-items:end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:25px}
      .yc6-tables .yc6-kicker{font-size:10px;color:#98734f;letter-spacing:.2em;font-weight:700}.yc6-tables h1{font:500 clamp(48px,5vw,70px)/.95 'Cormorant Garamond',Georgia,serif;margin:10px 0}
      .yc6-tables h1 em{color:#ad865d;font-weight:400}.yc6-tables .yc6-muted{color:#8b7d6d;font-size:12px;line-height:1.7}
      .yc6-tables .yc6-overview{display:flex;gap:7px;flex-wrap:wrap;margin:0 0 23px}.yc6-tables .yc6-pill{padding:10px 14px;background:#fffaf3;border:1px solid #e2d7c7;font-size:10px;font-weight:700;color:#725c49}
      .yc6-tables .yc6-grid{display:grid;grid-template-columns:minmax(0,1fr) 355px;gap:23px;align-items:start}.yc6-tables .yc6-sidebar{position:sticky;top:100px;background:#fffaf3;border:1px solid #e4d7c6;padding:26px;min-width:0}
      .yc6-tables .yc6-sidebar-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:18px}.yc6-tables .yc6-sidebar-head h2{font:500 48px 'Cormorant Garamond',Georgia,serif;line-height:1;margin:3px 0}
      .yc6-tables .yc6-status{padding:7px 10px;border:1px solid currentColor;font-size:9px;font-weight:800;letter-spacing:.04em;white-space:nowrap}
      .yc6-tables .yc6-form{display:grid;gap:14px}.yc6-tables .yc6-field{display:grid;gap:7px;min-width:0}.yc6-tables .yc6-field span{color:#836949;font-size:10px;font-weight:800;letter-spacing:.06em}
      .yc6-tables input,.yc6-tables select{padding:12px;border:1px solid #dac9b6;min-width:0;width:100%;background:#faf5ed;color:#302824;font-size:12px}
      .yc6-tables .yc6-action{background:#3a2922;color:#fff;border:0;min-height:44px;padding:12px;display:flex;align-items:center;justify-content:center;gap:8px;font-size:11px;font-weight:700;width:100%}
      .yc6-tables .yc6-action.secondary{background:transparent;border:1px solid #bca589;color:#6d5039}.yc6-tables .yc6-action.danger{background:#a45f4e}
      .yc6-tables .yc6-action:disabled{opacity:.45}.yc6-tables .yc6-note{font-size:11px;line-height:1.7;color:#897763}
      .yc6-tables .yc6-section{border-top:1px solid #e9dccc;margin-top:20px;padding-top:19px}.yc6-tables .yc6-section h3{font:500 27px 'Cormorant Garamond',Georgia,serif;margin:0 0 14px}
      .yc6-tables .yc6-details{display:grid;gap:12px}.yc6-tables .yc6-detail{display:flex;justify-content:space-between;gap:10px;font-size:12px}.yc6-tables .yc6-detail span{color:#8f7c67}.yc6-tables .yc6-detail strong{text-align:right;overflow-wrap:anywhere}
      .yc6-tables .yc6-message{background:#f9e9e2;border-left:3px solid #b96254;padding:14px;margin:18px 0;font-size:11px;line-height:1.6;color:#6f4139}.yc6-tables .yc6-message.ok{background:#eaf0e6;border-color:#66816a;color:#456149}
      .yc6-tables .yc6-order{border:1px solid #e4d8c9;padding:13px;margin:9px 0;background:#faf5ed;display:grid;gap:9px;font-size:11px}
      .yc6-tables .yc6-order-row{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}.yc6-tables .yc6-order b{overflow-wrap:anywhere}
      .yc6-tables .yc6-order select{max-width:155px}.yc6-tables .yc6-order button{border:1px solid #92734f;color:#63432d;background:#fffaf4;padding:10px;font-size:10px;font-weight:700}
      .yc6-tables .yc6-link{display:inline-flex;align-items:center;gap:7px;color:#775434;font-weight:700;font-size:11px;margin-top:13px}
      @media(max-width:1160px){.yc6-tables .yc6-grid{grid-template-columns:1fr}.yc6-tables .yc6-sidebar{position:static}}
      @media(max-width:570px){.yc6-tables .yc6-sidebar{padding:17px}.yc6-tables .yc6-overview{gap:6px}.yc6-tables .yc6-pill{padding:9px}}
    `}</style>
    <div className="yc6-head"><div><span className="yc6-kicker">INTERACTIVE SEATING · LOCAL DEMO</span><h1>The café <em>floor.</em></h1><p className="yc6-muted">Select a table to seat guests, manage dining orders and prepare it for the next visit.</p></div><Armchair size={35} color="#94704c" strokeWidth={1.4}/></div>
    <div className="yc6-overview"><span className="yc6-pill">{stats.totalTables} TOTAL</span><span className="yc6-pill">{stats.available} AVAILABLE</span><span className="yc6-pill">{stats.occupied} OCCUPIED</span><span className="yc6-pill">{stats.reserved} RESERVED</span><span className="yc6-pill">{stats.cleaning} CLEANING</span></div>
    <div className="yc6-grid">
      <TableFloorMap selectedTableId={table?.id} onSelect={chooseTable}/>
      {table && <aside className="yc6-sidebar">
        <div className="yc6-sidebar-head"><div><span className="yc6-kicker">TABLE CONTROL</span><h2>{table.id}</h2><span className="yc6-muted">{getSeatingZone(table.zoneId)?.name} · {table.capacity} seats</span></div><span className="yc6-status" style={{color:status.color}}>{status.label}</span></div>
        {message && <div role="status" className={`yc6-message ${message.ok ? "ok" : ""}`}>{message.text}</div>}
        {visit ? <>
          <div className="yc6-details"><div className="yc6-detail"><span>Guest</span><strong>{visit.nickname}</strong></div><div className="yc6-detail"><span>Party size</span><strong>{visit.partySize}</strong></div><div className="yc6-detail"><span>Time seated</span><strong>{table.elapsedLabel}</strong></div><div className="yc6-detail"><span>Open balance</span><strong>{formatPeso(due)}</strong></div></div>
          <div className="yc6-section"><h3>Add an order</h3><label className="yc6-field"><span>QUICK ADD ITEM</span><select value={quickItem} onChange={(e) => setQuickItem(e.target.value)}>{items.map((i) => <option value={i.id} key={i.id}>{i.name} · {formatPeso(i.price)}</option>)}</select></label>
            <button type="button" className="yc6-action" style={{marginTop:11}} onClick={quickOrder}><Plus size={16}/> Add to Barista Queue</button><Link className="yc6-link" to="/staff/orders">See all orders <ArrowRight size={14}/></Link></div>
          <div className="yc6-section"><h3>Table orders ({tableOrders.length})</h3>
            {!tableOrders.length && <p className="yc6-note">No orders recorded for this visit yet.</p>}
            {tableOrders.map((o) => <div className="yc6-order" key={o.id}><div className="yc6-order-row"><b>{o.reference}</b><b>{formatPeso(o.total)}</b></div>
              <div className="yc6-order-row"><span>{o.status.toUpperCase()}</span><span>{o.paymentStatus === "paid" ? "PAID (DEMO)" : "UNPAID"}</span></div>
              {o.paymentStatus !== "paid" && o.status !== "cancelled" && <><select value={paymentMethods[o.id] || "cash"} onChange={(e) => setPaymentMethods((p)=>({...p,[o.id]:e.target.value}))}>{PAYMENT_METHODS.map((m)=><option key={m.id} value={m.id}>{m.name}</option>)}</select>
                <button onClick={() => pay(o.id)} type="button"><CreditCard size={14}/> Record Demo Payment</button></>}
            </div>)}
          </div>
          <div className="yc6-section"><h3>Change table</h3><label className="yc6-field"><span>TRANSFER TO AVAILABLE TABLE</span><select value={moveTo} onChange={(e)=>setMoveTo(e.target.value)}><option value="">Choose destination</option>{transferable.map((t)=><option key={t.id} value={t.id}>{t.id} · {t.capacity} seats</option>)}</select></label>
            <button className="yc6-action secondary" type="button" style={{marginTop:10}} disabled={!moveTo} onClick={() => { if(run(()=>actions.moveGuests(visit.id, moveTo),"Party transferred successfully.").ok) chooseTable(moveTo); }}><ArrowRight size={16}/> Transfer Guests</button></div>
          <div className="yc6-section"><button className="yc6-action danger" type="button" onClick={()=>run(()=>actions.completeVisit(visit.id),"Visit completed. Table now needs cleaning.")}><CheckCircle2 size={16}/> Checkout Guests</button>
            {due > 0 && <p className="yc6-note">Collect demo payments above before checking out. Outstanding balance: {formatPeso(due)}.</p>}
          </div>
        </> : table.cleaning ? <><p className="yc6-note">This table has been checked out and awaits cleaning.</p><button type="button" className="yc6-action" onClick={()=>run(()=>actions.setTableCondition(table.id,"cleaning",false),"Table available after cleaning.")}><Eraser size={16}/> Mark Cleaning Complete</button></>
          : table.unavailable ? <><p className="yc6-note">This table is currently marked unavailable.</p><button className="yc6-action" type="button" onClick={()=>run(()=>actions.setTableCondition(table.id,"unavailable",false),"Table returned to service.")}><RefreshCw size={16}/> Return to Service</button></>
          : <>
            {reservation ? <div className="yc6-section"><h3>Expected guests</h3><p className="yc6-note">{reservation.nickname} · {reservation.partySize} guests · {new Date(reservation.startAt).toLocaleTimeString("en-PH",{hour:"numeric",minute:"2-digit"})}</p><button type="button" className="yc6-action" onClick={checkIn}><CheckCircle2 size={16}/> Check In Reservation</button></div> : null}
            <form className="yc6-form yc6-section" onSubmit={seat}><h3>Seat walk-in guests</h3><label className="yc6-field"><span>GUEST NICKNAME</span><input value={nickname} maxLength={40} onChange={(e)=>setNickname(e.target.value)} placeholder="Café Guest"/></label>
              <label className="yc6-field"><span>PARTY SIZE</span><select value={Math.min(partySize,seatCount)} onChange={(e)=>setPartySize(Number(e.target.value))}>{Array.from({length:seatCount},(_,i)=><option key={i+1} value={i+1}>{i+1} {i===0?"guest":"guests"}</option>)}</select></label>
              <button type="submit" className="yc6-action" disabled={table.status !== "available"}><Users size={16}/> Seat Guests</button></form>
            <div className="yc6-section"><button className="yc6-action secondary" type="button" onClick={()=>run(()=>actions.setTableCondition(table.id,"unavailable",true),"Table taken out of service.")}><Lock size={15}/> Mark Unavailable</button></div>
          </>}
        <p className="yc6-note" style={{marginTop:20}}><Coffee size={15} style={{verticalAlign:"middle"}}/> Frontend-only café management demo. No actual reservations, charges or real table changes.</p>
      </aside>}
    </div>
  </section>;
}
