// YOUR CAFÉ — Batch 6 / staff operations dashboard
// Metrics are derived from local demo records, not random sample figures.
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, CalendarDays, BarChart3, CheckCircle2,
  ChefHat, Clock3, Coffee, CreditCard, LayoutGrid, Package,
  ShoppingBag, TrendingUp, Users,
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { formatPeso } from "../../data/config.js";
import { useCafe } from "../../context/CafeContext.jsx";

const dateKey = (value) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const clock = (ms) => new Date(ms).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });

function Metric({ icon: Icon, title, value, note }) {
  return <article className="yc6-metric"><span className="yc6-metric-icon"><Icon size={18}/></span>
    <small>{title}</small><strong>{value}</strong><p>{note}</p></article>;
}

export default function DashboardPage() {
  const { stats, orders, reservations, transactions, events, inventory, now } = useCafe();
  const recent = [...events].sort((a, b) => b.at - a.at).slice(0, 7);
  const pendingReservations = reservations.filter((r) => r.status === "reserved")
    .sort((a, b) => a.startAt - b.startAt).slice(0, 4);
  const lowStock = inventory.filter((i) => i.quantity <= i.lowStockAt).slice(0, 5);

  const chartData = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    const key = dateKey(d);
    const daily = transactions.filter((t) => t.status === "paid" && dateKey(t.at) === key);
    return {
      day: d.toLocaleDateString("en-PH", { weekday: "short" }),
      revenue: daily.reduce((sum, t) => sum + t.amount, 0),
      payments: daily.length,
    };
  }), [transactions, now]);

  const queue = useMemo(() => orders.filter((o) =>
    !["completed", "cancelled"].includes(o.status)
  ).slice(0, 5), [orders]);

  return <section className="yc6-dashboard">
    <style>{`
      .yc6-dashboard{color:#31271e;min-width:0}.yc6-dashboard .yc6-kicker{font-size:10px;font-weight:700;letter-spacing:.2em;color:#937351}
      .yc6-dashboard h1{font:500 clamp(43px,5vw,67px)/.98 'Cormorant Garamond',Georgia,serif;margin:12px 0;color:#302824}
      .yc6-dashboard h1 em{font-weight:400;color:#a57c53}.yc6-dashboard .yc6-head{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:28px;flex-wrap:wrap}
      .yc6-dashboard .yc6-desc{font-size:12px;line-height:1.7;color:#8d7d6c;max-width:500px}.yc6-dashboard .yc6-live{display:flex;align-items:center;gap:8px;padding:12px 17px;color:#496d50;border:1px solid #cedac8;background:#eef3e9;font-size:10px;font-weight:700}
      .yc6-dashboard .yc6-dot{width:7px;height:7px;background:#648668;border-radius:50%;box-shadow:0 0 0 4px #64866823}
      .yc6-dashboard .yc6-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:22px}
      .yc6-dashboard .yc6-metric{border:1px solid #e8dccd;background:#fffaf4;min-width:0;padding:23px 20px;display:flex;flex-direction:column;align-items:flex-start;min-height:165px}
      .yc6-dashboard .yc6-metric-icon{width:33px;height:33px;background:#f4eade;color:#876242;display:grid;place-items:center;margin-bottom:14px}
      .yc6-dashboard .yc6-metric small{letter-spacing:.1em;font-weight:700;font-size:9px;color:#9b816a}
      .yc6-dashboard .yc6-metric strong{font:600 clamp(29px,3vw,43px)/1.1 'Cormorant Garamond',Georgia,serif;margin:9px 0 5px;overflow-wrap:anywhere}
      .yc6-dashboard .yc6-metric p{font-size:10px;color:#8c7b6a;margin:auto 0 0}.yc6-dashboard .yc6-content{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(270px,.7fr);gap:20px;align-items:start}
      .yc6-dashboard .yc6-card{background:#fffaf4;border:1px solid #e8dccd;padding:clamp(18px,2.5vw,30px);min-width:0;margin-bottom:20px}
      .yc6-dashboard .yc6-card-header{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:24px;flex-wrap:wrap}
      .yc6-dashboard .yc6-card h2{font:500 32px 'Cormorant Garamond',Georgia,serif;margin:0}
      .yc6-dashboard .yc6-card-header a{display:flex;align-items:center;gap:7px;font-size:10px;font-weight:800;letter-spacing:.06em;color:#866443}
      .yc6-dashboard .yc6-chart{height:245px;width:100%;min-width:0}.yc6-dashboard .yc6-empty{color:#92816c;font-size:12px;line-height:1.7;padding:12px 0}
      .yc6-dashboard .yc6-list{display:grid}.yc6-dashboard .yc6-entry{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 0;border-top:1px solid #ecdfd0;min-width:0}
      .yc6-dashboard .yc6-entry:first-child{border-top:0}.yc6-dashboard .yc6-entry>div{min-width:0;display:grid;gap:5px}
      .yc6-dashboard .yc6-entry b{font-size:12px;font-weight:700;overflow-wrap:anywhere}.yc6-dashboard .yc6-entry small{font-size:10px;color:#9a8672;overflow-wrap:anywhere}
      .yc6-dashboard .yc6-entry>strong{font-size:12px;white-space:nowrap}.yc6-dashboard .yc6-pill{font-size:9px;font-weight:800;letter-spacing:.04em;background:#efe6d9;color:#78563a;padding:7px 9px;white-space:nowrap}
      .yc6-dashboard .yc6-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}
      .yc6-dashboard .yc6-links a{border:1px solid #e1d1bd;background:#fffaf4;padding:15px;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;font-weight:700;min-width:0}
      .yc6-dashboard .yc6-links a:hover{background:#f1e6d5}.yc6-dashboard .yc6-warning{display:flex;gap:10px;align-items:center;color:#9b6c45;font-size:11px}
      @media(max-width:1200px){.yc6-dashboard .yc6-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:980px){.yc6-dashboard .yc6-content{grid-template-columns:1fr}}
      @media(max-width:600px){.yc6-dashboard .yc6-metrics{gap:9px}.yc6-dashboard .yc6-metric{padding:16px 12px;min-height:148px}.yc6-dashboard .yc6-links{grid-template-columns:1fr}.yc6-dashboard .yc6-chart{height:210px}}
    `}</style>
    <div className="yc6-head"><div><span className="yc6-kicker">YOUR CAFÉ / OPERATIONS STUDIO</span>
      <h1>Good day, <em>café team.</em></h1><p className="yc6-desc">A thoughtful overview of café operations, using only this browser's demonstration records.</p></div>
      <div className="yc6-live"><span className="yc6-dot"/> LOCAL DEMO · {clock(now)}</div>
    </div>
    <div className="yc6-metrics">
      <Metric icon={LayoutGrid} title="SEATING UNITS" value={stats.totalTables} note={`${stats.available} available · ${stats.reserved} reserved`}/>
      <Metric icon={Users} title="OCCUPIED" value={stats.occupied} note={`${stats.occupancyPercent}% current occupancy`}/>
      <Metric icon={ShoppingBag} title="ACTIVE ORDERS" value={stats.activeOrders} note={`${stats.received} waiting · ${stats.preparing} preparing`}/>
      <Metric icon={CreditCard} title="TODAY'S REVENUE" value={formatPeso(stats.todayRevenue)} note="Recorded demonstration payments"/>
      <Metric icon={ChefHat} title="READY TO SERVE" value={stats.ready} note="Orders ready for staff pickup"/>
      <Metric icon={CalendarDays} title="TODAY'S VISITS" value={stats.todayVisits} note="Seating records created today"/>
      <Metric icon={TrendingUp} title="AVERAGE PAID ORDER" value={formatPeso(stats.averagePaidOrder)} note="Derived from paid demo transactions"/>
      <Metric icon={Package} title="LOW STOCK ITEMS" value={stats.lowStock} note="Items at or below demo threshold"/>
    </div>
    <div className="yc6-content">
      <div>
        <div className="yc6-card"><div className="yc6-card-header"><h2>Revenue over time.</h2><span className="yc6-pill">LAST 7 DAYS</span></div>
          <div className="yc6-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:8,right:8,left:-19,bottom:0}}>
            <defs><linearGradient id="yc6RevenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b58b5a" stopOpacity={.4}/><stop offset="100%" stopColor="#b58b5a" stopOpacity={.02}/></linearGradient></defs>
            <CartesianGrid stroke="#e9dfd3" strokeDasharray="3 6" vertical={false}/><XAxis dataKey="day" stroke="#978978" tickLine={false} axisLine={false} fontSize={10}/>
            <YAxis stroke="#978978" tickLine={false} axisLine={false} fontSize={10} tickFormatter={(value)=>value>=1000?`${value/1000}k`:value}/>
            <Tooltip formatter={(value)=>[formatPeso(value),"Demo revenue"]} contentStyle={{background:"#fffaf4",border:"1px solid #e4d7c8",fontSize:11}}/>
            <Area dataKey="revenue" type="monotone" stroke="#94704c" strokeWidth={2.5} fill="url(#yc6RevenueFill)" />
          </AreaChart></ResponsiveContainer></div>
          {!transactions.length && <p className="yc6-empty">No payments recorded yet. The chart will populate as you mark café orders paid.</p>}
        </div>
        <div className="yc6-card"><div className="yc6-card-header"><h2>Current order queue.</h2><Link to="/staff/orders">VIEW ALL <ArrowRight size={15}/></Link></div>
          <div className="yc6-list">{queue.length ? queue.map((o)=><div className="yc6-entry" key={o.id}><div><b>{o.nickname} · {o.reference}</b><small>{o.lines.map(l=>`${l.quantity}× ${l.name}`).join(", ")}</small></div><span className="yc6-pill">{o.status.toUpperCase()}</span></div>) : <p className="yc6-empty">No active orders. Try placing an order from the customer menu.</p>}</div>
        </div>
      </div>
      <div>
        <div className="yc6-card"><div className="yc6-card-header"><h2>Upcoming bookings.</h2><Link to="/staff/reservations">ALL BOOKINGS <ArrowRight size={15}/></Link></div>
          {pendingReservations.length ? pendingReservations.map((r)=><div className="yc6-entry" key={r.id}><div><b>{r.tableId} · {r.partySize} guests</b><small>{new Date(r.startAt).toLocaleString("en-PH",{dateStyle:"medium",timeStyle:"short"})}</small></div><CalendarDays size={17}/></div>) : <p className="yc6-empty">No upcoming reservations.</p>}
        </div>
        <div className="yc6-card"><div className="yc6-card-header"><h2>Recent activity.</h2><Clock3 size={17}/></div>
          {recent.length ? recent.map((e)=><div className="yc6-entry" key={e.id}><div><b>{e.text}</b><small>{clock(e.at)}</small></div><CheckCircle2 size={15} color="#799177"/></div>) : <p className="yc6-empty">Your café activity will appear here after the first action.</p>}
        </div>
        <div className="yc6-card"><div className="yc6-card-header"><h2>Inventory watch.</h2><Link to="/staff/inventory">INVENTORY <ArrowRight size={15}/></Link></div>
          {lowStock.length ? lowStock.map((i)=><div className="yc6-entry" key={i.id}><div><b>{i.name}</b><small>{i.quantity} {i.unit} remaining</small></div><Package size={16} color="#b96254"/></div>) : <p className="yc6-warning"><CheckCircle2 size={17}/> All tracked items above their sample low-stock limits.</p>}
        </div>
      </div>
    </div>
    <div className="yc6-links"><Link to="/staff/tables"><LayoutGrid size={19}/> Manage Tables <ArrowRight size={15}/></Link><Link to="/staff/orders"><Coffee size={19}/> Barista Queue <ArrowRight size={15}/></Link><Link to="/staff/reports"><BarChart3 size={19}/> Full Reports <ArrowRight size={15}/></Link></div>
  </section>;
}
