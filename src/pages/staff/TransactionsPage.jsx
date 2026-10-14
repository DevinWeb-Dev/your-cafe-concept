// YOUR CAFÉ — BATCH 8 / TRANSACTIONS & RECEIPTS
// All receipts are for browser-only demonstration transactions.
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Download, FileText, Printer, Search, X } from "lucide-react";
import { BRAND, PAYMENT_METHODS, formatPeso } from "../../data/config.js";
import { useCafe } from "../../context/CafeContext.jsx";

const timeLabel = (value) => new Date(value).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });
const asCSV = (value) => {
  const s = String(value ?? "");
  const safe = /^[\s]*[=+@\-]/.test(s) ? `'${s}` : s;
  return `"${safe.replaceAll('"', '""')}"`;
};
function exportCSV(data) {
  const lines = [["Paid at", "Reference", "Order ID", "Customer", "Payment", "Amount PHP", "Status"], ...data.map(({ tx, order }) => [
    timeLabel(tx.at), tx.reference, tx.orderId, order?.nickname || "", tx.methodId, tx.amount, tx.status,
  ])];
  const blob = new Blob(["\ufeff", lines.map((line) => line.map(asCSV).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "your-cafe-demo-transactions.csv";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Receipt({ entry, onClose }) {
  const { tx, order } = entry;
  useEffect(() => {
    const close = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);
  const method = PAYMENT_METHODS.find((m) => m.id === tx.methodId)?.name || tx.methodId;
  return <div className="yc8-receipt-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="yc8-receipt-dialog" role="dialog" aria-modal="true" aria-labelledby="yc8-receipt-title">
      <div className="yc8-receipt-toolbar"><b>DEMO RECEIPT PREVIEW</b><div>
        <button type="button" onClick={() => window.print()}><Printer size={15}/> Print</button>
        <button type="button" onClick={onClose} aria-label="Close receipt"><X size={18}/></button>
      </div></div>
      <div className="yc8-print-receipt">
        <span className="yc8-receipt-tag">LOCAL DEMONSTRATION — NOT AN OFFICIAL RECEIPT</span>
        <h2 id="yc8-receipt-title">{BRAND.name}</h2><p>{BRAND.subtitle}</p>
        <div className="yc8-receipt-divider"/><dl>
          <div><dt>Order reference</dt><dd>{tx.reference}</dd></div>
          <div><dt>Transaction ID</dt><dd>{tx.id}</dd></div>
          <div><dt>Date</dt><dd>{timeLabel(tx.at)}</dd></div>
          <div><dt>Customer</dt><dd>{order?.nickname || "Café Guest"}</dd></div>
          <div><dt>Order type</dt><dd>{order?.type === "dinein" ? "Dine-in" : "Pickup"}</dd></div>
          {order?.tableId && <div><dt>Table</dt><dd>{order.tableId}</dd></div>}
        </dl><div className="yc8-receipt-divider"/>
        <strong className="yc8-receipt-label">ORDER ITEMS</strong>
        {(order?.lines || []).map((item, index) => <div className="yc8-receipt-item" key={`${item.productId}-${index}`}>
          <div><b>{item.quantity} × {item.name}</b><small>{[item.options?.size, item.options?.temperature, item.options?.milk, ...(item.options?.extras || [])].filter(Boolean).join(" · ")}</small></div>
          <strong>{formatPeso(item.lineTotal)}</strong>
        </div>)}
        <div className="yc8-receipt-divider"/>
        <dl><div><dt>Subtotal</dt><dd>{formatPeso(order?.subtotal ?? tx.amount)}</dd></div>
          {(order?.discount || 0) > 0 && <div><dt>Demo discount</dt><dd>−{formatPeso(order.discount)}</dd></div>}
          <div className="yc8-receipt-total"><dt>PAID TOTAL</dt><dd>{formatPeso(tx.amount)}</dd></div>
          <div><dt>Method</dt><dd>{method}</dd></div><div><dt>Status</dt><dd>PAID — DEMO</dd></div>
        </dl><p className="yc8-receipt-note">This printable receipt is illustrative only. No funds were processed. {BRAND.watermark}</p>
      </div>
    </div>
  </div>;
}

export default function TransactionsPage() {
  const { transactions, orders } = useCafe();
  const [query, setQuery] = useState("");
  const [method, setMethod] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const entries = useMemo(() => transactions.filter((tx) => tx.status === "paid")
    .map((tx) => ({ tx, order: orders.find((o) => o.id === tx.orderId) || null }))
    .sort((a, b) => b.tx.at - a.tx.at), [transactions, orders]);
  const filtered = useMemo(() => entries.filter(({ tx, order }) =>
    (method === "all" || tx.methodId === method) &&
    [tx.reference, tx.id, order?.nickname, order?.tableId].join(" ").toLowerCase().includes(query.trim().toLowerCase())), [entries, method, query]);
  const selected = entries.find(({ tx }) => tx.id === selectedId) || null;
  const total = filtered.reduce((sum, { tx }) => sum + Number(tx.amount || 0), 0);

  return <section className="yc8-transactions">
    <style>{`
      .yc8-transactions{min-width:0;color:#392b21;display:grid;gap:20px}.yc8-transactions *{box-sizing:border-box}
      .yc8-transactions .head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:15px}
      .yc8-transactions .kicker{font-size:10px;font-weight:800;letter-spacing:.15em;color:#956d4a}
      .yc8-transactions h1{font:500 clamp(43px,5vw,65px)/1 'Cormorant Garamond',Georgia,serif;margin:9px 0}
      .yc8-transactions .muted{color:#927b69;font-size:12px;line-height:1.7;margin:0}
      .yc8-transactions button,.yc8-transactions select,.yc8-transactions input{font-family:'DM Sans',sans-serif}
      .yc8-transactions button{cursor:pointer}.yc8-transactions .export{display:inline-flex;gap:8px;align-items:center;background:#3d2b22;color:white;border:0;padding:13px 17px;font-weight:700;font-size:11px;min-height:45px}
      .yc8-transactions .summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}
      .yc8-transactions .summary>div{padding:19px;background:#fffaf4;border:1px solid #e6d9c9;display:grid;gap:7px;min-width:0}
      .yc8-transactions .summary small{font:700 10px 'DM Sans',sans-serif;letter-spacing:.1em;color:#8e735b}.yc8-transactions .summary b{font:600 33px 'Cormorant Garamond',Georgia,serif;overflow-wrap:anywhere}
      .yc8-transactions .controls{display:flex;flex-wrap:wrap;gap:10px}.yc8-transactions .search{display:flex;align-items:center;gap:9px;padding:0 13px;background:#fffaf4;border:1px solid #dfcfbb;flex:1;min-width:180px}
      .yc8-transactions .search input{width:100%;min-width:0;background:none;border:0;outline:0;padding:14px 0;font-size:12px}.yc8-transactions select{border:1px solid #dfcfbb;background:#fffaf4;color:#4e3a2b;min-height:46px;padding:0 12px;font-size:11px}
      .yc8-transactions .table-scroll{overflow-x:auto;border:1px solid #e4d5c3;background:#fffaf4;max-width:100%}
      .yc8-transactions table{border-collapse:collapse;width:100%;min-width:680px;text-align:left}.yc8-transactions th{font-size:10px;letter-spacing:.08em;color:#8f775f;background:#f2e9dd;padding:15px;white-space:nowrap}
      .yc8-transactions td{font-size:11px;padding:15px;border-top:1px solid #ecdfcf;color:#5c493a}.yc8-transactions td b{color:#39281f;font-weight:800}.yc8-transactions td button{display:inline-flex;align-items:center;gap:5px;padding:9px 11px;border:1px solid #d8c5b0;color:#78583d;background:transparent;font-size:10px;font-weight:700}
      .yc8-transactions .empty{text-align:center;padding:60px 20px;background:#fffaf4;border:1px dashed #d9c6b4;color:#8e775e;font-size:12px}.yc8-transactions .empty a{color:#9a6a3b;text-decoration:underline}
      .yc8-receipt-backdrop{position:fixed;inset:0;z-index:2000;background:#160f0bdd;display:grid;place-items:center;padding:15px;overflow-y:auto}
      .yc8-receipt-dialog{width:min(510px,100%);max-height:min(94dvh,950px);background:#fffaf4;color:#36271e;display:flex;flex-direction:column;box-shadow:0 30px 90px #0007}
      .yc8-receipt-toolbar{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:13px 19px;background:#e9dccb;flex-shrink:0;font:800 10px 'DM Sans',sans-serif;letter-spacing:.09em}
      .yc8-receipt-toolbar>div{display:flex;gap:7px}.yc8-receipt-toolbar button{display:inline-flex;align-items:center;gap:7px;border:1px solid #cbb89e;background:#fffaf4;padding:9px 12px;font-size:11px;cursor:pointer}
      .yc8-print-receipt{padding:clamp(19px,4vw,35px);overflow-y:auto}.yc8-receipt-tag{font-size:9px;font-weight:800;letter-spacing:.1em;color:#a8684e}
      .yc8-print-receipt h2{font:600 46px/.9 'Cormorant Garamond',Georgia,serif;margin:12px 0 5px}.yc8-print-receipt p{font-size:11px;color:#8e7b68;line-height:1.7}
      .yc8-receipt-divider{height:1px;background:#e6d9c9;margin:20px 0}.yc8-print-receipt dl{margin:0;display:grid;gap:8px}
      .yc8-print-receipt dl>div{display:flex;justify-content:space-between;gap:14px;font-size:11px}.yc8-print-receipt dt{color:#8f7b69}.yc8-print-receipt dd{margin:0;text-align:right;max-width:65%;overflow-wrap:anywhere;font-weight:700}
      .yc8-receipt-label{font-size:10px;letter-spacing:.1em;color:#89715b}.yc8-receipt-item{display:flex;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px dashed #e9ddce;font-size:11px}
      .yc8-receipt-item>div{min-width:0}.yc8-receipt-item b{display:block}.yc8-receipt-item small{display:block;color:#96816b;font-size:9px;margin-top:5px;line-height:1.6;overflow-wrap:anywhere}
      .yc8-print-receipt .yc8-receipt-total{padding:9px 0;border-top:1px solid #e2d0bb;font-size:16px}
      .yc8-print-receipt .yc8-receipt-note{margin-top:26px;text-align:center;font-size:10px;color:#917b67}
      @media(max-width:640px){.yc8-transactions .summary{grid-template-columns:1fr 1fr}.yc8-transactions .summary>div:last-child{grid-column:1/-1}.yc8-transactions .summary>div{padding:14px}.yc8-transactions .summary b{font-size:29px}.yc8-receipt-toolbar{padding:12px}}
      @media print{body *{visibility:hidden!important}.yc8-receipt-backdrop,.yc8-receipt-backdrop *{visibility:visible!important}.yc8-receipt-backdrop{position:absolute!important;inset:0!important;background:#fff!important;display:block!important;padding:0!important;overflow:visible!important}.yc8-receipt-dialog{width:100%!important;box-shadow:none!important;max-height:none!important}.yc8-receipt-toolbar{display:none!important}.yc8-print-receipt{overflow:visible!important;padding:12mm!important}}
    `}</style>
    <div className="head"><div><span className="kicker">YOUR CAFÉ / PAYMENT JOURNAL</span><h1>Every transaction, <em>beautifully recorded.</em></h1><p className="muted">Manual demo payment records and printable sample receipts.</p></div>
      <button type="button" className="export" onClick={() => exportCSV(filtered)}><Download size={16}/> Export filtered CSV</button></div>
    <div className="summary"><div><small>FILTERED REVENUE</small><b>{formatPeso(total)}</b></div><div><small>PAYMENT RECORDS</small><b>{filtered.length}</b></div><div><small>AVG. PAYMENT</small><b>{formatPeso(filtered.length ? total / filtered.length : 0)}</b></div></div>
    <div className="controls"><label className="search"><Search size={17} aria-hidden="true"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reference, guest, or table" aria-label="Search transactions"/></label>
      <select value={method} onChange={(e) => setMethod(e.target.value)} aria-label="Filter payment method"><option value="all">All payment methods</option>{PAYMENT_METHODS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
    </div>
    {filtered.length ? <div className="table-scroll" tabIndex={0} aria-label="Transactions table, scroll horizontally on small screens"><table><thead><tr><th>DATE</th><th>ORDER REFERENCE</th><th>GUEST / TABLE</th><th>METHOD</th><th>PAID AMOUNT</th><th>RECEIPT</th></tr></thead><tbody>
      {filtered.map((entry) => <tr key={entry.tx.id}><td>{timeLabel(entry.tx.at)}</td><td><b>{entry.tx.reference}</b></td><td>{entry.order?.nickname || "Café Guest"}<br/>{entry.order?.tableId || "Pickup"}</td><td>{PAYMENT_METHODS.find((m) => m.id === entry.tx.methodId)?.name || entry.tx.methodId}</td><td><b>{formatPeso(entry.tx.amount)}</b></td><td><button type="button" onClick={() => setSelectedId(entry.tx.id)}><FileText size={14}/> View / Print</button></td></tr>)}
    </tbody></table></div> : <div className="empty"><CreditCard size={30}/><p>No recorded payments match your filters.</p><Link to="/staff/pos">Go to POS to record a demo payment</Link></div>}
    <p className="muted">Demo records only. No tax-valid official receipts or real payment processing. Cash, GCash, and card labels mean manual demo entries.</p>
    {selected && <Receipt entry={selected} onClose={() => setSelectedId(null)}/>}
  </section>;
}
