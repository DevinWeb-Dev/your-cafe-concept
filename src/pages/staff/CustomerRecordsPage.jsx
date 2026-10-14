// YOUR CAFÉ — Batch 11 / Staff Customer Records
// Read-only aggregates of nickname-based demo visits and purchases.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Search, ShoppingBag, Users, Coffee } from "lucide-react";
import { formatPeso } from "../../data/config.js";
import { useCafe } from "../../context/CafeContext.jsx";

const csv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
function exportCsv(rows) {
  const content = "\ufeff" + rows.map((r) => r.map(csv).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = "your-cafe-customer-demo-summary.csv";
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const date = (time) => time ? new Date(time).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" }) : "—";
const keyFor = (v) => String(v || "Café Guest").trim().toLocaleLowerCase("en");
const styles = `
.yc11-customers{display:grid;gap:19px;min-width:0;color:#362920}.yc11-customers *{box-sizing:border-box}
.yc11-customers header{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;flex-wrap:wrap}
.yc11-customers .overline{font-size:10px;letter-spacing:.18em;color:#a17c52;font-weight:800}
.yc11-customers h1{font:500 clamp(43px,5vw,67px)/1 'Cormorant Garamond',Georgia,serif;margin:8px 0}.yc11-customers p{color:#847360;font-size:12px;line-height:1.7;margin:5px 0}
.yc11-customers button,.yc11-customers input,.yc11-customers select{font:inherit}
.yc11-customers .btn{padding:12px 16px;border:1px solid #4a3528;background:#3f2e23;color:#fdf4e7;display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:800;cursor:pointer}.yc11-customers .btn.light{background:#fffaf4;color:#664f3b;border-color:#d9c5ac}
.yc11-customers .metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.yc11-customers .metric{background:#fffbf5;border:1px solid #e7d7c3;padding:17px}.yc11-customers .metric span{display:block;font-size:10px;color:#967c62}.yc11-customers .metric strong{font:500 33px 'Cormorant Garamond',Georgia,serif;display:block;margin-top:5px}
.yc11-customers .toolbar{display:flex;align-items:center;gap:11px;flex-wrap:wrap;background:#fffaf3;border:1px solid #e3d4c1;padding:14px}.yc11-customers input,.yc11-customers select{min-width:0;padding:12px;background:#fffdf8;border:1px solid #dcc9b2;font-size:12px;color:#3c2b21}.yc11-customers .toolbar input{flex:1;min-width:190px}
.yc11-customers .grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(285px,.8fr);gap:17px;align-items:start}.yc11-customers .list{display:grid;gap:9px;min-width:0}.yc11-customers .person{background:#fffaf3;border:1px solid #e4d4bf;display:flex;justify-content:space-between;gap:14px;align-items:center;padding:17px;text-align:left;color:inherit;cursor:pointer}.yc11-customers .person.active{border-color:#94704c;box-shadow:inset 0 0 0 1px #94704c}.yc11-customers .avatar{width:40px;height:40px;border-radius:50%;background:#e9d4b7;color:#60462d;display:grid;place-items:center;font:500 24px 'Cormorant Garamond',serif;flex:none}.yc11-customers .identity{display:flex;gap:12px;align-items:center;min-width:0}.yc11-customers .person strong{display:block;font-size:12px;overflow-wrap:anywhere}.yc11-customers .person small{display:block;font-size:10px;color:#927c65;margin-top:6px}.yc11-customers .person b{font-size:12px;white-space:nowrap}
.yc11-customers .panel{position:sticky;top:90px;background:#fffaf2;border:1px solid #e1d1bb;padding:23px;display:grid;gap:18px;min-width:0}.yc11-customers .panel h2{font:500 36px 'Cormorant Garamond',serif;margin:0}.yc11-customers .panel h3{font:600 22px 'Cormorant Garamond',serif;margin:0}.yc11-customers .facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.yc11-customers .facts div{background:#f5eadd;padding:12px}.yc11-customers .facts small{display:block;font-size:10px;color:#997e62}.yc11-customers .facts strong{font-size:14px;margin-top:6px;display:block;overflow-wrap:anywhere}.yc11-customers .timeline{display:grid;gap:9px}.yc11-customers .timeline article{padding:12px 0;border-top:1px solid #e8d9c6;display:flex;gap:11px;align-items:flex-start;justify-content:space-between}.yc11-customers .timeline strong{font-size:11px;display:block}.yc11-customers .timeline small{font-size:10px;color:#947c65;display:block;margin-top:5px}.yc11-customers .quiet{padding:22px;background:#fffaf4;color:#927c65;font-size:12px}
@media(max-width:1000px){.yc11-customers .grid{grid-template-columns:1fr}.yc11-customers .panel{position:static}}
@media(max-width:680px){.yc11-customers .metrics{grid-template-columns:repeat(2,1fr)}.yc11-customers .toolbar input,.yc11-customers .toolbar select{width:100%;max-width:none}.yc11-customers .toolbar svg{display:none}}
@media(max-width:375px){.yc11-customers .metrics{grid-template-columns:1fr}}
`;
export default function CustomerRecordsPage() {
  const { orders, visits, transactions, getMemberPoints } = useCafe();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const customers = useMemo(() => {
    const map = new Map();
    const ensure = (nickname) => {
      const key = keyFor(nickname), label = String(nickname || "Café Guest").trim() || "Café Guest";
      if (!map.has(key)) map.set(key, { key, nickname: label, visits: [], orders: [], spend: 0, lastSeen: 0 });
      return map.get(key);
    };
    visits.forEach((v) => { const c = ensure(v.nickname); c.visits.push(v); c.lastSeen = Math.max(c.lastSeen, Number(v.seatedAt) || 0); });
    orders.forEach((o) => { const c = ensure(o.nickname); c.orders.push(o); if (o.paymentStatus === "paid") c.spend += Number(o.total) || 0; c.lastSeen = Math.max(c.lastSeen, Number(o.createdAt) || 0); });
    return [...map.values()].sort((a, b) => b.lastSeen - a.lastSeen);
  }, [orders, visits]);
  const visible = useMemo(() => customers.filter((c) => c.nickname.toLowerCase().includes(search.trim().toLowerCase()) &&
    (filter === "all" || (filter === "paid" ? c.spend > 0 : filter === "visits" ? c.visits.length > 0 : c.orders.length > 0))), [customers, search, filter]);
  const active = visible.find((c) => c.key === selected) || visible[0];
  const paid = transactions.filter((t) => t.status === "paid");
  const totalDemoSpend = paid.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const exportRecords = () => exportCsv([
    ["Demo nickname", "Visits", "Orders", "Paid order total PHP", "Last activity", "Demo points"],
    ...visible.map((c) => [c.nickname, c.visits.length, c.orders.length, c.spend.toFixed(2), date(c.lastSeen), getMemberPoints(c.nickname)]),
  ]);
  const history = active ? [...active.visits.map((v) => ({ id: v.id, at: v.seatedAt, title: `${v.tableId} · ${v.partySize} guest(s)`, note: `Visit ${v.status}` })), ...active.orders.map((o) => ({ id: o.id, at: o.createdAt, title: `${o.reference} · ${formatPeso(o.total)}`, note: `Order ${o.status} · ${o.paymentStatus}` }))].sort((a, b) => b.at - a.at).slice(0, 10) : [];
  return <section className="yc11-customers"><style>{styles}</style>
    <header><div><span className="overline">CAFÉ OPERATIONS / CUSTOMER INSIGHTS</span><h1>Guests & familiar faces.</h1><p>Review nickname-based demo activity, seating visits and paid orders.</p></div><button className="btn light" type="button" onClick={exportRecords}><Download size={16}/> Export filtered CSV</button></header>
    <div className="metrics"><div className="metric"><span>Distinct nicknames</span><strong>{customers.length}</strong></div><div className="metric"><span>Recorded visits</span><strong>{visits.length}</strong></div><div className="metric"><span>Placed orders</span><strong>{orders.length}</strong></div><div className="metric"><span>Demo payments total</span><strong>{formatPeso(totalDemoSpend)}</strong></div></div>
    <p>Guests are grouped by nickname only—these are <strong>not verified customer accounts</strong>. Different people can share a nickname, and name changes create separate records. All information remains in this browser.</p>
    <div className="toolbar"><Search size={17}/><input aria-label="Search nickname" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guest nickname..."/><select aria-label="Customer activity filter" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All nicknames</option><option value="paid">Has paid orders</option><option value="visits">Has table visits</option><option value="orders">Has placed orders</option></select></div>
    <div className="grid"><div className="list">{visible.length === 0 ? <div className="quiet">No customer activity matches these filters. Try a demo order or table check-in.</div> : visible.map((c) => <button type="button" className={`person ${active?.key === c.key ? "active" : ""}`} key={c.key} onClick={() => setSelected(c.key)}><div className="identity"><span className="avatar">{c.nickname[0]?.toUpperCase() || "G"}</span><span><strong>{c.nickname}</strong><small>{c.visits.length} visit(s) · {c.orders.length} order(s)</small><small>Last: {date(c.lastSeen)}</small></span></div><b>{formatPeso(c.spend)}</b></button>)}</div>
      <aside className="panel">{active ? <><div><span className="overline"><Users size={14} style={{verticalAlign:"middle"}}/> GUEST SNAPSHOT</span><h2>{active.nickname}</h2><p>Summary is calculated from matching local records.</p></div><div className="facts"><div><small>Table visits</small><strong>{active.visits.length}</strong></div><div><small>Orders placed</small><strong>{active.orders.length}</strong></div><div><small>Paid order totals</small><strong>{formatPeso(active.spend)}</strong></div><div><small>Demo loyalty points</small><strong>{getMemberPoints(active.nickname)}</strong></div></div><div><h3>Recent activity</h3><div className="timeline">{history.map((item) => <article key={item.id}><span><strong>{item.title}</strong><small>{item.note}</small><small>{date(item.at)}</small></span><Coffee size={15}/></article>)}</div></div><Link to="/staff/transactions" className="btn light" style={{justifyContent:"center"}}><ShoppingBag size={15}/> View transactions <ArrowRight size={14}/></Link></> : <div className="quiet">Select a guest to preview local history.</div>}</aside>
    </div>
  </section>;
}
