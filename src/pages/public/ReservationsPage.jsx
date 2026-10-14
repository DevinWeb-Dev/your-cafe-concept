// YOUR CAFÉ — Batch 6 / customer reservations
// Frontend-only demonstration: no real booking is sent.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Coffee, MapPin, Users } from "lucide-react";
import { BRAND, POLICIES, SEATING_ZONES } from "../../data/config.js";
import { isTableFreeForPeriod } from "../../engine/cafeEngine.js";
import { useCafe } from "../../context/CafeContext.jsx";

function localDateTime(daysAhead = 1, hour = 14) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(hour, 0, 0, 0);
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const niceDate = (value) => new Date(value).toLocaleString("en-PH", {
  dateStyle: "medium", timeStyle: "short",
});

export default function ReservationsPage() {
  const { state, tables, reservations, actions, now } = useCafe();
  const [dateTime, setDateTime] = useState(() => localDateTime());
  const [partySize, setPartySize] = useState(2);
  const [zoneId, setZoneId] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [nickname, setNickname] = useState("");
  const [duration, setDuration] = useState(POLICIES.reservationDurationMinutes);
  const [response, setResponse] = useState(null);
  const startAt = new Date(dateTime).getTime();
  const endAt = startAt + duration * 60_000;
  const dateEligible = Number.isFinite(startAt) &&
    startAt >= now + POLICIES.minimumReservationNoticeMinutes * 60_000 &&
    startAt <= now + POLICIES.maximumAdvanceBookingDays * 86_400_000;

  const eligibleTables = useMemo(() => tables.filter((table) =>
    table.capacity >= partySize && (zoneId === "all" || table.zoneId === zoneId)
  ).map((table) => ({
    ...table,
    bookable: dateEligible && isTableFreeForPeriod(state, table.id, startAt, endAt, now),
  })), [tables, partySize, zoneId, dateEligible, state, startAt, endAt, now]);

  const availableCount = eligibleTables.filter((table) => table.bookable).length;
  const choice = eligibleTables.find((table) => table.id === selectedId && table.bookable);
  const confirmed = response?.ok && reservations.find((r) => r.id === response.reservationId);

  function submit(event) {
    event.preventDefault();
    setResponse(null);
    if (!dateEligible) return setResponse({ ok: false, text: "Choose an eligible date and time at least 30 minutes from now." });
    if (!choice) return setResponse({ ok: false, text: "Choose an available table that can seat your party." });
    const result = actions.reserveTable({ tableId: choice.id, partySize, nickname, startAt, durationMinutes: duration });
    if (!result.ok) return setResponse({ ok: false, text: result.error });
    const newest = result.state.reservations[0];
    setResponse({ ok: true, reservationId: newest.id, text: "Demo reservation created successfully." });
    setSelectedId("");
  }

  return (
    <section className="yc6-reserve section cream page-section">
      <style>{`
        .yc6-reserve{color:#302824}.yc6-reserve .yc6-hero{padding:25px 0 38px;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(250px,.8fr);gap:30px;align-items:end}
        .yc6-reserve .yc6-kicker{font:700 10px 'DM Sans',sans-serif;letter-spacing:.2em;color:#94704c;text-transform:uppercase}
        .yc6-reserve h1{font:500 clamp(58px,7.2vw,108px)/.92 'Cormorant Garamond',Georgia,serif;margin:14px 0 18px;letter-spacing:-.04em}
        .yc6-reserve h1 em{color:#ab7f50;font-weight:400}.yc6-reserve .yc6-intro{max-width:410px;color:#807364;line-height:1.8;font-size:13px}
        .yc6-reserve .yc6-board{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,.8fr);gap:24px;align-items:start}
        .yc6-reserve .yc6-panel{padding:clamp(20px,3vw,36px);background:#fffaf4;border:1px solid #e6d8c5;min-width:0}
        .yc6-reserve .yc6-panel h2{font:500 37px 'Cormorant Garamond',Georgia,serif;margin:0 0 9px}.yc6-reserve .yc6-sub{font-size:12px;color:#877867;line-height:1.6;margin:0 0 24px}
        .yc6-reserve .yc6-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
        .yc6-reserve label{display:grid;gap:8px;color:#775e45;font-size:10px;font-weight:700;letter-spacing:.09em;min-width:0}
        .yc6-reserve input,.yc6-reserve select{width:100%;max-width:100%;min-width:0;background:#faf5ec;border:1px solid #dbcbb8;padding:13px 12px;border-radius:5px;color:#302824;font-size:13px}
        .yc6-reserve .yc6-full{grid-column:1/-1}.yc6-reserve .yc6-table-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
        .yc6-reserve .yc6-table{min-width:0;min-height:95px;border:1px solid #dbd0bf;background:#faf5ec;color:#5b4737;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:10px 4px;border-radius:7px}
        .yc6-reserve .yc6-table b{font-size:12px}.yc6-reserve .yc6-table small{font-size:9px;color:#827665}.yc6-reserve .yc6-table:disabled{opacity:.38;cursor:not-allowed}
        .yc6-reserve .yc6-table.active{background:#536449;color:#fff;border-color:#536449;box-shadow:0 9px 18px #53644933}.yc6-reserve .yc6-table.active small{color:#e8e5d9}
        .yc6-reserve .yc6-table-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:28px 0 14px}.yc6-reserve .yc6-table-heading h3{font:500 24px 'Cormorant Garamond',Georgia,serif;margin:0}
        .yc6-reserve .yc6-count{color:#65826b;font-size:11px;font-weight:700}.yc6-reserve .yc6-submit{width:100%;min-height:50px;background:#3a2922;color:#fff;border:0;margin-top:21px;display:flex;align-items:center;justify-content:center;gap:10px;font-weight:700}
        .yc6-reserve .yc6-submit:disabled{opacity:.4}.yc6-reserve .yc6-response{padding:16px;margin-top:18px;background:#f7e6df;border-left:3px solid #b96254;font-size:12px;line-height:1.7}
        .yc6-reserve .yc6-response.good{background:#eaf0e4;border-color:#66816a}.yc6-reserve .yc6-note{display:flex;gap:10px;align-items:flex-start;font-size:11px;color:#857666;line-height:1.7;margin-top:16px}
        .yc6-reserve .yc6-side-photo{height:220px;background:#2c1c12 url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80') center/cover;margin:-36px -36px 24px}
        .yc6-reserve .yc6-schedule{display:grid;gap:14px}.yc6-reserve .yc6-booking{padding:15px;border:1px solid #e2d7c9;background:#faf5ec;font-size:12px;display:grid;gap:7px}
        .yc6-reserve .yc6-booking>div{display:flex;align-items:center;justify-content:space-between;gap:8px}.yc6-reserve .yc6-booking small{color:#877663;overflow-wrap:anywhere}
        @media(max-width:920px){.yc6-reserve .yc6-board{grid-template-columns:1fr}.yc6-reserve .yc6-side-photo{margin:-25px -25px 24px}}
        @media(max-width:620px){.yc6-reserve .yc6-hero{grid-template-columns:1fr}.yc6-reserve .yc6-form-grid{grid-template-columns:1fr}.yc6-reserve .yc6-table-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.yc6-reserve .yc6-panel{padding:19px}.yc6-reserve .yc6-side-photo{margin:-19px -19px 24px}}
      `}</style>
      <div className="shell">
        <div className="yc6-hero">
          <div><span className="yc6-kicker">A PLACE FOR EVERY MOMENT</span><h1>Save your <em>favorite seat.</em></h1></div>
          <p className="yc6-intro">A window by the light. A table for conversations. A quiet corner for coffee. Choose your preferred café space with our interactive booking demonstration.</p>
        </div>
        <div className="yc6-board">
          <form className="yc6-panel" onSubmit={submit}>
            <h2>Plan your visit.</h2><p className="yc6-sub">Choose your date, number of guests and favorite seating area.</p>
            <div className="yc6-form-grid">
              <label>DATE & TIME<input required type="datetime-local" value={dateTime} min={localDateTime(0, 0)} onChange={(e) => { setDateTime(e.target.value); setSelectedId(""); setResponse(null); }} /></label>
              <label>NUMBER OF GUESTS<select value={partySize} onChange={(e) => { setPartySize(Number(e.target.value)); setSelectedId(""); }}>
                {Array.from({ length: POLICIES.maximumPartySize }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {index ? "guests" : "guest"}</option>)}
              </select></label>
              <label>SEATING PREFERENCE<select value={zoneId} onChange={(e) => { setZoneId(e.target.value); setSelectedId(""); }}>
                <option value="all">Any beautiful space</option>{SEATING_ZONES.map((z) => <option value={z.id} key={z.id}>{z.name}</option>)}
              </select></label>
              <label>RESERVATION LENGTH<select value={duration} onChange={(e) => { setDuration(Number(e.target.value)); setSelectedId(""); }}>
                {[60, 90, 120, 180].map((m) => <option key={m} value={m}>{m} minutes</option>)}
              </select></label>
              <label className="yc6-full">GUEST NICKNAME (OPTIONAL)<input maxLength={40} placeholder="e.g. Coffee Lover" value={nickname} onChange={(e) => setNickname(e.target.value)} /></label>
            </div>
            <div className="yc6-table-heading"><h3>Select a table</h3><span className="yc6-count">{dateEligible ? `${availableCount} available` : "Choose valid time"}</span></div>
            {eligibleTables.length ? <div className="yc6-table-grid">
              {eligibleTables.map((t) => <button className={`yc6-table ${selectedId === t.id ? "active" : ""}`} type="button" key={t.id} disabled={!t.bookable} aria-pressed={selectedId === t.id} onClick={() => setSelectedId(t.id)}>
                <Coffee size={17}/><b>{t.id}</b><small>{t.capacity} {t.capacity === 1 ? "seat" : "seats"}</small>
              </button>)}
            </div> : <p className="yc6-sub">No tables match the selected capacity and seating preference.</p>}
            <button className="yc6-submit" type="submit" disabled={!choice}><CalendarDays size={18}/> Confirm Demo Reservation <ArrowRight size={17}/></button>
            {response && <div role="status" className={`yc6-response ${response.ok ? "good" : ""}`}>
              {response.ok && <CheckCircle2 size={18} style={{ verticalAlign: "middle", marginRight: 6 }}/>} {response.text}
              {confirmed && <><br/><strong>{confirmed.reference}</strong><br/>Table {confirmed.tableId} · {niceDate(confirmed.startAt)}</>}
            </div>}
            <p className="yc6-note"><Clock3 size={17}/>This is a local demonstration. No actual table is held by a café.</p>
          </form>
          <aside className="yc6-panel">
            <div className="yc6-side-photo" role="img" aria-label="Illustrative warm café interior" />
            <span className="yc6-kicker">YOUR CAFÉ · GUEST EXPERIENCE</span><h2>Beautifully unhurried.</h2>
            <p className="yc6-sub">A thoughtful space for everyday rituals. Explore our illustrative café seating areas.</p>
            <div className="yc6-schedule"><div className="yc6-note"><MapPin size={18}/> {BRAND.address}</div><div className="yc6-note"><Users size={18}/> {SEATING_ZONES.length} unique seating areas</div>
              {reservations.filter((r) => r.status === "reserved").slice(0, 4).map((r) => <article className="yc6-booking" key={r.id}>
                <div><strong>{r.tableId} · {r.partySize} guests</strong><span>DEMO</span></div><small>{niceDate(r.startAt)}</small>
              </article>)}
              <Link to="/menu" className="btn btn-outline">Explore Our Coffee Menu <ArrowRight size={16}/></Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
