// YOUR CAFÉ — Staff Point of Sale / Batch 7
// All ordering and payment actions are LOCAL DEMONSTRATIONS.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Coffee, CreditCard, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import { MENU_ITEMS, MENU_CATEGORIES, PAYMENT_METHODS, DRINK_SIZES, MILK_OPTIONS, SWEETNESS_OPTIONS, DRINK_EXTRAS, getCustomizationProfile, formatPeso } from "../../data/config.js";
import { quoteCart, quoteMenuItem } from "../../engine/cafeEngine.js";
import { useCafe } from "../../context/CafeContext.jsx";

const css = `
.yc7-pos{min-width:0;color:#372820;display:grid;gap:20px}.yc7-pos *{box-sizing:border-box}.yc7-pos-head{display:flex;justify-content:space-between;align-items:end;gap:15px;flex-wrap:wrap}.yc7-pos-head small,.yc7-pos-kicker{font-size:10px;letter-spacing:.14em;color:#a17d5e;font-weight:800}.yc7-pos h1{font:600 clamp(42px,5vw,64px)/.97 'Cormorant Garamond',serif;margin:7px 0 0}.yc7-pos-head p{color:#8d7864;font-size:12px;margin:11px 0 0;line-height:1.6}.yc7-pos-note{font-size:10px;background:#e9eee5;color:#597154;padding:11px 14px}.yc7-pos-layout{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(300px,.9fr);gap:18px;align-items:start}.yc7-pos-left{min-width:0;display:grid;gap:14px}.yc7-pos-toolbar{display:flex;gap:10px;flex-wrap:wrap;background:#fffaf3;border:1px solid #e6d8c6;padding:13px}.yc7-pos-toolbar input{flex:1;min-width:180px;border:1px solid #dac7b2;padding:11px 13px;background:#fff;color:#3c2b20;font-size:12px}.yc7-pos-tags{display:flex;gap:7px;flex-wrap:wrap}.yc7-pos-tags button{border:1px solid #ddcbb8;background:#fffaf3;color:#775f46;padding:8px 11px;font-size:10px}.yc7-pos-tags button.active{background:#38281f;color:#fff}.yc7-pos-products{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.yc7-pos-product{border:1px solid #e1d2bf;background:#fffaf4;text-align:left;padding:0;color:inherit;overflow:hidden;min-width:0;transition:transform .2s,border-color .2s}.yc7-pos-product:hover{transform:translateY(-3px);border-color:#a47c52}.yc7-pos-product img{width:100%;height:130px;object-fit:cover}.yc7-pos-product div{padding:13px;display:grid;gap:8px}.yc7-pos-product small{font-size:9px;text-transform:uppercase;color:#9c7a55}.yc7-pos-product strong{font:600 21px/1.05 'Cormorant Garamond',serif;overflow-wrap:anywhere}.yc7-pos-product span{color:#5b4636;font-size:12px;font-weight:800}.yc7-pos-side{position:sticky;top:86px;display:grid;gap:15px;min-width:0}.yc7-pos-card{background:#fffaf3;border:1px solid #e4d5c1;padding:21px;min-width:0}.yc7-pos-card h2{font:600 32px/1 'Cormorant Garamond',serif;margin:0 0 15px}.yc7-pos-field{display:grid;gap:7px;margin-bottom:14px;font-size:10px;font-weight:800;letter-spacing:.07em;color:#8c6f53}.yc7-pos-field input,.yc7-pos-field select,.yc7-pos-field textarea{width:100%;min-width:0;padding:12px;background:#fff;border:1px solid #dbcab8;color:#3c3029;font-size:12px}.yc7-pos-field textarea{min-height:70px;resize:vertical}.yc7-pos-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.yc7-pos-extra{display:flex;align-items:center;gap:7px;padding:10px;background:#f5ebdd;font-size:11px;letter-spacing:0;font-weight:500}.yc7-pos-extra input{width:auto}.yc7-pos-add,.yc7-pos-checkout{width:100%;border:0;background:#38291f;color:white;padding:14px;display:flex;align-items:center;justify-content:center;gap:8px;font-size:11px;font-weight:800}.yc7-pos-add:disabled,.yc7-pos-checkout:disabled{opacity:.45;cursor:not-allowed}.yc7-pos-items{display:grid;gap:10px}.yc7-pos-line{border-bottom:1px solid #ebdfd0;padding-bottom:11px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px}.yc7-pos-line b{font-size:11px;display:block}.yc7-pos-line small{font-size:10px;color:#9b8068;overflow-wrap:anywhere}.yc7-pos-line strong{font-size:12px}.yc7-pos-line-controls{display:flex;align-items:center;gap:10px;margin-top:9px}.yc7-pos-line-controls button{border:1px solid #ddcbb9;background:none;padding:5px;display:grid;place-items:center}.yc7-pos-total{border-top:1px solid #e6d5c2;margin-top:12px;padding-top:12px;display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:11px}.yc7-pos-total strong{font-size:20px}.yc7-pos-msg{font-size:11px;padding:11px 14px;background:#e8efe3;color:#4c6d49;line-height:1.6}.yc7-pos-msg.error{background:#f8e6e1;color:#a35443}.yc7-pos-empty{color:#987e66;font-size:12px;line-height:1.7}.yc7-pos-recent{border:1px solid #eadac7;background:#fff9f1;padding:18px}.yc7-pos-recent h3{font:600 27px 'Cormorant Garamond',serif;margin:0 0 13px}.yc7-pos-recent-row{display:flex;gap:12px;justify-content:space-between;align-items:center;flex-wrap:wrap;border-top:1px solid #eddfcf;padding:11px 0}.yc7-pos-recent-row small{font-size:10px;color:#997f68}.yc7-pos-recent-row strong{font-size:11px}.yc7-pos-recent-row button{padding:8px 11px;border:1px solid #c6ad93;background:#fffaf5;font-size:10px}
@media(max-width:1170px){.yc7-pos-products{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:900px){.yc7-pos-layout{grid-template-columns:1fr}.yc7-pos-side{position:static}.yc7-pos-products{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:600px){.yc7-pos-products{grid-template-columns:repeat(2,minmax(0,1fr))}.yc7-pos-product img{height:105px}.yc7-pos-product strong{font-size:18px}.yc7-pos-card{padding:16px}}
@media(max-width:380px){.yc7-pos-options{grid-template-columns:1fr}.yc7-pos-products{grid-template-columns:1fr}.yc7-pos-product img{height:170px}}
`;

