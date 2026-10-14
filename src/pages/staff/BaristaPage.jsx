// YOUR CAFÉ — Barista / Kitchen Display, Batch 7
// Preparation status is shared with the customer order tracker via CafeContext.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChefHat, Clock3, Coffee, CreditCard, Search, XCircle } from "lucide-react";
import { PAYMENT_METHODS, formatPeso } from "../../data/config.js";
import { useCafe } from "../../context/CafeContext.jsx";

const STEPS = { received: "accepted", accepted: "preparing", preparing: "ready", ready: "completed" };
const CAPTIONS = { received: "Accept order", accepted: "Begin preparation", preparing: "Mark ready", ready: "Complete & deduct stock" };
const DISPLAY = { received: "NEW", accepted: "ACCEPTED", preparing: "PREPARING", ready: "READY", completed: "COMPLETED", cancelled: "CANCELLED" };
const fmtTime = (ms) => new Date(ms).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
const fmtAge = (ms) => { const s = Math.max(0,Math.floor(ms/1000)); return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; };
const css = `
.yc7-barista{min-width:0;display:grid;gap:21px;color:#352920}.yc7-barista *{box-sizing:border-box}.yc7-barista h1{font:600 clamp(44px,5vw,69px)/1 'Cormorant Garamond',serif;margin:7px 0 8px}.yc7-barista-head{display:flex;justify-content:space-between;align-items:end;gap:18px;flex-wrap:wrap}.yc7-barista-head p{font-size:12px;color:#8d7763;line-height:1.7}.yc7-barista-kicker{font-size:10px;color:#9b754e;font-weight:800;letter-spacing:.15em}.yc7-barista-live{font-size:10px;font-weight:800;background:#e9eee5;color:#536e4d;padding:12px}.yc7-barista-metrics{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:11px}.yc7-barista-metric{padding:15px;background:#fffaf3;border:1px solid #e4d6c6;text-align:left;color:#493328;cursor:pointer}.yc7-barista-metric.active{background:#392a21;color:#fff;border-color:#392a21}.yc7-barista-metric span{display:block;font-size:9px;letter-spacing:.1em;opacity:.8}.yc7-barista-metric strong{display:block;margin-top:4px;font:600 39px 'Cormorant Garamond',serif}.yc7-barista-filters{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.yc7-barista-filters input,.yc7-barista-filters select{background:#fffaf3;border:1px solid #dccdb9;min-height:43px;padding:10px 12px;color:#392a21;font-size:12px;min-width:0}.yc7-barista-filters input{flex:1;min-width:185px}.yc7-barista-columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.yc7-barista-ticket{background:#fffaf3;border:1px solid #e5d4c0;padding:21px;display:flex;flex-direction:column;gap:15px;min-width:0;box-shadow:0 12px 27px #3b271008}.yc7-barista-ticket.is-received{border-top:3px solid #b58b5a}.yc7-barista-ticket.is-preparing{border-top:3px solid #c7795c}.yc7-barista-ticket.is-ready{border-top:3px solid #66816a}.yc7-barista-ticket.is-completed{border-top:3px solid #66816a}.yc7-barista-ticket-head,.yc7-barista-price,.yc7-barista-foot{display:flex;justify-content:space-between;align-items:center;gap:10px}.yc7-barista-ref{font-size:10px;letter-spacing:.07em;overflow-wrap:anywhere;font-weight:800;color:#846446}.yc7-barista-badge{padding:6px 9px;font-size:9px;font-weight:800;background:#f1e8db;color:#765639}.yc7-barista-ticket.is-ready .yc7-barista-badge{color:#53704a;background:#e7efdf}.yc7-barista-ticket h3{font:600 31px 'Cormorant Garamond',serif;margin:0;overflow-wrap:anywhere}.yc7-barista-meta{font-size:11px;color:#8a7664;line-height:1.7}.yc7-barista-queue-lines{padding:13px 0;border-top:1px dashed #d4bca5;border-bottom:1px dashed #d4bca5;display:grid;gap:14px}.yc7-barista-line{display:grid;gap:5px}.yc7-barista-line strong{font-size:12px}.yc7-barista-line small{font-size:10px;color:#8a735f;line-height:1.7;overflow-wrap:anywhere}.yc7-barista-note{font-size:11px;line-height:1.7;padding:12px;background:#f2e9dc;color:#74583d}.yc7-barista-price{font-size:11px;color:#8a745f}.yc7-barista-price strong{font-size:17px;color:#3c2b20}.yc7-barista-actions{display:grid;gap:8px;margin-top:auto}.yc7-barista-actions button{border:1px solid #bda58d;padding:12px 13px;background:#fff;color:#624a36;font-weight:800;font-size:10px;display:flex;align-items:center;justify-content:center;gap:8px}.yc7-barista-actions button.primary{background:#38291f;border-color:#38291f;color:white}.yc7-barista-actions button.cancel{border-color:#ecc7bf;color:#aa5748}.yc7-barista-actions select{width:100%;min-height:40px;padding:8px;border:1px solid #ddc8b3;color:#5e4431;background:#fff;font-size:11px}.yc7-barista-alert{background:#e8eee2;color:#55704c;padding:13px 16px;font-size:11px;line-height:1.7}.yc7-barista-alert.error{background:#fae7e1;color:#a34c3c}.yc7-barista-empty{text-align:center;background:#fffaf3;border:1px solid #e3d4c2;padding:70px 22px;grid-column:1/-1;color:#947c62}.yc7-barista-empty h3{font:600 35px 'Cormorant Garamond',serif;color:#3e2d21;margin:13px 0 3px}.yc7-barista-empty p{font-size:12px}
@media(max-width:1160px){.yc7-barista-columns{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:800px){.yc7-barista-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}.yc7-barista-columns{grid-template-columns:1fr}}
@media(max-width:480px){.yc7-barista-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.yc7-barista-filters input,.yc7-barista-filters select{width:100%}}
`;

