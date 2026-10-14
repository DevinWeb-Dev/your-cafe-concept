// YOUR CAFÉ — Gift Cards Concept (non-redeemable preview)
// Location: src/pages/public/GiftCardsPage.jsx
// Frontend-only prototype · Web Developer Devin Planas
import { useState } from "react";
import { ArrowRight, Check, Coffee, Copy, Gift, Heart, Printer, Save, Sparkles } from "lucide-react";
import { BRAND, GIFT_CARD_AMOUNTS, formatPeso } from "../../data/config.js";

const STORAGE_KEY = "your-cafe-gift-card-drafts-v1";
const DESIGNS = [
  { id: "espresso", name: "Espresso Noir", style: "espresso" },
  { id: "cream", name: "Vanilla Cream", style: "cream" },
  { id: "olive", name: "Sage & Soul", style: "olive" },
];
function loadDrafts() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.slice(0, 20) : [];
  } catch { return []; }
}

export default function GiftCardsPage() {
  const [amount, setAmount] = useState(GIFT_CARD_AMOUNTS[1] || GIFT_CARD_AMOUNTS[0] || 500);
  const [design, setDesign] = useState("espresso");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("A little coffee, a lot of love.");
  const [drafts, setDrafts] = useState(loadDrafts);
  const [notification, setNotification] = useState("");
  const [savedId, setSavedId] = useState("");
  const preview = `YOUR CAFÉ · ${formatPeso(amount)} · For ${recipient.trim() || "someone special"}\n${message.trim() || "A coffee moment, just for you."}\nCONCEPT PREVIEW ONLY — NOT REDEEMABLE`;

  function saveDraft() {
    const entry = { id: `DRAFT-${Date.now().toString(36).toUpperCase()}`, amount, design, recipient: recipient.trim().slice(0, 48), message: message.trim().slice(0, 160), createdAt: Date.now() };
    const updated = [entry, ...drafts].slice(0, 20);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setDrafts(updated);
      setSavedId(entry.id);
      setNotification("Preview saved in this browser only. No gift card has been issued.");
    } catch { setNotification("Storage unavailable. The preview still works, but it was not saved."); }
  }

  async function copyPreview() {
    try { await navigator.clipboard.writeText(preview); setNotification("Concept preview copied. This is not a redeemable card."); }
    catch { setNotification("Copy unavailable in this browser. You can select the preview text manually."); }
  }

  return <div className="yc9-gifts">
    <style>{`
      .yc9-gifts{min-width:0;background:#faf5ec;color:#34271f}.yc9-gifts *{box-sizing:border-box}.yc9-gifts .wrap{width:min(1230px,calc(100% - 48px));margin:auto}
      .yc9-gifts h1,.yc9-gifts h2,.yc9-gifts h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;letter-spacing:-.035em}
      .yc9-gifts .intro{padding:95px 0 72px;background:#efe4d5}.yc9-gifts .overline{font:800 10px 'DM Sans',sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#9c7855}
      .yc9-gifts h1{font-size:clamp(68px,9vw,125px);line-height:.83;margin:25px 0 22px}.yc9-gifts h1 em{color:#a98561}
      .yc9-gifts .intro p{font-size:14px;line-height:1.9;max-width:550px;color:#7d6451}
      .yc9-gifts .workshop{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(26px,5vw,78px);padding:78px 0 100px;align-items:start}
      .yc9-gifts .preview-panel{position:sticky;top:110px;min-width:0}.yc9-gifts .gift-card{position:relative;aspect-ratio:1.62;min-height:220px;border-radius:22px;padding:clamp(22px,4vw,42px);display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;box-shadow:0 24px 70px #24181339}
      .yc9-gifts .gift-card::after{content:"";width:75%;aspect-ratio:1;position:absolute;border:1px solid currentColor;opacity:.12;border-radius:50%;right:-20%;top:-55%;box-shadow:0 0 0 35px #ffffff0c,0 0 0 68px #ffffff09;pointer-events:none}
      .yc9-gifts .gift-card.espresso{background:linear-gradient(135deg,#261913,#644634);color:#f6e7ce}.yc9-gifts .gift-card.cream{background:linear-gradient(125deg,#fbf1e3,#e4cfac);color:#483021}.yc9-gifts .gift-card.olive{background:linear-gradient(135deg,#344639,#7f886b);color:#faf2db}
      .yc9-gifts .brand{font-size:12px;font-weight:800;letter-spacing:.17em;display:flex;align-items:center;gap:11px}.yc9-gifts .card-middle{position:relative;z-index:1;min-width:0}
      .yc9-gifts .gift-card h2{font-size:clamp(43px,6.5vw,84px);line-height:.86;margin:0 0 12px;font-weight:500}.yc9-gifts .card-middle p{font-size:clamp(10px,1.5vw,15px);line-height:1.6;max-width:300px;overflow-wrap:anywhere;margin:0}
      .yc9-gifts .card-footer{display:flex;justify-content:space-between;align-items:end;gap:12px;font-size:9px;letter-spacing:.12em;position:relative;z-index:1}
      .yc9-gifts .card-footer strong{font-size:10px}.yc9-gifts .fineprint{font-size:11px;line-height:1.7;color:#8b7463;margin-top:15px}
      .yc9-gifts .editor{background:#fffaf4;border:1px solid #e2d3c1;padding:clamp(21px,3vw,37px)}.yc9-gifts .editor h2{font-size:49px;line-height:.9;margin:10px 0 28px}
      .yc9-gifts label.section-label{display:block;margin:26px 0 11px;font-size:10px;text-transform:uppercase;letter-spacing:.13em;font-weight:800;color:#826a57}
      .yc9-gifts .amounts,.yc9-gifts .designs{display:flex;flex-wrap:wrap;gap:9px}.yc9-gifts .amounts button,.yc9-gifts .designs button{padding:12px 15px;background:#faf5ee;border:1px solid #dfd0c0;color:#634e3c;font-weight:700;font-size:12px;min-height:43px}
      .yc9-gifts .amounts button.active,.yc9-gifts .designs button.active{background:#35261d;border-color:#35261d;color:white}
      .yc9-gifts input,.yc9-gifts textarea{width:100%;border:1px solid #dacabb;background:#fff;padding:14px;font-size:13px;color:#35251c;border-radius:0}.yc9-gifts textarea{min-height:105px;resize:vertical}
      .yc9-gifts .actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:26px}.yc9-gifts .actions button{border:1px solid #3d2b21;background:#3d2b21;color:#fff;min-width:0;padding:14px 10px;display:flex;gap:7px;justify-content:center;align-items:center;font-size:11px;font-weight:800}
      .yc9-gifts .actions .secondary{background:transparent;color:#3d2b21}.yc9-gifts .notification{background:#e7eedf;color:#3d5a37;padding:13px;margin-top:15px;font-size:12px;line-height:1.6}
      .yc9-gifts .drafts{padding:30px 0 80px;border-top:1px solid #e0d1c0}.yc9-gifts .drafts h2{font-size:48px;margin:0 0 15px}.yc9-gifts .draft-row{display:flex;justify-content:space-between;gap:20px;align-items:center;border-bottom:1px solid #e4d7c8;padding:15px 0;flex-wrap:wrap}.yc9-gifts .draft-row button{padding:11px 13px;border:1px solid #957457;background:transparent;font-size:11px;font-weight:800;color:#493529}
      @media(max-width:900px){.yc9-gifts .workshop{grid-template-columns:1fr}.yc9-gifts .preview-panel{position:static}.yc9-gifts .gift-card h2{font-size:clamp(48px,10vw,83px)}}
      @media(max-width:490px){.yc9-gifts .wrap{width:calc(100% - 32px)}.yc9-gifts .intro{padding:70px 0 55px}.yc9-gifts .gift-card{min-height:210px;padding:23px}.yc9-gifts .actions{grid-template-columns:1fr}.yc9-gifts .gift-card h2{font-size:50px}}
      @media print{body *{visibility:hidden!important}.yc9-gifts .gift-card,.yc9-gifts .gift-card *{visibility:visible!important}.yc9-gifts .gift-card{position:fixed;inset:20px auto auto 20px;width:680px;height:400px;print-color-adjust:exact;-webkit-print-color-adjust:exact}}
    `}</style>
    <section className="intro"><div className="wrap"><span className="overline">A LITTLE SOMETHING THOUGHTFUL</span><h1>Give the gift<br/><em>of a moment.</em></h1><p>Design a beautiful coffee gift card concept. This is a non-redeemable preview: no checkout, balance, activation, or real gift card issuance.</p></div></section>
    <section className="workshop wrap"><div className="preview-panel"><div className={`gift-card ${design}`} aria-label="Gift card preview">
      <div className="brand"><Coffee size={19}/>{BRAND.name}</div>
      <div className="card-middle"><h2>{formatPeso(amount)}</h2><p>For {recipient.trim() || "someone special"}<br/>{message.trim() || "A coffee moment, just for you."}</p></div>
      <div className="card-footer"><strong>THE ART OF EVERYDAY COFFEE</strong><span>CONCEPT · NOT REDEEMABLE</span></div>
    </div><p className="fineprint">This design is a preview only. Saving or printing it does not create monetary value. {BRAND.watermark}</p></div>
      <div className="editor"><span className="overline">PERSONALIZE YOUR CONCEPT</span><h2>Made for <em>someone.</em></h2>
        <label className="section-label">Select amount</label><div className="amounts">{GIFT_CARD_AMOUNTS.map((value) => <button type="button" key={value} className={amount === value ? "active" : ""} aria-pressed={amount === value} onClick={() => {setAmount(value);setSavedId("");}}>{formatPeso(value)}</button>)}</div>
        <label className="section-label">Choose a design</label><div className="designs">{DESIGNS.map((item) => <button type="button" key={item.id} className={design === item.id ? "active" : ""} aria-pressed={design === item.id} onClick={() => {setDesign(item.style);setSavedId("");}}>{item.name}</button>)}</div>
        <label htmlFor="yc9-gift-recipient" className="section-label">Recipient nickname</label><input id="yc9-gift-recipient" value={recipient} maxLength={48} placeholder="Someone special" onChange={(e) => {setRecipient(e.target.value);setSavedId("");}}/>
        <label htmlFor="yc9-gift-message" className="section-label">Your message</label><textarea id="yc9-gift-message" maxLength={160} value={message} onChange={(e) => {setMessage(e.target.value);setSavedId("");}}/>
        <div className="actions"><button type="button" onClick={saveDraft}><Save size={15}/>{savedId ? "SAVE ANOTHER DRAFT" : "SAVE DEMO DRAFT"}</button><button type="button" className="secondary" onClick={copyPreview}><Copy size={15}/> COPY PREVIEW</button><button type="button" className="secondary" onClick={() => window.print()}><Printer size={15}/> PRINT PREVIEW</button><button type="button" className="secondary" onClick={() => {setRecipient("");setMessage("A little coffee, a lot of love.");setAmount(GIFT_CARD_AMOUNTS[0]);setDesign("espresso");setSavedId("");setNotification("Preview reset.");}}><Sparkles size={15}/> START OVER</button></div>
        {notification && <p role="status" className="notification"><Check size={15}/> {notification}</p>}
      </div></section>
    {drafts.length > 0 && <section className="drafts wrap"><span className="overline">SAVED IN THIS BROWSER</span><h2>My concept drafts.</h2>{drafts.map((draft) => <div className="draft-row" key={draft.id}><span><Gift size={15}/> {draft.recipient || "A coffee lover"} · {formatPeso(draft.amount)} · {draft.id}</span><button type="button" onClick={() => {setAmount(draft.amount);setDesign(draft.design);setRecipient(draft.recipient);setMessage(draft.message);setNotification("Loaded a locally saved preview.");}}>Load Preview <ArrowRight size={13}/></button></div>)}</section>}
  </div>;
}