const defaultOptions = (product) => {
  const profile = getCustomizationProfile(product.customizationProfile);
  const temperatures = product.allowedTemperatures || profile.temperatures;
  return {
    ...(profile.sizes.length ? { size: profile.sizes.includes("medium") ? "medium" : profile.sizes[0] } : {}),
    ...(temperatures.length ? { temperature: temperatures[0] } : {}),
    ...(profile.milks.length ? { milk: profile.milks.includes("dairy") ? "dairy" : profile.milks[0] } : {}),
    ...(profile.sweetness ? { sweetness: "regular" } : {}),
    extras: [],
  };
};
const keyFor = (productId, options) => JSON.stringify([productId,options]);

export default function POSPage() {
  const { tables, orders, actions } = useCafe();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState({});
  const [qty, setQty] = useState(1);
  const [draft, setDraft] = useState([]);
  const [type, setType] = useState("pickup");
  const [tableId, setTableId] = useState("");
  const [nickname, setNickname] = useState("");
  const [note, setNote] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [markPaid, setMarkPaid] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const visible = MENU_ITEMS.filter((p) => p.available && (category === "all" || p.categoryId === category) && `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase()));
  const profile = selected ? getCustomizationProfile(selected.customizationProfile) : null;
  const temps = selected ? (selected.allowedTemperatures || profile.temperatures) : [];
  const quotedProduct = useMemo(() => {
    if (!selected) return { value: null, error: "" };
    try { return { value: quoteMenuItem(selected.id, qty, options), error: "" }; }
    catch (err) { return { value: null, error: err.message }; }
  }, [selected,qty,options]);
  const quotation = useMemo(() => {
    if (!draft.length) return { value: null, error: "" };
    try { return { value: quoteCart(draft, promoCode), error: "" }; }
    catch (err) { return { value: null, error: err.message }; }
  }, [draft,promoCode]);
  const eligibleTables = tables.filter((t) => t.status === "occupied" && t.visit);
  const addDraft = () => {
    if (!selected || !quotedProduct.value) return;
    const newLine = { key: keyFor(selected.id, quotedProduct.value.options), productId: selected.id, options: quotedProduct.value.options, quantity: qty };
    setDraft((prev) => {
      const exists = prev.find((p) => p.key === newLine.key);
      if (exists) return prev.map((p) => p.key===newLine.key ? { ...p, quantity: Math.min(30,p.quantity+qty) } : p);
      return [...prev,newLine];
    });
    setSelected(null);setQty(1);setFeedback(null);
  };
  const checkout = (event) => {
    event.preventDefault();setFeedback(null);
    if (!quotation.value) { setFeedback({error:true,text:quotation.error||"Add products first."});return; }
    const result = actions.placeOrder({ type, ...(type === "dinein" && tableId ? { tableId } : {}),nickname,note,promoCode,items:draft.map(({productId,quantity,options})=>({productId,quantity,options})) });
    if (!result.ok) { setFeedback({error:true,text:result.error});return; }
    const created = result.state.orders[0];
    let paymentText = "Payment pending";
    if (markPaid) {
      const paid = actions.recordPayment(created.id,paymentMethod);
      paymentText = paid.ok ? `Demo payment recorded via ${paymentMethod}` : `Order saved, but payment failed: ${paid.error}`;
    }
    setFeedback({error:false,text:`${created.reference} created · ${paymentText}.`});
    setDraft([]);setPromoCode("");setNote("");setNickname("");setTableId("");setMarkPaid(false);
  };
  return <section className="yc7-pos"><style>{css}</style>
    <header className="yc7-pos-head"><div><small>FRONT COUNTER · ORDER ENTRY</small><h1>The café point of sale.</h1><p>Compose drinks, send demo orders to the barista, and optionally record a simulated payment.</p></div><span className="yc7-pos-note">LOCAL PROTOTYPE · NO REAL PAYMENTS</span></header>
    {feedback && <div className={`yc7-pos-msg ${feedback.error ? "error" : ""}`} role={feedback.error ? "alert":"status"}>{feedback.text}</div>}
    <div className="yc7-pos-layout"><div className="yc7-pos-left">
      <div className="yc7-pos-toolbar"><Search size={18}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search espresso, matcha, croissants..." aria-label="Search products"/></div>
      <div className="yc7-pos-tags">{MENU_CATEGORIES.map((c)=><button key={c.id} type="button" className={category===c.id?"active":""} onClick={()=>setCategory(c.id)}>{c.name}</button>)}</div>
      <div className="yc7-pos-products">{visible.length===0&&<p className="yc7-pos-empty">No matching items.</p>}{visible.map((p)=><button type="button" key={p.id} className="yc7-pos-product" onClick={()=>{setSelected(p);setOptions(defaultOptions(p));setQty(1);}}><img src={p.image} alt="" loading="lazy"/><div><small>{MENU_CATEGORIES.find((c)=>c.id===p.categoryId)?.name}</small><strong>{p.name}</strong><span>{formatPeso(p.price)} <Plus size={13} style={{verticalAlign:"middle"}}/></span></div></button>)}</div>
    </div><aside className="yc7-pos-side">
      {selected&&<section className="yc7-pos-card"><div style={{display:"flex",justifyContent:"space-between",gap:8}}><h2>Customize your selection.</h2><button type="button" onClick={()=>setSelected(null)} aria-label="Close product" style={{border:0,background:"none",alignSelf:"start"}}><X size={19}/></button></div><p className="yc7-pos-empty">{selected.name}</p>
        <div className="yc7-pos-options">
          {profile.sizes.length>0&&<label className="yc7-pos-field">SIZE<select value={options.size||""} onChange={(e)=>setOptions((o)=>({...o,size:e.target.value}))}>{DRINK_SIZES.filter((s)=>profile.sizes.includes(s.id)).map((s)=><option value={s.id} key={s.id}>{s.name}</option>)}</select></label>}
          {temps.length>0&&<label className="yc7-pos-field">TEMPERATURE<select value={options.temperature||""} onChange={(e)=>setOptions((o)=>({...o,temperature:e.target.value}))}>{temps.map((t)=><option key={t} value={t}>{t=== "hot"?"Hot":"Iced"}</option>)}</select></label>}
          {profile.milks.length>0&&<label className="yc7-pos-field">MILK<select value={options.milk||""} onChange={(e)=>setOptions((o)=>({...o,milk:e.target.value}))}>{MILK_OPTIONS.filter((m)=>profile.milks.includes(m.id)).map((m)=><option key={m.id} value={m.id}>{m.name} (+{formatPeso(m.priceDelta)})</option>)}</select></label>}
          {profile.sweetness&&<label className="yc7-pos-field">SWEETNESS<select value={options.sweetness||"regular"} onChange={(e)=>setOptions((o)=>({...o,sweetness:e.target.value}))}>{SWEETNESS_OPTIONS.map((s)=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}
        </div>
        {profile.extras.length>0&&<div style={{display:"grid",gap:6,marginBottom:12}}><span className="yc7-pos-kicker">OPTIONAL EXTRAS</span>{DRINK_EXTRAS.filter((x)=>profile.extras.includes(x.id)).map((x)=><label key={x.id} className="yc7-pos-extra"><input type="checkbox" checked={(options.extras||[]).includes(x.id)} onChange={(e)=>setOptions((o)=>({...o,extras:e.target.checked?[...(o.extras||[]),x.id]:(o.extras||[]).filter((a)=>a!==x.id)}))}/>{x.name} · +{formatPeso(x.price)}</label>)}</div>}
        <label className="yc7-pos-field">QUANTITY<input type="number" min="1" max="30" value={qty} onChange={(e)=>setQty(Math.max(1,Math.min(30,Number(e.target.value)||1)))}/></label>
        {quotedProduct.error&&<p className="yc7-pos-msg error">{quotedProduct.error}</p>}
        <button type="button" className="yc7-pos-add" disabled={!quotedProduct.value} onClick={addDraft}><Plus size={15}/> Add to ticket · {formatPeso(quotedProduct.value?.lineTotal || 0)}</button>
      </section>}
      <form className="yc7-pos-card" onSubmit={checkout}><h2>Current ticket.</h2>
        {draft.length===0?<p className="yc7-pos-empty"><ShoppingBag size={19}/> Select a product to begin a new order.</p>:<div className="yc7-pos-items">{draft.map((line)=>{const q=quoteMenuItem(line.productId,line.quantity,line.options);return <div key={line.key} className="yc7-pos-line"><div><b>{q.name}</b><small>{[q.options.size,q.options.temperature,q.options.milk,...q.options.extras].filter(Boolean).join(" · ")||"Standard"}</small><div className="yc7-pos-line-controls"><button type="button" aria-label="Decrease" onClick={()=>setDraft((a)=>a.map((p)=>p.key===line.key?{...p,quantity:p.quantity-1}:p).filter((p)=>p.quantity>0))}><Minus size={12}/></button>{line.quantity}<button type="button" aria-label="Increase" disabled={line.quantity>=30} onClick={()=>setDraft((a)=>a.map((p)=>p.key===line.key?{...p,quantity:Math.min(30,p.quantity+1)}:p))}><Plus size={12}/></button><button type="button" aria-label="Remove" onClick={()=>setDraft((a)=>a.filter((p)=>p.key!==line.key))}><Trash2 size={12}/></button></div></div><strong>{formatPeso(q.lineTotal)}</strong></div>;})}</div>}
        <label className="yc7-pos-field">FULFILLMENT<select value={type} onChange={(e)=>{setType(e.target.value);if(e.target.value!=="dinein")setTableId("");}}><option value="pickup">Pickup / Counter</option><option value="dinein">Dine-in</option></select></label>
        {type==="dinein"&&<label className="yc7-pos-field">TABLE (OPTIONAL)<select value={tableId} onChange={(e)=>setTableId(e.target.value)}><option value="">No assigned table / counter</option>{eligibleTables.map((t)=><option key={t.id} value={t.id}>{t.id} · {t.visit.nickname}</option>)}</select></label>}
        <label className="yc7-pos-field">GUEST NICKNAME<input maxLength="40" value={nickname} onChange={(e)=>setNickname(e.target.value)} placeholder="Optional"/></label>
        <label className="yc7-pos-field">ORDER NOTE<textarea maxLength="220" value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Preparation instructions"/></label>
        <label className="yc7-pos-field">PROMO CODE<input value={promoCode} onChange={(e)=>setPromoCode(e.target.value.toUpperCase())} placeholder="Optional"/></label>
        {quotation.error&&<p className="yc7-pos-msg error" role="alert">{quotation.error}</p>}
        <div className="yc7-pos-total"><span>Subtotal</span><b>{formatPeso(quotation.value?.subtotal||0)}</b></div><div className="yc7-pos-total"><span>Discount</span><b>− {formatPeso(quotation.value?.discount||0)}</b></div><div className="yc7-pos-total"><strong>Total</strong><strong>{formatPeso(quotation.value?.total||0)}</strong></div>
        <label style={{display:"flex",alignItems:"center",gap:10,fontSize:11,margin:"15px 0"}}><input type="checkbox" checked={markPaid} onChange={(e)=>setMarkPaid(e.target.checked)}/> Record simulated payment after order creation</label>
        {markPaid&&<label className="yc7-pos-field">DEMO PAYMENT METHOD<select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)}>{PAYMENT_METHODS.map((p)=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label>}
        <button type="submit" className="yc7-pos-checkout" disabled={!quotation.value}><CreditCard size={17}/> Send order to barista <ArrowRight size={15}/></button>
        <p className="yc7-pos-empty">No money is collected. Orders are stored only in local browser data.</p>
      </form>
      <div className="yc7-pos-recent"><h3>Recent tickets</h3>{orders.length===0&&<p className="yc7-pos-empty">No orders yet.</p>}{orders.slice(0,5).map((o)=><div className="yc7-pos-recent-row" key={o.id}><div><strong>{o.reference}</strong><br/><small>{o.status} · {formatPeso(o.total)} · {o.paymentStatus}</small></div>{o.paymentStatus!=="paid"&&o.status!=="cancelled"&&<button type="button" onClick={()=>{const r=actions.recordPayment(o.id,paymentMethod);setFeedback({error:!r.ok,text:r.ok?"Demo payment recorded.":r.error});}}>Mark paid</button>}</div>)}<Link to="/staff/orders" style={{fontSize:11,color:"#735537",display:"inline-flex",gap:8,alignItems:"center"}}>Open barista queue <ArrowRight size={13}/></Link></div>
    </aside></div>
  </section>;
}