function Ticket({ order, ageMs, actions, onFeedback }) {
  const [method,setMethod] = useState("cash");
  const [showPayment,setShowPayment] = useState(false);
  function run(action, success) { const result=action();onFeedback({error:!result.ok,text:result.ok?success:result.error}); }
  const next = STEPS[order.status];
  const canCancel = ["received","accepted"].includes(order.status) && order.paymentStatus!=="paid";
  const update = () => run(()=>actions.updateOrderStatus(order.id,next), next === "completed" ? "Order completed. Ingredient stock deducted exactly once." : `Order marked ${next}.`);
  const options = (o) => [o.size,o.temperature,o.milk,o.sweetness,...(o.extras||[])].filter(Boolean).join(" · ");
  return <article className={`yc7-barista-ticket is-${order.status}`}>
    <div className="yc7-barista-ticket-head"><span className="yc7-barista-ref">{order.reference}</span><span className="yc7-barista-badge">{DISPLAY[order.status]}</span></div>
    <div><h3>{order.nickname}</h3><p className="yc7-barista-meta">{order.type === "dinein" ? "Dine-in" : "Pickup"}{order.tableId ? ` · ${order.tableId}` : " · Counter"}<br/>Received at {fmtTime(order.createdAt)} · Elapsed {fmtAge(ageMs)}</p></div>
    <div className="yc7-barista-queue-lines">{order.lines.map((line,i)=><div key={`${line.productId}-${i}`} className="yc7-barista-line"><strong>{line.quantity}× {line.name}</strong><small>{options(line.options)||"Standard preparation"}</small></div>)}</div>
    {order.note && <p className="yc7-barista-note">NOTE: {order.note}</p>}
    <div className="yc7-barista-price"><span>{order.paymentStatus === "paid" ? "PAID · DEMO" : "UNPAID · DEMO"}</span><strong>{formatPeso(order.total)}</strong></div>
    <div className="yc7-barista-actions">
      {next && <button type="button" className="primary" onClick={update}><Check size={15}/>{CAPTIONS[order.status]} <ArrowRight size={14}/></button>}
      {order.paymentStatus !== "paid" && order.status !== "cancelled" && <>{showPayment && <select value={method} onChange={(e)=>setMethod(e.target.value)} aria-label="Simulated payment method">{PAYMENT_METHODS.map((m)=><option key={m.id} value={m.id}>{m.name}</option>)}</select>}<button type="button" onClick={()=>showPayment?run(()=>actions.recordPayment(order.id,method),`Demo ${method} payment recorded.`):setShowPayment(true)}><CreditCard size={15}/>{showPayment?"Confirm demo payment":"Record payment"}</button></>}
      {canCancel && <button type="button" className="cancel" onClick={()=>{if(window.confirm(`Cancel unpaid order ${order.reference}?`))run(()=>actions.cancelOrder(order.id),"Unpaid order cancelled.");}}><XCircle size={14}/> Cancel unpaid order</button>}
    </div>
  </article>;
}

