// YOUR CAFÉ — Batch 11 / Staff Menu Management
// Local draft editor: does not silently modify the shared MENU_ITEMS catalog.
import { useEffect, useMemo, useState } from "react";
import { Download, Edit3, Eye, EyeOff, Search, Save, RotateCcw, Coffee } from "lucide-react";
import { MENU_CATEGORIES, MENU_ITEMS, formatPeso } from "../../data/config.js";

const STORAGE_KEY = "your-cafe-concept-menu-drafts-v1";
function readDrafts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch { return {}; }
}
function download(name, content) {
  const url = URL.createObjectURL(new Blob([content], { type: "application/json;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const money = (n) => Number(n || 0);
const styles = `
.yc11-menu{display:grid;gap:21px;color:#37291e;min-width:0}.yc11-menu *{box-sizing:border-box}
.yc11-menu header{display:flex;justify-content:space-between;gap:15px;align-items:flex-end;flex-wrap:wrap}
.yc11-menu h1{font:500 clamp(43px,5vw,67px)/.98 'Cormorant Garamond',Georgia,serif;margin:8px 0;color:#38271b}
.yc11-menu h2{font:500 31px 'Cormorant Garamond',Georgia,serif;margin:0 0 16px}
.yc11-menu p{margin:5px 0;font-size:12px;line-height:1.7;color:#806e5b}
.yc11-menu .overline{font-size:10px;letter-spacing:.18em;font-weight:800;color:#a17f5b}
.yc11-menu .notice{padding:15px 17px;background:#eee8dd;border-left:3px solid #ac855d;color:#6a543f;font-size:11px;line-height:1.7}
.yc11-menu .toolbar{background:#fffbf5;border:1px solid #e7d8c6;padding:16px;display:flex;gap:9px;flex-wrap:wrap;align-items:center}
.yc11-menu input,.yc11-menu select,.yc11-menu textarea{padding:12px 13px;border:1px solid #d9c7b2;background:#fffdf9;color:#33271f;font-size:12px;width:100%;min-width:0}
.yc11-menu .toolbar input{flex:1;min-width:170px}.yc11-menu .toolbar select{max-width:230px}.yc11-menu button{cursor:pointer}
.yc11-menu .button{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 16px;border:1px solid #493328;background:#38271e;color:#fff9ed;font-size:11px;font-weight:750;min-height:42px}
.yc11-menu .button.light{background:#fff9f1;color:#503c2c;border-color:#d6c1aa}.yc11-menu .button:disabled{opacity:.45;cursor:not-allowed}
.yc11-menu .metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.yc11-menu .metric{padding:17px;background:#fffaf4;border:1px solid #e8d9c5}.yc11-menu .metric span{display:block;font-size:10px;color:#977b60}.yc11-menu .metric strong{display:block;font:500 32px 'Cormorant Garamond',serif;margin-top:5px}
.yc11-menu .layout{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(290px,.8fr);gap:17px;align-items:start}
.yc11-menu .catalog{display:grid;gap:9px;min-width:0}.yc11-menu .item{width:100%;display:grid;grid-template-columns:66px minmax(0,1fr) auto;gap:13px;align-items:center;text-align:left;padding:9px;background:#fffaf4;border:1px solid #e6d7c5;color:#36291f}.yc11-menu .item.active{border-color:#92704c;box-shadow:0 0 0 1px #92704c inset}.yc11-menu .item img{width:66px;height:68px;object-fit:cover;background:#e6d9c6}.yc11-menu .item strong{font-size:12px;display:block}.yc11-menu .item small{font-size:10px;color:#9b8066;display:block;margin-top:6px}.yc11-menu .item b{font-size:12px;white-space:nowrap}.yc11-menu .pill{display:inline-flex;align-items:center;gap:5px;padding:5px 7px;margin-top:5px;background:#e7eddf;color:#506447;font-size:9px!important}.yc11-menu .pill.off{background:#f2e6e1;color:#985c43}
.yc11-menu .editor{position:sticky;top:88px;background:#fffaf3;border:1px solid #e4d2bb;padding:22px;display:grid;gap:12px;min-width:0}.yc11-menu .editor-image{width:100%;height:170px;object-fit:cover}.yc11-menu label{font-size:10px;letter-spacing:.06em;color:#886d55;font-weight:800;display:grid;gap:6px}.yc11-menu textarea{resize:vertical;min-height:76px}.yc11-menu .check{display:flex;align-items:center;gap:9px;letter-spacing:0;font-size:11px;font-weight:600}.yc11-menu .check input{width:auto}.yc11-menu .actions{display:flex;flex-wrap:wrap;gap:8px}.yc11-menu .empty{background:#fffbf5;padding:25px;font-size:12px;color:#85705d}.yc11-menu .success{padding:11px 14px;background:#eaf0e6;color:#4b7043;font-size:11px}
@media(max-width:950px){.yc11-menu .layout{grid-template-columns:1fr}.yc11-menu .editor{position:static}.yc11-menu .metrics{grid-template-columns:repeat(3,1fr)}}
@media(max-width:550px){.yc11-menu .metrics{grid-template-columns:1fr}.yc11-menu .item{grid-template-columns:56px minmax(0,1fr)}.yc11-menu .item img{width:56px;height:60px}.yc11-menu .item>b{grid-column:2}.yc11-menu header .button{width:100%}}
`;
const defaults = (product) => ({ name: product.name, price: Number(product.price), description: product.description || "", available: product.available !== false, featured: Boolean(product.featured) });

export default function MenuManagementPage() {
  const [drafts, setDrafts] = useState(readDrafts);
  const [selectedId, setSelectedId] = useState(MENU_ITEMS[0]?.id || "");
  const [form, setForm] = useState(() => defaults(MENU_ITEMS[0] || { name: "", price: 0 }));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const selected = MENU_ITEMS.find((p) => p.id === selectedId);
  useEffect(() => {
    if (selected) setForm({ ...defaults(selected), ...(drafts[selected.id] || {}) });
  }, [selectedId]);
  const visible = useMemo(() => MENU_ITEMS.filter((p) => {
    const d = { ...defaults(p), ...(drafts[p.id] || {}) };
    return (category === "all" || p.categoryId === category) &&
      `${p.name} ${d.name} ${d.description}`.toLowerCase().includes(query.toLowerCase()) &&
      (!status || (status === "drafts" ? Boolean(drafts[p.id]) : status === "hidden" ? !d.available : d.available));
  }), [drafts, query, category, status]);
  const select = (p) => { setSelectedId(p.id); setForm({ ...defaults(p), ...(drafts[p.id] || {}) }); setFeedback(""); };
  const save = (e) => {
    e.preventDefault();
    if (!selected) return;
    const name = form.name.trim(); const price = Number(form.price);
    if (!name || name.length > 90 || !Number.isFinite(price) || price < 0 || price > 100000) { setFeedback("Enter a product name and valid PHP price (0–100,000)."); return; }
    const next = { ...drafts, [selected.id]: { ...form, name, description: form.description.trim().slice(0, 260), price } };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setDrafts(next); setFeedback("Draft saved in this browser. Live menu remains unchanged."); }
    catch { setFeedback("Browser storage is unavailable; draft was not saved."); }
  };
  const discard = () => {
    if (!selected || !drafts[selected.id] || !window.confirm(`Discard the local draft for ${selected.name}?`)) return;
    const next = { ...drafts }; delete next[selected.id];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setDrafts(next); setForm(defaults(selected)); setFeedback("Draft discarded."); }
    catch { setFeedback("Could not update browser storage."); }
  };
  return <section className="yc11-menu"><style>{styles}</style>
    <header><div><span className="overline">OPERATIONS / PRODUCT STUDIO</span><h1>Curate the café menu.</h1><p>Explore products, prepare pricing and visibility drafts, and export changes for development.</p></div><button className="button light" type="button" onClick={() => download("your-cafe-menu-drafts.json", JSON.stringify({ exportedAt: new Date().toISOString(), drafts }, null, 2))}><Download size={16}/> Export drafts</button></header>
    <div className="notice"><strong>Draft-only mode:</strong> This version's ordering engine imports a static `MENU_ITEMS` catalog. Edits here are real locally saved drafts, but they do <strong>not</strong> change customer prices, product availability, inventory recipes or POS totals. Those require a coordinated catalog/engine update or backend.</div>
    <div className="metrics"><div className="metric"><span>Catalog products</span><strong>{MENU_ITEMS.length}</strong></div><div className="metric"><span>Saved edits</span><strong>{Object.keys(drafts).filter((id) => MENU_ITEMS.some((p) => p.id === id)).length}</strong></div><div className="metric"><span>Draft hidden products</span><strong>{MENU_ITEMS.filter((p) => ({ ...defaults(p), ...(drafts[p.id] || {}) }).available === false).length}</strong></div></div>
    <div className="toolbar"><Search size={17}/><input aria-label="Search products" placeholder="Search catalog..." value={query} onChange={(e) => setQuery(e.target.value)}/><select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Menu category">{MENU_CATEGORIES.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}</select><select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Draft filter"><option value="">All products</option><option value="drafts">Edited drafts</option><option value="visible">Visible in draft</option><option value="hidden">Hidden in draft</option></select></div>
    <div className="layout"><div className="catalog">{visible.length === 0 ? <div className="empty">No matching products.</div> : visible.map((p) => { const d = { ...defaults(p), ...(drafts[p.id] || {}) }; return <button type="button" key={p.id} className={`item ${p.id === selectedId ? "active" : ""}`} onClick={() => select(p)}><img src={p.image} alt="" loading="lazy"/><span><strong>{d.name}</strong><small>{p.categoryId} · {p.id}</small><small className={`pill ${!d.available ? "off" : ""}`}>{d.available ? <Eye size={11}/> : <EyeOff size={11}/>} {d.available ? "Draft visible" : "Draft hidden"}{drafts[p.id] ? " · edited" : ""}</small></span><b>{formatPeso(money(d.price))}</b></button>; })}</div>
      {selected ? <form className="editor" onSubmit={save}><span className="overline"><Edit3 size={13} style={{verticalAlign:"middle"}}/> LOCAL PRODUCT DRAFT</span><img className="editor-image" src={selected.image} alt=""/><h2>{selected.name}</h2><label>DISPLAY NAME<input value={form.name} maxLength={90} required onChange={(e) => setForm((x) => ({ ...x, name: e.target.value }))}/></label><label>PRICE (PHP)<input value={form.price} type="number" min="0" max="100000" step="0.01" required onChange={(e) => setForm((x) => ({ ...x, price: e.target.value }))}/></label><label>DESCRIPTION<textarea value={form.description} maxLength={260} onChange={(e) => setForm((x) => ({ ...x, description: e.target.value }))}/></label><label className="check"><input type="checkbox" checked={form.available} onChange={(e) => setForm((x) => ({ ...x, available: e.target.checked }))}/> <Eye size={15}/> Visible in draft</label><label className="check"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((x) => ({ ...x, featured: e.target.checked }))}/> <Coffee size={15}/> Featured in draft</label>{feedback && <div className="success" role="status">{feedback}</div>}<div className="actions"><button className="button" type="submit"><Save size={15}/> Save draft</button><button className="button light" type="button" onClick={discard} disabled={!drafts[selected.id]}><RotateCcw size={15}/> Discard</button></div></form> : <div className="empty">No product selected.</div>}</div>
  </section>;
}
