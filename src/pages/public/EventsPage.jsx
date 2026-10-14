// YOUR CAFÉ — Events & Workshops
// Location: src/pages/public/EventsPage.jsx
// Frontend-only concept · Web Developer Devin Planas
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Check, Clock3, Coffee, Users, X } from "lucide-react";
import { BRAND, CAFE_EVENTS, formatPeso } from "../../data/config.js";

const STORAGE_KEY = "your-cafe-event-signups-v1";
function getStoredSignups() {
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); return Array.isArray(saved) ? saved.filter((x) => x && x.id && x.eventId) : []; }
  catch { return []; }
}
function eventStart(event) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + event.dayOffset);
  date.setHours(event.startHour || 10, 0, 0, 0);
  return date;
}
function readableDate(date) { return new Intl.DateTimeFormat("en-PH", { month: "long", day: "numeric", year: "numeric" }).format(date); }
function readableTime(date) { return new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit" }).format(date); }

export default function EventsPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [nickname, setNickname] = useState("");
  const [signups, setSignups] = useState(getStoredSignups);
  const [feedback, setFeedback] = useState("");
  const selected = CAFE_EVENTS.find((e) => e.id === selectedId) || null;
  const activeEvents = useMemo(() => [...CAFE_EVENTS].sort((a,b) => eventStart(a) - eventStart(b)), []);

  function signup(event) {
    const name = nickname.trim().slice(0, 40);
    if (name.length < 2) { setFeedback("Enter a nickname with at least 2 characters."); return; }
    if (eventStart(event).getTime() <= Date.now()) { setFeedback("This sample event is no longer open for registration."); return; }
    if (signups.filter((s) => s.eventId === event.id).length >= event.capacity) { setFeedback("No local demonstration slots remain."); return; }
    if (signups.some((s) => s.eventId === event.id && s.nickname.toLowerCase() === name.toLowerCase())) { setFeedback("That nickname already has a local demo signup for this event."); return; }
    const entry = { id: `signup-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, eventId: event.id, nickname: name, createdAt: Date.now() };
    const updated = [...signups, entry];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); setSignups(updated); setSelectedId(null); setNickname(""); setFeedback(`Demo registration saved for ${event.name}. This is not an actual café booking.`); }
    catch { setFeedback("Browser storage is unavailable. The registration was not saved."); }
  }
  function cancelSignup(id) {
    const updated = signups.filter((s) => s.id !== id);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); setSignups(updated); setFeedback("Local demo signup cancelled."); }
    catch { setFeedback("Browser storage is unavailable. Unable to cancel the demo signup."); }
  }

  return <div className="yc9-events">
    <style>{`
      .yc9-events{background:#faf5ec;color:#39271e}.yc9-events *{box-sizing:border-box}.yc9-events .wrap{width:min(1250px,calc(100% - 48px));margin:auto}
      .yc9-events h1,.yc9-events h2,.yc9-events h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;letter-spacing:-.035em}
      .yc9-events .overline{font:800 10px 'DM Sans',sans-serif;letter-spacing:.18em;color:#ad8259}
      .yc9-events .hero{height:auto;min-height:460px;padding:95px 0;background:radial-gradient(circle at 82% 20%,#8b634844,transparent 40%),#241813;display:block;color:white}
      .yc9-events .hero h1{font-size:clamp(68px,9vw,122px);line-height:.83;margin:30px 0}.yc9-events .hero h1 em{color:#dcb78a}.yc9-events .hero p{font-size:14px;line-height:1.9;max-width:530px;color:#e0d1c2}
      .yc9-events .calendar{padding:90px 0}.yc9-events .section-title{font-size:clamp(48px,6vw,80px);line-height:.96;margin:15px 0 40px}
      .yc9-events .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:21px}.yc9-events .event{min-width:0;display:flex;flex-direction:column;background:#fffaf2;border:1px solid #e7d8c8}
      .yc9-events .event-img{height:235px;position:relative;overflow:hidden;background:#684732}.yc9-events .event-img img{height:100%;width:100%;object-fit:cover}.yc9-events .event-img .tag{position:absolute;top:16px;left:16px;background:#f5e7d6;padding:9px 12px;font-size:10px;font-weight:800;letter-spacing:.08em}
      .yc9-events .event-info{padding:24px;display:flex;flex-direction:column;flex:1}.yc9-events .event-info h3{font-size:35px;line-height:1;margin:14px 0}.yc9-events .event-info p{font-size:12px;line-height:1.8;color:#7e6a58;flex:1}
      .yc9-events .details{display:grid;gap:10px;margin:16px 0 24px}.yc9-events .details span{display:flex;align-items:center;gap:9px;font-size:11px;color:#665243}
      .yc9-events .event-actions{display:flex;gap:9px;flex-wrap:wrap;align-items:center}.yc9-events .event-actions button{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;padding:13px 16px;background:#3c2a20;color:white;font-size:11px;font-weight:800;min-height:45px}.yc9-events button:disabled{opacity:.55;cursor:not-allowed}
      .yc9-events .demo-note{font-size:11px;color:#8b735e;line-height:1.85;margin-top:22px}.yc9-events .notice{padding:15px 18px;margin-bottom:30px;border:1px solid #d7c3a9;background:#fff4df;font-size:12px;line-height:1.7}
      .yc9-events .signups{background:#e9ddce;padding:65px 0}.yc9-events .signups h2{font-size:50px;margin:0 0 12px}.yc9-events .signup{display:flex;align-items:center;justify-content:space-between;gap:15px;border-bottom:1px solid #cdb9a4;padding:15px 0;flex-wrap:wrap}.yc9-events .signup span{font-size:12px;line-height:1.6}.yc9-events .signup button{border:1px solid #816045;background:transparent;padding:9px 12px;font-size:11px;color:#4b3626;display:inline-flex;align-items:center;gap:6px}
      .yc9-events .overlay{position:fixed;z-index:1400;inset:0;background:#1e140dcf;display:grid;place-items:center;padding:18px}.yc9-events .dialog{max-height:calc(100dvh - 36px);overflow-y:auto;width:min(540px,100%);background:#fffaf3;padding:clamp(24px,4vw,42px);position:relative}
      .yc9-events .dialog .close{position:absolute;right:15px;top:15px;border:0;background:none}.yc9-events .dialog h2{font-size:48px;line-height:.95;margin:18px 0}.yc9-events .dialog p{font-size:12px;line-height:1.85;color:#7a6352}
      .yc9-events .dialog label{display:block;font-size:11px;font-weight:800;margin:22px 0 9px}.yc9-events .dialog input{width:100%;padding:14px;border:1px solid #d7c1aa;font-size:14px;background:#fff}
      .yc9-events .dialog .submit{display:flex;justify-content:center;align-items:center;gap:9px;background:#3c2a20;color:white;border:0;padding:15px;width:100%;margin-top:20px;font-weight:800;font-size:11px}
      @media(max-width:980px){.yc9-events .grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:640px){.yc9-events .wrap{width:calc(100% - 32px)}.yc9-events .grid{grid-template-columns:1fr}.yc9-events .hero{min-height:0;padding:75px 0}.yc9-events .hero h1{font-size:65px}.yc9-events .event-img{height:250px}}
    `}</style>
    <section className="hero"><div className="wrap"><span className="overline">GATHER · LEARN · ENJOY</span><h1>Good coffee.<br/><em>Better company.</em></h1><p>Explore illustrative workshops and coffee moments—an invitation to discover the people, stories, and craft behind every cup.</p></div></section>
    <section className="calendar wrap"><span className="overline">THE CAFÉ CALENDAR</span><h2 className="section-title">Little moments worth <em>sharing.</em></h2>
      {feedback && <p className="notice" role="status">{feedback}</p>}
      <div className="grid">{activeEvents.map((event) => {const start = eventStart(event);const remaining = Math.max(0, event.capacity - signups.filter((s) => s.eventId === event.id).length);const passed = start.getTime() <= Date.now();return <article className="event" key={event.id}>
        <div className="event-img"><img src={event.image} alt={`Illustrative ${event.category.toLowerCase()} photo`} loading="lazy"/><span className="tag">{event.category.toUpperCase()}</span></div>
        <div className="event-info"><span className="overline">{readableDate(start).toUpperCase()}</span><h3>{event.name}</h3><p>{event.description}</p><div className="details"><span><Clock3 size={15}/>{readableTime(start)} · {event.durationMinutes} min</span><span><Users size={15}/>{remaining} / {event.capacity} local demo slots</span><span><Coffee size={15}/>{formatPeso(event.price)} sample fee · No payment</span></div><div className="event-actions"><button type="button" disabled={passed || remaining < 1} onClick={() => {setSelectedId(event.id);setFeedback("");}}>{passed ? "EVENT CLOSED" : remaining ? "RESERVE DEMO SLOT" : "DEMO FULL"}<ArrowRight size={15}/></button></div></div>
      </article>;})}</div><p className="demo-note">Event dates, photos, workshop fees and availability are sample content. Registrations are stored only in this browser and are not transmitted to a real café.</p>
    </section>
    <section className="signups"><div className="wrap"><span className="overline">LOCAL DEMONSTRATION RECORDS</span><h2>My sample signups.</h2>{signups.length ? signups.map((entry) => <div className="signup" key={entry.id}><span><Check size={15}/> <strong>{entry.nickname}</strong> · {CAFE_EVENTS.find((e) => e.id === entry.eventId)?.name || entry.eventId}</span><button type="button" onClick={() => cancelSignup(entry.id)}><X size={14}/> Cancel Demo Signup</button></div>) : <p>No local event registrations yet.</p>}<p className="demo-note">{BRAND.watermark}</p><Link to="/contact">Have a question? Contact page <ArrowRight size={14}/></Link></div></section>
    {selected && <div className="overlay" role="presentation" onMouseDown={(e) => {if (e.target === e.currentTarget) setSelectedId(null);}}><div className="dialog" role="dialog" aria-modal="true" aria-labelledby="yc9-register-title"><button type="button" className="close" aria-label="Close registration" onClick={() => setSelectedId(null)}><X size={22}/></button><span className="overline">FRONTEND-ONLY REGISTRATION</span><h2 id="yc9-register-title">Join {selected.name}.</h2><p>Choose a nickname. Saving creates a local demonstration signup only; it does not reserve a real seat or charge you.</p><label htmlFor="yc9-event-nickname">Display nickname</label><input id="yc9-event-nickname" autoFocus maxLength={40} required value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Coffee Guest" onKeyDown={(e) => {if(e.key === "Enter") signup(selected);if(e.key === "Escape") setSelectedId(null);}}/><button type="button" className="submit" onClick={() => signup(selected)}><CalendarDays size={17}/> SAVE DEMO REGISTRATION</button>{feedback && <p role="alert" style={{color:"#9b3a2c",fontWeight:700}}>{feedback}</p>}</div></div>}
  </div>;
}