export default function BaristaPage() {
  const { orders, actions, now } = useCafe();
  const [filter,setFilter] = useState("active");
  const [query,setQuery] = useState("");
  const [sort,setSort] = useState("oldest");
  const [message,setMessage] = useState(null);
  const counts = [
    ["active","ACTIVE",orders.filter((o)=>STEPS[o.status]).length],
    ["received","NEW",orders.filter((o)=>o.status==="received").length],
    ["preparing","PREPARING",orders.filter((o)=>o.status==="preparing").length],
    ["ready","READY",orders.filter((o)=>o.status==="ready").length],
    ["completed","COMPLETED",orders.filter((o)=>o.status==="completed").length],
  ];
  const visible = useMemo(()=>orders.filter((o)=>{
    const ok = filter === "all" || (filter === "active" ? Boolean(STEPS[o.status]) : o.status===filter);
    return ok && `${o.reference} ${o.nickname} ${o.tableId||""} ${o.lines.map((l)=>l.name).join(" ")}`.toLowerCase().includes(query.toLowerCase());
  }).sort((a,b)=>sort==="oldest"?a.createdAt-b.createdAt:b.createdAt-a.createdAt),[orders,filter,query,sort]);
  return <section className="yc7-barista"><style>{css}</style>
    <header className="yc7-barista-head"><div><small className="yc7-barista-kicker">BARISTA STATION · ORDER PREPARATION</small><h1>Every cup, in motion.</h1><p>Move each order through its real local-demo workflow. Completing orders deducts recipe stock once.</p></div><div className="yc7-barista-live"><Coffee size={14} style={{verticalAlign:"middle"}}/> LOCAL ORDER DISPLAY</div></header>
    <div className="yc7-barista-metrics">{counts.map(([key,label,n])=><button key={key} type="button" className={`yc7-barista-metric ${filter===key?"active":""}`} onClick={()=>setFilter(key)}><span>{label}</span><strong>{n}</strong></button>)}</div>
    <div className="yc7-barista-filters"><Search size={17}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search guest, order, product..." aria-label="Search orders"/><select value={filter} onChange={(e)=>setFilter(e.target.value)} aria-label="Filter order status"><option value="active">Active orders</option><option value="all">All orders</option>{Object.keys(DISPLAY).map((status)=><option key={status} value={status}>{DISPLAY[status]}</option>)}</select><select value={sort} onChange={(e)=>setSort(e.target.value)} aria-label="Sort orders"><option value="oldest">Oldest first</option><option value="newest">Newest first</option></select></div>
    {message&&<div role={message.error?"alert":"status"} className={`yc7-barista-alert ${message.error?"error":""}`}>{message.text}</div>}
    <div className="yc7-barista-columns">{visible.length?visible.map((order)=><Ticket key={order.id} order={order} ageMs={now-order.createdAt} actions={actions} onFeedback={setMessage}/>):<div className="yc7-barista-empty"><ChefHat size={36}/><h3>All caught up.</h3><p>No orders match these filters. Add a demo order in <Link to="/staff/pos">Café POS</Link> or from the public menu.</p></div>}</div>
  </section>;
}
