// YOUR CAFÉ — Ingredient Inventory & Stock Monitoring / Batch 7
// Recipe deductions happen in cafeEngine.js when an order is COMPLETED.
// This page shows actual local quantities, low-stock warnings and manual restock.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Boxes, Coffee, PackagePlus, Search, TrendingDown } from "lucide-react";
import { INVENTORY_ITEMS } from "../../data/config.js";
import { useCafe } from "../../context/CafeContext.jsx";

const initialStocks = Object.fromEntries(INVENTORY_ITEMS.map((item)=>[item.id,item.quantity]));
const integer = (n) => Number(n||0).toLocaleString("en-PH",{maximumFractionDigits:2});
const css = `
.yc7-inventory{display:grid;gap:20px;min-width:0;color:#372820}.yc7-inventory *{box-sizing:border-box}.yc7-inventory-head{display:flex;justify-content:space-between;align-items:end;gap:14px;flex-wrap:wrap}.yc7-inventory h1{font:600 clamp(44px,5vw,68px)/1 'Cormorant Garamond',serif;margin:8px 0}.yc7-inventory-head p{font-size:12px;color:#907c68;line-height:1.7}.yc7-inventory-kicker{font-size:10px;color:#a17c51;letter-spacing:.14em;font-weight:800}.yc7-inventory-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.yc7-inventory-metric{border:1px solid #e5d6c4;padding:17px;background:#fffaf3;min-width:0}.yc7-inventory-metric span{font-size:10px;letter-spacing:.07em;color:#95775a}.yc7-inventory-metric strong{font:600 39px 'Cormorant Garamond',serif;display:block;margin-top:8px}.yc7-inventory-controls{border:1px solid #e4d5c5;background:#fffaf3;padding:13px;display:flex;flex-wrap:wrap;align-items:center;gap:11px}.yc7-inventory-controls input,.yc7-inventory-controls select{min-height:43px;border:1px solid #e0d0bc;background:#fff;color:#382b21;padding:11px 12px;font-size:12px}.yc7-inventory-controls input{min-width:180px;flex:1}.yc7-inventory-controls select{min-width:150px}.yc7-inventory-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.yc7-inventory-item{background:#fffaf3;border:1px solid #e3d6c4;padding:20px;min-width:0;display:grid;gap:12px}.yc7-inventory-item.low{border-top:3px solid #b96254}.yc7-inventory-icon{width:37px;height:37px;background:#f0e6d7;display:grid;place-items:center;color:#886342}.yc7-inventory-item-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.yc7-inventory-badge{font-size:9px;font-weight:800;letter-spacing:.07em;padding:6px 9px;background:#e8ede3;color:#597755}.yc7-inventory-badge.low{background:#f6e7e1;color:#a65143}.yc7-inventory-item h3{font:600 26px/1 'Cormorant Garamond',serif;margin:0;overflow-wrap:anywhere}.yc7-inventory-item .amount{font-size:25px;font-weight:800;color:#34251b}.yc7-inventory-item .amount small{font-size:11px;font-weight:500;color:#937c67}.yc7-inventory-item p{font-size:10px;color:#8b7967;line-height:1.6;margin:0}.yc7-inventory-meter{height:5px;background:#e9e0d5;overflow:hidden}.yc7-inventory-meter span{height:100%;display:block;background:#74896b;transition:width .3s}.yc7-inventory-item.low .yc7-inventory-meter span{background:#bd7159}.yc7-inventory-restock{margin-top:auto;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}.yc7-inventory-restock input{width:100%;min-width:0;min-height:40px;border:1px solid #ddcbb9;padding:9px;background:#fff;font-size:12px;color:#35271f}.yc7-inventory-restock button{background:#38291f;color:#fff;border:0;padding:10px 12px;font-size:10px;font-weight:800;display:flex;align-items:center;gap:7px}.yc7-inventory-restock button:disabled{opacity:.5;cursor:not-allowed}.yc7-inventory-help{font-size:11px;line-height:1.8;background:#efe7db;padding:14px 17px;color:#80674e}.yc7-inventory-notice{padding:13px 16px;color:#4d6c49;background:#e8eee4;font-size:11px;line-height:1.7}.yc7-inventory-notice.error{color:#a45244;background:#fae8e2}.yc7-inventory-movements{padding:20px;border:1px solid #e5d4c2;background:#fffaf3}.yc7-inventory-movements h2{font:600 31px 'Cormorant Garamond',serif;margin:0 0 10px}.yc7-inventory-movements .movement{padding:12px 0;display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;border-top:1px solid #ecdfcd}.yc7-inventory-movements .movement strong{font-size:11px}.yc7-inventory-movements .movement small{font-size:10px;color:#927e6b}.yc7-inventory-empty{padding:45px 15px;text-align:center;grid-column:1/-1;color:#947b65;font-size:12px}
@media(max-width:1160px){.yc7-inventory-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:720px){.yc7-inventory-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.yc7-inventory-grid{grid-template-columns:1fr}}
@media(max-width:420px){.yc7-inventory-controls input,.yc7-inventory-controls select{width:100%}}
`;

