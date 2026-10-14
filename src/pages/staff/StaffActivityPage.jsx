// YOUR CAFÉ — Batch 11 / Staff Activity
// Read-only engine event log; not an authenticated employee audit log.
import { useMemo, useState } from "react";
import { Activity, Download, Filter, RefreshCw, Search, Clock, Shield } from "lucide-react";
import { useCafe } from "../../context/CafeContext.jsx";

const formatDate = (t) => new Date(t).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });
const cell = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
function exportEvents(rows) {
  const content = "\ufeff" + [["Timestamp", "Event type", "Description"], ...rows.map((e) => [formatDate(e.at), e.type, e.text])].map((r) => r.map(cell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = "your-cafe-activity-demo.csv";
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const labels = { order: "ORDER", payment: "PAYMENT", reservation: "RESERVATION", seating: "SEATING", inventory: "STOCK", table: "TABLE" };
const styles = `
.yc11-activity{min-width:0;display:grid;gap:20px;color:#35271d}.yc11-activity *{box-sizing:border-box}.yc11-activity header{display:flex;align-items:flex-end;justify-content:space-between;gap:15px;flex-wrap:wrap}
.yc11-activity .overline{color:#a07c54;letter-spacing:.19em;font-size:10px;font-weight:800}.yc11-activity h1{font:500 clamp(42px,5vw,67px)/1 'Cormorant Garamond',Georgia,serif;margin:8px 0}.yc11-activity p{font-size:12px;color:#85705d;line-height:1.7;margin:5px 0}
.yc11-activity .button{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#3c2b20;border:1px solid #3c2b20;padding:12px 16px;min-height:43px;color:#fff8ef;font-size:11px;font-weight:800;cursor:pointer}.yc11-activity .button.light{background:#fff9f2;border-color:#dcc7ae;color:#674d35}
.yc11-activity .metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.yc11-activity .metric{background:#fffaf3;border:1px solid #e6d6c4;padding:18px}.yc11-activity .metric small{display:block;font-size:10px;color:#95775d}.yc11-activity .metric strong{display:block;font:500 36px 'Cormorant Garamond',Georgia,serif;margin-top:4px}
.yc11-activity .filters{background:#fffbf5;border:1px solid #e6d7c4;padding:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center}.yc11-activity input,.yc11-activity select{border:1px solid #dbc9b6;padding:12px 13px;background:#fffdf8;color:#3e2d22;font-size:12px;min-width:0}.yc11-activity .filters input{flex:1;min-width:185px}.yc11-activity .filters select{max-width:220px}
.yc11-activity .panel{padding:22px;background:#fffbf6;border:1px solid #e6d5c1}.yc11-activity .row{display:grid;grid-template-columns:54px minmax(0,1fr) auto;gap:14px;align-items:start;padding:17px 0;border-bottom:1px solid #e9dbca}.yc11-activity .row:last-child{border-bottom:0}.yc11-activity .symbol{width:44px;height:44px;background:#eae0d1;border-radius:50%;display:grid;place-items:center;color:#725a40}.yc11-activity .row strong{font-size:12px;line-height:1.65;display:block;overflow-wrap:anywhere}.yc11-activity .row small{display:block;margin-top:7px;color:#917966;font-size:10px}.yc11-activity .tag{padding:5px 8px;background:#eee4d7;font-size:9px;color:#755c45;letter-spacing:.06em;white-space:nowrap;font-weight:800}.yc11-activity .empty{padding:25px;font-size:12px;color:#876e57;text-align:center}
.yc11-activity .caution{border-left:3px solid #b18a65;background:#f1eadf;padding:14px 17px;font-size:11px;line-height:1.7;color:#76614d}
@media(max-width:680px){.yc11-activity .metrics{grid-template-columns:1fr}.yc11-activity .filters input,.yc11-activity .filters select{width:100%;max-width:none}.yc11-activity .filters>svg{display:none}.yc11-activity .row{grid-template-columns:38px minmax(0,1fr)}.yc11-activity .symbol{width:34px;height:34px}.yc11-activity .tag{grid-column:2;justify-self:start}}
`;
export default function StaffActivityPage() {
  const { events } = useCafe();
  const [type, setType] = useState("all");
  const [range, setRange] = useState("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(30);
  const types = useMemo(() => [...new Set(events.map((e) => e.type))].sort(), [events]);
  const filtered = useMemo(() => {
    const now = Date.now();
    const maxAge = range === "today" ? 24 * 60 * 60 * 1000 : range === "week" ? 7 * 24 * 60 * 60 * 1000 : Infinity;
    return events.filter((e) => (type === "all" || e.type === type) &&
      String(e.text || "").toLowerCase().includes(query.toLowerCase()) &&
      now - Number(e.at || 0) <= maxAge).sort((a, b) => b.at - a.at);
  }, [events, type, range, query]);
  const latest = events[0];
  return <section className="yc11-activity"><style>{styles}</style>
    <header><div><span className="overline">STAFF WORKSPACE / OPERATIONS LOG</span><h1>Every movement, recorded.</h1><p>Read actions registered by the local café engine, from reservations to payments and stock.</p></div><button className="button" type="button" onClick={() => exportEvents(filtered)}><Download size={16}/> Export filtered activity</button></header>
    <div className="caution"><Shield size={15} style={{verticalAlign:"middle",marginRight:8}}/><strong>Prototype event history—not an employee audit log.</strong> No staff authentication or user attribution exists. The engine retains only the most recent 150 events; a reset erases them. Do not use this as a compliance/security audit trail.</div>
    <div className="metrics"><div className="metric"><small>Events retained</small><strong>{events.length}</strong></div><div className="metric"><small>Filtered results</small><strong>{filtered.length}</strong></div><div className="metric"><small>Event categories</small><strong>{types.length}</strong></div></div>
    <div className="filters"><Search size={17}/><input aria-label="Search events" value={query} onChange={(e) => { setQuery(e.target.value); setLimit(30); }} placeholder="Search activity, reference or table..."/><Filter size={16}/><select aria-label="Event type" value={type} onChange={(e) => { setType(e.target.value); setLimit(30); }}><option value="all">Every activity type</option>{types.map((t) => <option value={t} key={t}>{labels[t] || t}</option>)}</select><select aria-label="Time range" value={range} onChange={(e) => { setRange(e.target.value); setLimit(30); }}><option value="all">All retained activity</option><option value="today">Last 24 hours</option><option value="week">Last 7 days</option></select><button className="button light" type="button" onClick={() => { setType("all"); setRange("all"); setQuery(""); setLimit(30); }}><RefreshCw size={14}/> Clear</button></div>
    <div className="panel"><span className="overline"><Activity size={14} style={{verticalAlign:"middle"}}/> ACTIVITY FEED</span>{filtered.length === 0 ? <div className="empty">No matching activity. Try processing a sample order, checking in a guest, or restocking an ingredient.</div> : filtered.slice(0, limit).map((e) => <article className="row" key={e.id}><div className="symbol"><Clock size={19}/></div><div><strong>{e.text}</strong><small>{formatDate(e.at)} · {e.type || "event"}</small></div><span className="tag">{labels[e.type] || String(e.type).toUpperCase()}</span></article>)}{limit < filtered.length && <div style={{textAlign:"center",paddingTop:17}}><button className="button light" type="button" onClick={() => setLimit((n) => n + 30)}>Load more ({filtered.length - limit} remaining)</button></div>}</div>
    <p>Latest recorded activity: {latest ? `${latest.text} · ${formatDate(latest.at)}` : "None yet."} Changes from a second tab on the same browser may appear after storage synchronization.</p>
  </section>;
}
