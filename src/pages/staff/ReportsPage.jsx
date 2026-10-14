// YOUR CAFÉ — BATCH 8 / REPORTS & ANALYTICS
// Local demo figures only; never a live sales system.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, CreditCard, Download, ShoppingBag, TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatPeso, PAYMENT_METHODS } from "../../data/config.js";
import { useCafe } from "../../context/CafeContext.jsx";

const PALETTE = ["#a67850", "#647657", "#ca9b71", "#c77c61"];
const dateKey = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
function downloadCSV(filename, rows) {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Metric({ label, value, note, Icon }) {
  return <article className="yc8-report-metric"><Icon size={18}/><small>{label}</small><strong>{value}</strong><span>{note}</span></article>;
}

export default function ReportsPage() {
  const { transactions, orders, visits, reservations, now } = useCafe();
  const [period, setPeriod] = useState("7");
  const days = Number(period);
  const today = dateKey(now);

  const data = useMemo(() => {
    const buckets = Array.from({ length: days }, (_, i) => {
      const date = new Date(now);
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - (days - i - 1));
      return { key: dateKey(date), label: date.toLocaleDateString("en-PH", { month: "short", day: "numeric" }), sales: 0, payments: 0 };
    });
    const byDate = new Map(buckets.map((item) => [item.key, item]));
    const includedPayments = transactions.filter((tx) => tx.status === "paid" && byDate.has(dateKey(tx.at)));
    includedPayments.forEach((tx) => {
      const day = byDate.get(dateKey(tx.at));
      day.sales += Number(tx.amount) || 0;
      day.payments += 1;
    });

    const revenue = includedPayments.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    const paymentMethods = PAYMENT_METHODS.map((method, index) => ({
      name: method.name.replace(" — Manual Demo", ""),
      value: includedPayments.filter((tx) => tx.methodId === method.id).reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0),
      color: PALETTE[index % PALETTE.length],
    })).filter((item) => item.value > 0);

    const paidIds = new Set(includedPayments.map((tx) => tx.orderId));
    const productTotals = new Map();
    orders.filter((order) => paidIds.has(order.id)).forEach((order) => {
      (order.lines || []).forEach((line) => {
        const previous = productTotals.get(line.productId) || { name: line.name, count: 0, sales: 0 };
        productTotals.set(line.productId, {
          ...previous,
          count: previous.count + line.quantity,
          sales: previous.sales + line.lineTotal,
        });
      });
    });

    const visitsInRange = visits.filter((v) => byDate.has(dateKey(v.seatedAt))).length;
    const ordersInRange = orders.filter((o) => byDate.has(dateKey(o.createdAt))).length;
    const bookingsInRange = reservations.filter((r) => byDate.has(dateKey(r.startAt))).length;
    return {
      buckets, includedPayments, revenue, paymentMethods, visitsInRange, ordersInRange, bookingsInRange,
      topProducts: [...productTotals.values()].sort((a, b) => b.count - a.count).slice(0, 6),
      average: includedPayments.length ? revenue / includedPayments.length : 0,
    };
  }, [days, now, orders, reservations, transactions, visits]);

  const hasRevenue = data.includedPayments.length > 0;
  const exportReport = () => downloadCSV(`your-cafe-sales-${days}-days-${today}.csv`, [
    ["Payment date", "Order reference", "Amount PHP", "Payment method", "Status"],
    ...data.includedPayments.map((tx) => [new Date(tx.at).toLocaleString("en-PH"), tx.reference, tx.amount, tx.methodId, tx.status]),
  ]);

  return <section className="yc8-reports">
    <style>{`
      .yc8-reports{color:#36271e;display:grid;gap:22px;min-width:0}.yc8-reports *{box-sizing:border-box}
      .yc8-reports .top{display:flex;justify-content:space-between;align-items:end;gap:16px;flex-wrap:wrap}
      .yc8-reports .kicker{font:800 10px 'DM Sans',sans-serif;letter-spacing:.18em;color:#9b7350}
      .yc8-reports h1{font:500 clamp(44px,5vw,70px)/.96 'Cormorant Garamond',Georgia,serif;margin:10px 0;color:#33241c}
      .yc8-reports .hint{color:#8c7a68;font-size:12px;line-height:1.7;margin:0;max-width:650px}
      .yc8-reports .tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.yc8-reports .tools select,.yc8-reports .tools button{padding:13px 15px;border:1px solid #ddcbb6;background:#fffaf4;color:#48342a;font:700 11px 'DM Sans',sans-serif;min-height:45px}
      .yc8-reports button{cursor:pointer}.yc8-reports .tools button{display:inline-flex;align-items:center;gap:8px}.yc8-reports .tools button:hover{background:#f1e5d6}
      .yc8-reports .metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
      .yc8-report-metric{display:grid;gap:9px;padding:22px;background:#fffaf4;border:1px solid #e6d8c7;min-width:0}
      .yc8-report-metric svg{color:#a07954}.yc8-report-metric small{font-size:10px;letter-spacing:.1em;color:#806d5c;font-weight:700}
      .yc8-report-metric strong{font:600 clamp(28px,3vw,43px)/1.1 'Cormorant Garamond',Georgia,serif;overflow-wrap:anywhere}
      .yc8-report-metric span{color:#988675;font-size:11px}
      .yc8-reports .panels{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(250px,1fr);gap:16px}
      .yc8-reports .panel{padding:clamp(18px,2.5vw,28px);border:1px solid #e6d8c7;background:#fffaf5;min-width:0}
      .yc8-reports .panel h2{font:500 34px 'Cormorant Garamond',Georgia,serif;margin:0 0 6px}.yc8-reports .panel p{font-size:11px;color:#8c7a68;line-height:1.6;margin:0 0 19px}
      .yc8-reports .chart{width:100%;height:260px;min-width:0}.yc8-reports .empty{padding:55px 15px;text-align:center;color:#9a836f;border:1px dashed #e5d3bd;background:#fbf5ec;font-size:12px;line-height:1.7}
      .yc8-reports .product{display:grid;grid-template-columns:minmax(0,1fr) 70px 110px;gap:10px;align-items:center;border-top:1px solid #eadfd3;padding:13px 0;font-size:12px}
      .yc8-reports .product>span{overflow-wrap:anywhere}.yc8-reports .product b{color:#906b48;font-size:11px;text-align:right}.yc8-reports .product small{text-align:right;color:#82715f}
      .yc8-reports .foot{font-size:11px;color:#7e6b5a;line-height:1.7}.yc8-reports .foot a{color:#8c653e;text-decoration:underline}
      @media(max-width:1100px){.yc8-reports .metrics{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:850px){.yc8-reports .panels{grid-template-columns:1fr}}
      @media(max-width:500px){.yc8-reports .metrics{gap:8px}.yc8-report-metric{padding:15px}.yc8-reports .chart{height:210px}.yc8-reports .product{grid-template-columns:minmax(0,1fr) 40px 85px}}
    `}</style>
    <div className="top"><div><span className="kicker">YOUR CAFÉ / BUSINESS INTELLIGENCE</span><h1>Every cup. <em>Every insight.</em></h1><p className="hint">Performance measured from recorded browser-demo transactions, not invented sales figures.</p></div>
      <div className="tools"><label htmlFor="yc8-report-period" className="kicker">PERIOD</label><select id="yc8-report-period" value={period} onChange={(e) => setPeriod(e.target.value)}>
        <option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option>
      </select><button type="button" onClick={exportReport}><Download size={16}/> Export CSV</button></div>
    </div>
    <div className="metrics">
      <Metric Icon={TrendingUp} label="RECORDED SALES" value={formatPeso(data.revenue)} note="Paid demo transactions"/>
      <Metric Icon={CreditCard} label="PAID TRANSACTIONS" value={data.includedPayments.length} note="Within selected period"/>
      <Metric Icon={ShoppingBag} label="AVG. PAID TICKET" value={formatPeso(data.average)} note="Revenue ÷ paid transactions"/>
      <Metric Icon={BarChart3} label="TOTAL ORDERS" value={data.ordersInRange} note={`${data.visitsInRange} seated visits · ${data.bookingsInRange} reservations`}/>
    </div>
    <div className="panels"><article className="panel"><h2>Revenue rhythm</h2><p>Sales grouped by payment date, in Philippine pesos.</p>
      {hasRevenue ? <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.buckets} margin={{left:-12,right:8,top:5,bottom:0}}>
        <defs><linearGradient id="yc8Area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b58b5a" stopOpacity={0.34}/><stop offset="100%" stopColor="#b58b5a" stopOpacity={0.02}/></linearGradient></defs>
        <CartesianGrid strokeDasharray="3 5" stroke="#e8ddcf" vertical={false}/><XAxis dataKey="label" tick={{fill:"#8c7664",fontSize:10}} tickLine={false} axisLine={false} minTickGap={24}/>
        <YAxis tick={{fill:"#8c7664",fontSize:10}} tickLine={false} axisLine={false} width={58} tickFormatter={(v)=>`₱${v}`}/>
        <Tooltip formatter={(v)=>formatPeso(v)} contentStyle={{border:"1px solid #e0d1c0",background:"#fffaf4",fontSize:12}}/>
        <Area type="monotone" dataKey="sales" stroke="#a0784f" strokeWidth={2.5} fill="url(#yc8Area)" name="Sales" />
      </AreaChart></ResponsiveContainer></div> : <div className="empty">No demo payments in this period yet. Record a payment through <Link to="/staff/pos">Café POS</Link> to populate the chart.</div>}
    </article><article className="panel"><h2>Payment mix</h2><p>How simulated customers paid their bills.</p>
      {data.paymentMethods.length ? <><div className="chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.paymentMethods} dataKey="value" nameKey="name" innerRadius="48%" outerRadius="76%" stroke="none">
        {data.paymentMethods.map((method) => <Cell key={method.name} fill={method.color}/>)}</Pie><Tooltip formatter={(v)=>formatPeso(v)}/></PieChart></ResponsiveContainer></div>
        {data.paymentMethods.map((m) => <div className="product" key={m.name}><span>{m.name}</span><small>{Math.round(m.value / data.revenue * 100)}%</small><b>{formatPeso(m.value)}</b></div>)}
      </> : <div className="empty">No payment methods recorded.</div>}
    </article></div>
    <article className="panel"><h2>Most ordered favorites</h2><p>Quantity of items in paid demonstration orders during the selected period.</p>
      {data.topProducts.length ? <><div className="chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.topProducts} layout="vertical" margin={{left:0,right:16,top:0,bottom:0}}>
        <CartesianGrid strokeDasharray="3 5" stroke="#e8ddcf" horizontal={false}/><XAxis type="number" allowDecimals={false} tick={{fontSize:10,fill:"#806c5a"}}/>
        <YAxis type="category" dataKey="name" width={130} tick={{fontSize:10,fill:"#806c5a"}}/>
        <Tooltip/><Bar dataKey="count" fill="#a67850" radius={[0,4,4,0]} name="Units"/>
      </BarChart></ResponsiveContainer></div>{data.topProducts.map((p) => <div className="product" key={p.name}><span>{p.name}</span><small>{p.count} pcs</small><b>{formatPeso(p.sales)}</b></div>)}</> : <div className="empty">Your top-selling items will appear when demo purchases are recorded.</div>}
    </article>
    <p className="foot">This is a local demonstration. It does not track real branch revenue, real payments or customer accounts. <Link to="/staff/transactions">View transaction records</Link>.</p>
  </section>;
}