function StockItem({ stock, onResult }) {
  const [amount, setAmount] = useState(stock.unit === "piece" ? "10" : "500");
  const { actions } = useCafe();
  const low = stock.quantity <= stock.lowStockAt;
  const baseline = Math.max(initialStocks[stock.id] || 1, stock.lowStockAt * 2, 1);
  const percent = Math.min(100, Math.max(0,(stock.quantity / baseline)*100));
  const addStock = (event) => {
    event.preventDefault();
    const n = Number(amount);
    if (!Number.isInteger(n) || n <= 0 || n > 100000) {onResult({error:true,text:"Restock quantity must be a whole number from 1 to 100,000."});return;}
    const result = actions.restockInventory(stock.id,n);
    onResult({error:!result.ok,text:result.ok?`${stock.name}: +${integer(n)} ${stock.unit} added to demo stock.`:result.error});
  };
  return <article className={`yc7-inventory-item ${low?"low":""}`}>
    <div className="yc7-inventory-item-head"><span className="yc7-inventory-icon"><Coffee size={19}/></span><span className={`yc7-inventory-badge ${low?"low":""}`}>{low?"LOW STOCK":"AVAILABLE"}</span></div>
    <h3>{stock.name}</h3><div className="amount">{integer(stock.quantity)} <small>{stock.unit}</small></div>
    <div className="yc7-inventory-meter" role="meter" aria-label={`${stock.name} stock level relative to sample starting stock`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)}><span style={{width:`${percent}%`}}/></div>
    <p>Low stock at {integer(stock.lowStockAt)} {stock.unit}. Starting demonstration stock: {integer(initialStocks[stock.id]||0)} {stock.unit}.</p>
    <form className="yc7-inventory-restock" onSubmit={addStock}><input aria-label={`Restock quantity for ${stock.name}`} type="number" min="1" max="100000" step="1" value={amount} onChange={(e)=>setAmount(e.target.value)} required/><button type="submit"><PackagePlus size={14}/> Restock</button></form>
  </article>;
}

export default function InventoryPage() {
  const { inventory, orders, events } = useCafe();
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("all");
  const [sort,setSort] = useState("name");
  const [notice,setNotice] = useState(null);
  const lowStock = inventory.filter((i)=>i.quantity<=i.lowStockAt);
  const completed = orders.filter((o)=>o.status==="completed"&&o.inventoryDeducted).length;
  const visible = useMemo(()=>inventory.filter((i)=>i.name.toLowerCase().includes(search.trim().toLowerCase()) && (filter==="all" || (filter==="low" ? i.quantity<=i.lowStockAt : i.quantity>i.lowStockAt))).sort((a,b)=>sort==="lowest"?(a.quantity/Math.max(1,a.lowStockAt))-(b.quantity/Math.max(1,b.lowStockAt)):a.name.localeCompare(b.name)),[inventory,search,filter,sort]);
  const inventoryEvents = events.filter((e)=>e.type==="inventory" || e.type==="order").slice(0,8);
  return <section className="yc7-inventory"><style>{css}</style>
    <header className="yc7-inventory-head"><div><span className="yc7-inventory-kicker">CAFÉ OPERATIONS · STOCK CONTROL</span><h1>Thoughtfully stocked.</h1><p>Track demo café ingredients, packaging and pastries based on recorded orders.</p></div><Link to="/staff/orders" style={{fontSize:11,color:"#74563a",display:"flex",alignItems:"center",gap:8}}>Barista queue <ArrowRight size={15}/></Link></header>
    <div className="yc7-inventory-metrics">
      <div className="yc7-inventory-metric"><span>STOCK ITEMS</span><strong>{inventory.length}</strong></div>
      <div className="yc7-inventory-metric"><span>LOW STOCK ALERTS</span><strong>{lowStock.length}</strong></div>
      <div className="yc7-inventory-metric"><span>HEALTHY STOCKS</span><strong>{inventory.length-lowStock.length}</strong></div>
      <div className="yc7-inventory-metric"><span>FULFILLED ORDERS</span><strong>{completed}</strong></div>
    </div>
    <div className="yc7-inventory-controls"><Search size={18}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search coffee beans, milk, cups..." aria-label="Search inventory"/><select value={filter} onChange={(e)=>setFilter(e.target.value)} aria-label="Filter stock"><option value="all">All items</option><option value="low">Low stock</option><option value="healthy">Healthy stock</option></select><select value={sort} onChange={(e)=>setSort(e.target.value)} aria-label="Sort stock"><option value="name">By name</option><option value="lowest">Lowest relative stock</option></select></div>
    {notice&&<p role={notice.error?"alert":"status"} className={`yc7-inventory-notice ${notice.error?"error":""}`}>{notice.text}</p>}
    {lowStock.length>0&&<p className="yc7-inventory-help"><AlertTriangle size={15} style={{verticalAlign:"middle"}}/> {lowStock.length} demo ingredient(s) have reached their low-stock threshold. Restock before fulfilling orders requiring unavailable ingredients.</p>}
    <div className="yc7-inventory-grid">{visible.length?visible.map((item)=><StockItem key={item.id} stock={item} onResult={setNotice}/>):<div className="yc7-inventory-empty"><Boxes size={29}/><p>No stock items match the filters.</p></div>}</div>
    <div className="yc7-inventory-movements"><h2>Recent stock-related activity</h2>{inventoryEvents.length===0&&<p style={{fontSize:12,color:"#8b7665"}}>No order fulfillment or restocking activity yet.</p>}{inventoryEvents.map((e)=><div className="movement" key={e.id}><strong>{e.text}</strong><small>{new Date(e.at).toLocaleString("en-PH")}</small></div>)}</div>
    <p className="yc7-inventory-help"><TrendingDown size={15} style={{verticalAlign:"middle"}}/> Recipe ingredients are deducted once by the existing management engine when an order moves from READY to COMPLETED. This page does not independently deduct stock. All values are local demo records.</p>
  </section>;
}
