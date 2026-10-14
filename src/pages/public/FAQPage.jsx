// YOUR CAFÉ — PART 10 | src/pages/public/FAQPage.jsx
// Searchable, keyboard-accessible FAQ using authoritative config content.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronDown, Coffee, HelpCircle, Search, ShoppingBag, CalendarDays, CircleHelp, X, ShieldCheck } from "lucide-react";
import { BRAND, FAQS, POLICIES } from "../../data/config.js";

const extraFacts = [
  { category:"Reservations", question:"How far in advance can I reserve?", answer:`The local demonstration allows reservations up to ${POLICIES.maximumAdvanceBookingDays} days ahead with at least ${POLICIES.minimumReservationNoticeMinutes} minutes' notice. This is sample booking logic, not an official café policy.` },
  { category:"Reservations", question:"Can I choose a particular seating area?", answer:"Yes. Use the sample reservation page to filter by seating zone, party size, and time. The app checks each available table's seating capacity and conflicting demo bookings." },
  { category:"Ordering", question:"Is my order actually sent to a barista?", answer:"No. Orders are locally simulated in this browser. They can appear in the staff demo order queue, but no order is delivered to a real café." },
  { category:"Ordering", question:"Does the website accept real GCash or card payments?", answer:"No real payments are processed. Staff may record sample Cash, GCash, or Card payments to demonstrate receipt and reporting workflows." },
  { category:"Website concept", question:"Can I access my demo reservations on another device?", answer:"Not reliably. Demo records use this browser's local storage and do not synchronize with a real café server or other devices." },
  { category:"Website concept", question:"Where can I find the actual café location?", answer:"Visit the Locations page. Until the café owner provides a verified address, the site shows a location placeholder and disables map directions." },
];
function categoryFor(question) {
  const q=question.toLowerCase();
  if(q.includes("reserve")||q.includes("table"))return "Reservations";
  if(q.includes("customize")||q.includes("pickup")||q.includes("order"))return "Ordering";
  return "Website concept";
}
const CATEGORIES=["All topics","Reservations","Ordering","Website concept"];
export default function FAQPage() {
  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("All topics");
  const [opened,setOpened]=useState(null);
  const questions=useMemo(()=>[
    ...FAQS.map((item,index)=>({...item,id:`config-${index}`,category:categoryFor(item.question)})),
    ...extraFacts.map((item,index)=>({...item,id:`concept-${index}`})),
  ],[]);
  const filtered=questions.filter((q)=>
    (category==="All topics"||q.category===category) &&
    `${q.question} ${q.answer} ${q.category}`.toLowerCase().includes(search.trim().toLowerCase())
  );
  return <div className="yc10-faq">
    <style>{`
      .yc10-faq{background:#faf5ec;color:#35251c;overflow:hidden}.yc10-faq *{box-sizing:border-box}.yc10-faq .wrap{width:min(1180px,calc(100% - 52px));margin:auto}.yc10-faq .ey{font:800 10px/1.5 'DM Sans',sans-serif;letter-spacing:.18em;color:#ae8257;text-transform:uppercase}
      .yc10-faq h1,.yc10-faq h2{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;letter-spacing:-.05em;text-wrap:balance}
      .yc10-faq .hero10{background:radial-gradient(circle at 85% 15%,#946e4842,transparent 40%),#271b15;color:white;padding:105px 0 93px}.yc10-faq .hero10 h1{font-size:clamp(70px,10vw,132px);line-height:.88;margin:20px 0 25px}.yc10-faq .hero10 h1 em{color:#d9b589}.yc10-faq .hero10 p{max-width:495px;color:#d9c9b9;line-height:1.85;font-size:13px}
      .yc10-faq .content{padding:90px 0 105px}.yc10-faq .grid{display:grid;grid-template-columns:minmax(220px,.36fr) minmax(0,1fr);gap:clamp(25px,5vw,75px);align-items:start}.yc10-faq .side{position:sticky;top:120px}.yc10-faq .side h2{font-size:clamp(42px,5vw,62px);line-height:.99;margin:16px 0 18px}.yc10-faq .side p{font-size:12px;color:#867361;line-height:1.9}.yc10-faq .category{margin-top:25px;display:grid;gap:7px}.yc10-faq .category button{min-height:46px;text-align:left;border:1px solid transparent;background:transparent;color:#765e4c;font:700 12px 'DM Sans',sans-serif;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;gap:8px}.yc10-faq .category button[aria-pressed=true]{border-color:#d5bfaa;background:#e9ddce;color:#34241b}.yc10-faq .category button:hover{background:#f0e6d9}
      .yc10-faq .search{display:flex;align-items:center;gap:13px;padding:0 17px;border:1px solid #d9c5af;background:#fffaf3}.yc10-faq .search svg{color:#a37b56;flex-shrink:0}.yc10-faq .search input{min-width:0;width:100%;background:transparent;padding:17px 0;border:0;outline-offset:2px;color:#3b2b22;font-size:13px}.yc10-faq .search button{border:0;background:none;color:#755f4e;padding:7px}
      .yc10-faq .count{display:flex;justify-content:space-between;gap:10px;align-items:center;font-size:11px;letter-spacing:.08em;color:#907962;margin:22px 0 14px}.yc10-faq .qa{border-bottom:1px solid #ddcdbb}.yc10-faq .qa:first-of-type{border-top:1px solid #ddcdbb}.yc10-faq .question{width:100%;border:0;background:none;display:flex;align-items:center;justify-content:space-between;gap:22px;text-align:left;padding:25px 2px;color:#3f2e23;font:500 clamp(24px,2.5vw,35px)/1.08 'Cormorant Garamond',Georgia,serif;letter-spacing:-.02em}.yc10-faq .question svg{flex-shrink:0;color:#9b7b57;transition:transform .25s}.yc10-faq .question[aria-expanded=true] svg{transform:rotate(180deg)}.yc10-faq .answer{padding:0 40px 24px 2px;color:#796857;max-width:750px;font-size:13px;line-height:1.9}.yc10-faq .empty{padding:36px;border:1px dashed #cdb397;text-align:center;background:#fffaf3}.yc10-faq .empty p{font-size:13px;color:#887565}
      .yc10-faq .help{background:#e9ddcf;padding:78px 0}.yc10-faq .helpbox{display:flex;justify-content:space-between;align-items:center;gap:24px}.yc10-faq .help h2{font-size:clamp(45px,6vw,75px);line-height:.93;margin:14px 0}.yc10-faq .help p{font-size:13px;color:#7a6657;line-height:1.8}.yc10-faq .help a{background:#3b2a20;color:white;padding:17px 24px;display:inline-flex;align-items:center;gap:12px;font-size:11px;font-weight:800;white-space:nowrap}.yc10-faq .watermark{text-align:center;font-size:10px;color:#887564;padding:19px;margin:0}
      @media(max-width:800px){.yc10-faq .grid{grid-template-columns:1fr}.yc10-faq .side{position:static}.yc10-faq .category{display:flex;flex-wrap:wrap;gap:6px}.yc10-faq .category button{border-color:#dfd0bd;padding:10px 13px;min-height:43px}.yc10-faq .helpbox{display:block}.yc10-faq .help a{margin-top:10px}}
      @media(max-width:600px){.yc10-faq .wrap{width:calc(100% - 34px)}.yc10-faq .hero10{padding:75px 0}.yc10-faq .hero10 h1{font-size:clamp(63px,13vw,86px)}.yc10-faq .content{padding:65px 0}.yc10-faq .question{font-size:25px;padding:20px 0}.yc10-faq .help{padding:65px 0}}
      @media(prefers-reduced-motion:reduce){.yc10-faq .question svg{transition:none}}
    `}</style>
    <section className="hero10"><div className="wrap"><span className="ey">GOOD QUESTIONS. WARM ANSWERS.</span><h1>Questions?<br/><em>We've got coffee.</em></h1><p>Discover what our café concept can do—from drink customization to browser-local table reservations and ordering.</p></div></section>
    <section className="content"><div className="wrap grid"><aside className="side"><span className="ey">THE HELP DESK</span><h2>Here to <em>help.</em></h2><p>Choose a topic or find an answer in seconds. Content describes the current demonstration system—not real business policies.</p><div className="category" aria-label="Filter FAQ topics">{CATEGORIES.map((c)=><button type="button" aria-pressed={category===c} key={c} onClick={()=>{setCategory(c);setOpened(null)}}>{c}<ArrowRight size={14}/></button>)}</div></aside>
      <div><label className="search" htmlFor="yc10-faq-search"><Search size={19}/><input id="yc10-faq-search" type="search" value={search} onChange={(e)=>{setSearch(e.target.value);setOpened(null)}} placeholder="Search by keyword, booking, orders..." aria-label="Search frequently asked questions"/>{search && <button type="button" aria-label="Clear search" onClick={()=>setSearch("")}><X size={17}/></button>}</label><div className="count"><span>{filtered.length} ANSWER{filtered.length===1?"":"S"} FOUND</span><span>{category.toUpperCase()}</span></div>
        {filtered.length ? filtered.map((q)=><div className="qa" key={q.id}><button className="question" type="button" aria-expanded={opened===q.id} aria-controls={`answer-${q.id}`} onClick={()=>setOpened((prev)=>prev===q.id?null:q.id)}><span>{q.question}</span><ChevronDown size={21}/></button><div className="answer" id={`answer-${q.id}`} hidden={opened!==q.id}>{q.answer}</div></div>) : <div className="empty"><CircleHelp size={27}/><p>No matching answers. Try a different keyword or category.</p><button type="button" onClick={()=>{setSearch("");setCategory("All topics")}}>Show all questions</button></div>}
      </div></div></section>
    <section className="help"><div className="wrap helpbox"><div><span className="ey">SOMETHING ELSE?</span><h2>Let's talk about it.</h2><p>Contact us through our inquiry page. No message is sent until you use your own email app.</p></div><Link to="/contact">CONTACT & INQUIRIES <ArrowUpRight size={18}/></Link></div></section>
    <p className="watermark"><ShieldCheck size={13} style={{display:"inline",verticalAlign:"middle"}}/> {BRAND.watermark}</p>
  </div>;
}
