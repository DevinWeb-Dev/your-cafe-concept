// YOUR CAFÉ — Batch 6 / checkout and ordering
// Frontend-only: no orders leave this browser and no money is collected.
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Coffee, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatPeso } from "../../data/config.js";
import { quoteCart } from "../../engine/cafeEngine.js";
import { useCafe } from "../../context/CafeContext.jsx";

function choicesSummary(options = {}) {
  return [options.size, options.temperature, options.milk, options.sweetness,
    ...(options.extras || [])].filter(Boolean).join(" · ") || "Original preparation";
}

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, cartPreview, cartActions, placeCartOrder, tables } = useCafe();
  const [orderType, setOrderType] = useState("pickup");
  const [selectedTable, setSelectedTable] = useState("");
  const [nickname, setNickname] = useState("");
  const [note, setNote] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const quotation = useMemo(() => {
    if (!cart.length) return { data: cartPreview, error: "" };
    try { return { data: quoteCart(cart, promoCode), error: "" }; }
    catch (e) { return { data: cartPreview, error: e.message }; }
  }, [cart, cartPreview, promoCode]);

  const seatedTables = tables.filter((t) => t.visit);

  function checkout(event) {
    event.preventDefault();
    setError("");
    if (!cart.length) return setError("Your basket is empty.");
    if (quotation.error) return setError(quotation.error);
    if (orderType === "dinein" && selectedTable && !seatedTables.some((t) => t.id === selectedTable)) {
      return setError("Choose an occupied table or leave the order unassigned.");
    }
    setBusy(true);
    try {
      const result = placeCartOrder({
        type: orderType,
        tableId: orderType === "dinein" && selectedTable ? selectedTable : null,
        nickname,
        note,
        promoCode,
      });
      if (result.ok) navigate("/orders");
      else setError(result.error || "Could not place the demonstration order.");
    } finally { setBusy(false); }
  }

  return (
    <section className="yc6-cart section cream page-section">
      <style>{`
        .yc6-cart{color:#302824}.yc6-cart .yc6-kicker{font-size:10px;font-weight:700;color:#a07850;letter-spacing:.2em}
        .yc6-cart .yc6-head{padding:10px 0 35px}.yc6-cart h1{font:500 clamp(62px,8vw,112px)/.92 'Cormorant Garamond',Georgia,serif;letter-spacing:-.035em;margin:14px 0}
        .yc6-cart h1 em{font-weight:400;color:#b58b5a}.yc6-cart .yc6-head p{font-size:13px;line-height:1.8;color:#8d7866}
        .yc6-cart .yc6-grid{display:grid;grid-template-columns:minmax(0,1.28fr) minmax(315px,.72fr);gap:25px;align-items:start}
        .yc6-cart .yc6-paper{border:1px solid #e4d6c4;background:#fffaf3;min-width:0;padding:clamp(19px,3vw,34px)}
        .yc6-cart .yc6-paper h2{font:500 37px 'Cormorant Garamond',Georgia,serif;margin:0 0 22px}
        .yc6-cart .yc6-line{display:grid;grid-template-columns:106px minmax(0,1fr);gap:17px;padding:19px 0;border-bottom:1px solid #e9ddd0}
        .yc6-cart .yc6-line:first-of-type{padding-top:0}.yc6-cart .yc6-line img{width:106px;height:122px;object-fit:cover;background:#e6d9ca}
        .yc6-cart .yc6-line-info{min-width:0}.yc6-cart .yc6-line-info h3{font:500 26px 'Cormorant Garamond',Georgia,serif;margin:0 0 5px}
        .yc6-cart .yc6-line-info p{font-size:11px;color:#927c68;line-height:1.65;margin:0 0 12px;overflow-wrap:anywhere}
        .yc6-cart .yc6-line-footer{display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap}
        .yc6-cart .yc6-stepper{display:flex;align-items:center;border:1px solid #e1d0bc;gap:10px}.yc6-cart .yc6-stepper button{width:33px;height:32px;border:0;background:transparent;display:grid;place-items:center;color:#72533b}
        .yc6-cart .yc6-stepper span{min-width:20px;text-align:center;font-weight:700;font-size:12px}.yc6-cart .yc6-remove{border:0;background:transparent;color:#a65a4d;padding:6px}
        .yc6-cart .yc6-choice{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:8px 0 21px}.yc6-cart .yc6-choice button{padding:13px 10px;border:1px solid #d9c9b7;background:#faf5ed;color:#6c513e;font-size:12px;font-weight:700}
        .yc6-cart .yc6-choice button.selected{background:#536449;border-color:#536449;color:#fff}.yc6-cart .yc6-field{display:grid;gap:8px;margin:0 0 17px}
        .yc6-cart .yc6-field span{font-size:10px;color:#856747;letter-spacing:.1em;font-weight:700}.yc6-cart input,.yc6-cart select,.yc6-cart textarea{width:100%;min-width:0;border:1px solid #dacbb9;border-radius:3px;background:#faf6ef;color:#302824;padding:13px;font-size:12px}
        .yc6-cart textarea{min-height:76px;resize:vertical}.yc6-cart .yc6-total{display:flex;justify-content:space-between;gap:10px;padding:13px 0;font-size:12px;color:#776555;border-bottom:1px solid #ebdfd0}
        .yc6-cart .yc6-total b{color:#302824}.yc6-cart .yc6-total.final{border:0;font-size:17px;font-weight:800;padding:21px 0}.yc6-cart .yc6-total.final b{font-size:24px}
        .yc6-cart .yc6-submit{display:flex;justify-content:center;align-items:center;gap:12px;width:100%;padding:18px;border:0;background:#3c2a20;color:white;font-weight:700;font-size:12px}
        .yc6-cart .yc6-submit:disabled{opacity:.5}.yc6-cart .yc6-error{color:#a65342;font-size:12px;line-height:1.6;padding:12px;background:#fbeee9}
        .yc6-cart .yc6-disclaimer{display:flex;align-items:flex-start;gap:9px;font-size:10px;line-height:1.6;color:#8b7c69;margin:16px 0 0}
        .yc6-cart .yc6-empty{text-align:center;padding:85px 15px}.yc6-cart .yc6-empty svg{color:#ae8664}.yc6-cart .yc6-empty h2{font-size:47px}.yc6-cart .yc6-empty p{color:#8d7866;font-size:13px;margin:10px 0 27px}
        @media(max-width:950px){.yc6-cart .yc6-grid{grid-template-columns:1fr}}
        @media(max-width:530px){.yc6-cart .yc6-line{grid-template-columns:80px minmax(0,1fr);gap:12px}.yc6-cart .yc6-line img{width:80px;height:98px}.yc6-cart .yc6-line-info h3{font-size:24px}.yc6-cart .yc6-paper{padding:18px}.yc6-cart .yc6-choice{grid-template-columns:1fr 1fr}}
      `}</style>
      <div className="shell">
        <header className="yc6-head"><span className="yc6-kicker">PREPARED WITH CARE · FRONTEND DEMO</span><h1>Your coffee <em>moments.</em></h1><p>Review your selections, customize your visit, and place an illustrative order.</p></header>
        {cart.length === 0 ? <div className="yc6-paper yc6-empty"><Coffee size={40}/><h2>Your basket is waiting.</h2><p>A beautiful coffee moment begins with your first selection.</p><Link to="/menu" className="btn btn-primary">Explore the Menu <ArrowRight size={17}/></Link></div> :
          <form className="yc6-grid" onSubmit={checkout}>
            <div className="yc6-paper"><h2>Your selections <small>({cart.length})</small></h2>
              {cart.map((entry, index) => {
                const line = cartPreview.lines[index];
                return <article className="yc6-line" key={entry.key}>
                  <img src={line?.image} alt="" loading="lazy" />
                  <div className="yc6-line-info"><h3>{line?.name || entry.productId}</h3><p>{choicesSummary(entry.options)}</p>
                    <div className="yc6-line-footer"><strong>{formatPeso(line?.lineTotal || 0)}</strong>
                      <div className="yc6-stepper"><button type="button" onClick={() => cartActions.quantity(entry.key, entry.quantity - 1)} aria-label="Decrease quantity"><Minus size={14}/></button><span>{entry.quantity}</span><button type="button" disabled={entry.quantity >= 30} onClick={() => cartActions.quantity(entry.key, entry.quantity + 1)} aria-label="Increase quantity"><Plus size={14}/></button></div>
                      <button className="yc6-remove" type="button" onClick={() => cartActions.remove(entry.key)} aria-label={`Remove ${line?.name || "item"}`}><Trash2 size={18}/></button>
                    </div>
                  </div>
                </article>;
              })}
              <div style={{marginTop:24}}><Link to="/menu" className="text-link"><ArrowLeft size={15}/> Continue exploring menu</Link></div>
            </div>
            <aside className="yc6-paper"><h2>Order details.</h2>
              <span className="yc6-kicker">HOW WOULD YOU LIKE YOUR COFFEE?</span>
              <div className="yc6-choice"><button type="button" className={orderType === "pickup" ? "selected" : ""} onClick={() => { setOrderType("pickup"); setSelectedTable(""); }}>Pickup</button><button type="button" className={orderType === "dinein" ? "selected" : ""} onClick={() => setOrderType("dinein")}>Dine-in</button></div>
              {orderType === "dinein" && <label className="yc6-field"><span>TABLE (OPTIONAL — FOR CHECKED-IN GUESTS)</span><select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}><option value="">Unassigned dine-in order</option>{seatedTables.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.visit.nickname}</option>)}</select></label>}
              <label className="yc6-field"><span>CUSTOMER NICKNAME</span><input maxLength={40} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Coffee Lover" /></label>
              <label className="yc6-field"><span>ORDER NOTES</span><textarea maxLength={220} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any special request?" /></label>
              <label className="yc6-field"><span>PROMO CODE (OPTIONAL)</span><input value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="e.g. BREW5" /></label>
              {quotation.error && <p className="yc6-error" role="alert"><Coffee size={14} style={{verticalAlign:"middle"}}/> {quotation.error}</p>}
              <div className="yc6-total"><span>Subtotal</span><b>{formatPeso(quotation.data.subtotal)}</b></div><div className="yc6-total"><span>Discount</span><b>− {formatPeso(quotation.data.discount)}</b></div>
              <div className="yc6-total final"><span>Total</span><b>{formatPeso(quotation.data.total)}</b></div>
              {error && <p role="alert" className="yc6-error">{error}</p>}
              <button type="submit" className="yc6-submit" disabled={busy || Boolean(quotation.error)}><ShoppingBag size={18}/> {busy ? "Processing..." : "Place Demo Order"} <ArrowRight size={17}/></button>
              <p className="yc6-disclaimer"><CheckCircle2 size={16}/> Demo only. No actual payment is taken and no order is transmitted to a real café.</p>
            </aside>
          </form>}
      </div>
    </section>
  );
}
