// YOUR CAFÉ — Staff Reservations / Batch 7
// Local demonstration only. Real booking requires a backend.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, Search, Users, Check, X, ArrowUpRight, CalendarCheck2 } from "lucide-react";
import { POLICIES, formatPeso, getSeatingZone } from "../../data/config.js";
import { useCafe } from "../../context/CafeContext.jsx";

const formatDateTime = (time) => new Date(time).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });
const formatDay = (time) => new Date(time).toLocaleDateString("en-PH", { year: "numeric", month: "2-digit", day: "2-digit" });
const dateInput = (time) => {
  const d = new Date(time);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const STATUS = { reserved: "Upcoming", checked_in: "Checked in", completed: "Completed", cancelled: "Cancelled" };

const css = `
.yc7-res{display:grid;gap:25px;min-width:0;color:#34261e}.yc7-res *{box-sizing:border-box}
.yc7-res-head{display:flex;align-items:end;justify-content:space-between;flex-wrap:wrap;gap:18px}.yc7-kicker{font-size:10px;letter-spacing:.17em;font-weight:800;color:#a67d56;margin:0 0 9px}.yc7-res h1{font:600 clamp(43px,5.5vw,68px)/.94 'Cormorant Garamond',serif;margin:0}.yc7-res-head p:last-child{color:#867362;font-size:12px;line-height:1.7;margin:12px 0 0}.yc7-res-cta{background:#3c2c23;color:#fff!important;padding:13px 18px;display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:700}
.yc7-res-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}.yc7-res-stat{background:#fffaf3;border:1px solid #e6d9c8;padding:19px;min-width:0}.yc7-res-stat span{font-size:10px;color:#927d68}.yc7-res-stat strong{display:block;font:600 40px/.95 'Cormorant Garamond',serif;margin-top:7px}
.yc7-res-panel{border:1px solid #e5d7c6;background:#fffaf3;min-width:0}.yc7-res-filter{display:grid;grid-template-columns:minmax(0,1.5fr) repeat(2,minmax(130px,1fr)) auto;gap:12px;padding:18px;border-bottom:1px solid #e7dace}.yc7-res-filter label{display:flex;flex-direction:column;gap:6px;font-size:9px;font-weight:800;letter-spacing:.09em;color:#8d755d}.yc7-res-filter input,.yc7-res-filter select{width:100%;min-height:42px;border:1px solid #e0d1bf;background:#fff;color:#382b21;padding:10px;font-size:12px}.yc7-res-filter button{border:1px solid #d8c5af;background:transparent;padding:0 12px;align-self:end;min-height:42px;color:#71563d}
.yc7-res-list{padding:13px;display:grid;gap:10px}.yc7-res-card{border:1px solid #ecdfcf;background:#fff;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(145px,.9fr) auto;gap:18px;padding:18px;align-items:center;min-width:0}.yc7-res-card h3{font-size:15px;margin:8px 0 4px;overflow-wrap:anywhere}.yc7-res-card small{font-size:10px;color:#907a64;overflow-wrap:anywhere}.yc7-res-card p{font-size:11px;line-height:1.6;margin:5px 0}.yc7-res-code{font-size:9px;font-weight:800;color:#a3815a;letter-spacing:.07em;overflow-wrap:anywhere}.yc7-res-status{font-size:9px;font-weight:800;padding:6px 9px;display:inline-block;background:#f5ecde;color:#86633c}.yc7-res-status.checked_in,.yc7-res-status.completed{background:#ecf1e8;color:#54724f}.yc7-res-status.cancelled{background:#f8e8e2;color:#ad594b}.yc7-res-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:flex-end}.yc7-res-actions button{border:1px solid #ddcbb9;background:#fff;padding:11px 12px;font-size:10px;display:flex;align-items:center;gap:7px;color:#6f5239}.yc7-res-actions button.primary{background:#3c2c23;color:#fff;border-color:#3c2c23}.yc7-res-actions button:disabled{opacity:.4;cursor:not-allowed}.yc7-res-help,.yc7-res-msg{font-size:11px;line-height:1.8;padding:14px 18px;background:#f0e7db;color:#795f45}.yc7-res-msg{background:#ebf2e8;color:#47674b}.yc7-res-msg.error{background:#faeae6;color:#9f4d40}.yc7-res-empty{padding:55px 15px;text-align:center;color:#8a7561}.yc7-res-empty h3{font:500 34px 'Cormorant Garamond',serif;color:#3d2e23;margin:10px 0}.yc7-res-empty p{font-size:12px}
@media(max-width:1100px){.yc7-res-card{grid-template-columns:1fr 1fr}.yc7-res-actions{grid-column:1/-1;justify-content:flex-start}}
@media(max-width:720px){.yc7-res-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.yc7-res-filter{grid-template-columns:1fr 1fr}.yc7-res-filter label:first-child{grid-column:1/-1}.yc7-res-card{grid-template-columns:1fr}.yc7-res-actions{grid-column:auto}}
@media(max-width:390px){.yc7-res-filter{grid-template-columns:1fr}.yc7-res-filter label:first-child{grid-column:auto}}
`;

export default function ReservationsPage() {
  const { reservations, tables, actions, now } = useCafe();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [message, setMessage] = useState(null);
  const list = useMemo(() => [...reservations].filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesDay = !dateFilter || dateInput(r.startAt) === dateFilter;
    const haystack = `${r.reference} ${r.nickname} ${r.tableId}`.toLowerCase();
    return matchesStatus && matchesDay && haystack.includes(search.trim().toLowerCase());
  }).sort((a,b) => (a.status === "reserved" ? -1 : 0) - (b.status === "reserved" ? -1 : 0) || a.startAt - b.startAt), [reservations, search, statusFilter, dateFilter]);
  const active = reservations.filter((r) => r.status === "reserved");
  const metrics = [
    ["TOTAL BOOKINGS", reservations.length],
    ["UPCOMING", active.filter((r) => r.startAt >= now).length],
    ["CHECKED IN", reservations.filter((r) => r.status === "checked_in").length],
    ["CANCELLED", reservations.filter((r) => r.status === "cancelled").length],
  ];
  const canCheckIn = (r) => r.status === "reserved" && now >= r.startAt - POLICIES.earliestCheckInMinutes * 60_000 && now < r.endAt;
  const run = (action, successText) => {
    const result = action();
    setMessage({ error: !result.ok, text: result.ok ? successText : result.error });
  };
  const checkIn = (r) => run(() => actions.seatGuests({ tableId: r.tableId, reservationId: r.id, nickname: r.nickname, partySize: r.partySize }), `${r.nickname} checked in at ${r.tableId}.`);
  const cancel = (r) => {
    if (!window.confirm(`Cancel reservation ${r.reference}? This cannot be undone.`)) return;
    run(() => actions.cancelReservation(r.id), `${r.reference} cancelled.`);
  };
  return <section className="yc7-res">
    <style>{css}</style>
    <header className="yc7-res-head"><div><p className="yc7-kicker">GUEST EXPERIENCE · RESERVATION DESK</p><h1>Reservations, beautifully handled.</h1><p>Manage locally simulated bookings and welcome guests at the right table.</p></div><Link className="yc7-res-cta" to="/reserve">Customer booking page <ArrowUpRight size={15}/></Link></header>
    <div className="yc7-res-stats">{metrics.map(([name,number]) => <div className="yc7-res-stat" key={name}><span>{name}</span><strong>{number}</strong></div>)}</div>
    <div className="yc7-res-panel">
      <div className="yc7-res-filter">
        <label>SEARCH BOOKING<input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Guest, table, or reference" /></label>
        <label>STATUS<select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}><option value="all">All statuses</option>{Object.entries(STATUS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
        <label>RESERVATION DATE<input type="date" value={dateFilter} onChange={(e)=>setDateFilter(e.target.value)}/></label>
        <button type="button" onClick={()=>{setSearch("");setStatusFilter("all");setDateFilter("");}}>Clear</button>
      </div>
      {message && <div className={`yc7-res-msg ${message.error ? "error" : ""}`} role={message.error ? "alert" : "status"}>{message.text}</div>}
      <div className="yc7-res-list">
        {list.length === 0 && <div className="yc7-res-empty"><CalendarDays size={31}/><h3>No matching bookings</h3><p>Try clearing filters or make a demo booking from the customer website.</p></div>}
        {list.map((r) => {
          const table = tables.find((t)=>t.id===r.tableId);
          const zoneName = getSeatingZone(table?.zoneId)?.name || "Café seating";
          return <article className="yc7-res-card" key={r.id}>
            <div><span className="yc7-res-code">{r.reference}</span><h3>{r.nickname}</h3><small><Users size={12} style={{verticalAlign:"middle"}}/> {r.partySize} guest(s) · {r.tableId} · {zoneName}</small><p><span className={`yc7-res-status ${r.status}`}>{STATUS[r.status] || r.status}</span></p></div>
            <div><p><CalendarDays size={14} style={{verticalAlign:"middle"}}/> {formatDateTime(r.startAt)}</p><small><Clock3 size={12} style={{verticalAlign:"middle"}}/> {r.durationMinutes} minute reservation · Table seats {table?.capacity || "—"}</small></div>
            <div className="yc7-res-actions">{r.status === "reserved" && <><button className="primary" type="button" disabled={!canCheckIn(r)} title={!canCheckIn(r) ? "Check-in opens 15 minutes before the reservation and closes at its end" : "Check in guest"} onClick={()=>checkIn(r)}><Check size={14}/> Check in</button><button type="button" onClick={()=>cancel(r)}><X size={14}/> Cancel</button></>}{r.status !== "reserved" && <span className="yc7-res-status">{STATUS[r.status] || r.status}</span>}</div>
          </article>;
        })}
      </div>
      <p className="yc7-res-help"><CalendarCheck2 size={14} style={{verticalAlign:"middle"}}/> Check-in opens {POLICIES.earliestCheckInMinutes} minutes before the reserved start time. Reservations made in this prototype stay in this browser, not a live booking service. Prices such as {formatPeso(0)} are only demonstration values.</p>
    </div>
  </section>;
}
