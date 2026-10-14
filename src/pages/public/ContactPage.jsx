// YOUR CAFÉ — Contact & Inquiries
// Location: src/pages/public/ContactPage.jsx
// Frontend-only prototype · Web Developer Devin Planas
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock3, Coffee, Copy, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { BRAND, PHOTOS } from "../../data/config.js";

const isConfiguredEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
const usableUrl = (url) => /^https:\/\//i.test(url || "");

export default function ContactPage() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("General inquiry");
  const [message, setMessage] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const emailReady = isConfiguredEmail(BRAND.email);
  const details = `YOUR CAFÉ — ${topic}\nFrom: ${name.trim() || "Café Guest"}\n\n${message.trim()}\n\nPrepared using the YOUR CAFÉ website concept.`;
  const mailUrl = emailReady ? `mailto:${BRAND.email}?subject=${encodeURIComponent(`YOUR CAFÉ: ${topic}`)}&body=${encodeURIComponent(details)}` : "";

  function prepare(event) {
    event.preventDefault();
    if (message.trim().length < 10) { setError("Please write at least 10 characters so the inquiry is meaningful."); setPrepared(false); return; }
    setError("");setPrepared(true);setCopied(false);
  }
  async function copy() {
    try { await navigator.clipboard.writeText(details);setCopied(true);setError(""); }
    catch { setError("Clipboard access is unavailable. Please manually copy your message from the fields."); }
  }

  return <div className="yc9-contact">
    <style>{`
      .yc9-contact{color:#39291e;background:#faf5ed;min-width:0}.yc9-contact *{box-sizing:border-box}.yc9-contact .wrap{width:min(1250px,calc(100% - 48px));margin:auto}
      .yc9-contact .overline{font:800 10px 'DM Sans',sans-serif;letter-spacing:.2em;color:#b18459;text-transform:uppercase}
      .yc9-contact h1,.yc9-contact h2,.yc9-contact h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;letter-spacing:-.035em}
      .yc9-contact .hero{display:grid;grid-template-columns:1fr 1fr;min-height:550px;background:#281b14;color:#fff;max-height:none;height:auto}
      .yc9-contact .hero-text{padding:clamp(60px,8vw,130px) max(24px,calc((100vw - 1250px)/2));padding-right:clamp(20px,4vw,90px);display:flex;flex-direction:column;justify-content:center;min-width:0}
      .yc9-contact .hero h1{font-size:clamp(67px,8vw,115px);line-height:.85;margin:26px 0 25px}.yc9-contact .hero h1 em{color:#e3c29c}.yc9-contact .hero p{font-size:13px;line-height:1.95;color:#e0d1c1;max-width:470px}
      .yc9-contact .hero-photo{min-width:0;min-height:450px;background:linear-gradient(#4e2d1544,#1f130e33),url('${PHOTOS.cafeInterior}') center/cover}
      .yc9-contact .content{display:grid;grid-template-columns:minmax(0,.88fr) minmax(0,1.12fr);gap:clamp(32px,7vw,100px);padding:95px 0 105px}
      .yc9-contact .details h2,.yc9-contact .form h2{font-size:clamp(48px,5vw,68px);line-height:.92;margin:17px 0 25px}
      .yc9-contact .details > p{font-size:13px;line-height:1.9;color:#88715d;max-width:435px}
      .yc9-contact .info-row{display:flex;align-items:flex-start;gap:15px;border-bottom:1px solid #e4d6c7;padding:23px 0}.yc9-contact .info-row svg{color:#98714f;flex-shrink:0}.yc9-contact .info-row strong{display:block;font-size:12px;margin-bottom:7px}.yc9-contact .info-row span,.yc9-contact .info-row a{font-size:12px;color:#8c715a;line-height:1.8;overflow-wrap:anywhere}
      .yc9-contact .form{background:#fffaf4;border:1px solid #e7d9c9;padding:clamp(23px,4vw,42px)}.yc9-contact .form h2{margin-bottom:10px}.yc9-contact .form>p{font-size:12px;line-height:1.8;color:#87705b;margin-bottom:25px}
      .yc9-contact label{display:block;font-size:10px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;margin:18px 0 9px;color:#6f5340}
      .yc9-contact input,.yc9-contact textarea,.yc9-contact select{display:block;width:100%;min-width:0;background:white;border:1px solid #d9c8b4;color:#3d2b1f;padding:14px 15px;font-size:13px;border-radius:0}
      .yc9-contact textarea{min-height:158px;resize:vertical;line-height:1.75}.yc9-contact .prepare,.yc9-contact .copy,.yc9-contact .mailto{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:49px;border:1px solid #3d2b21;padding:13px 18px;font-size:11px;font-weight:800;text-decoration:none;cursor:pointer}
      .yc9-contact .prepare,.yc9-contact .mailto{background:#3d2b21;color:#fff}.yc9-contact .prepare{width:100%;margin-top:23px}.yc9-contact .copy{background:transparent;color:#3d2b21}
      .yc9-contact .result{margin-top:18px;padding:17px;background:#f0e7d8;border:1px solid #d8c4ae}.yc9-contact .result p{font-size:12px;line-height:1.8}.yc9-contact .result .result-actions{display:flex;gap:10px;flex-wrap:wrap}.yc9-contact .error{font-size:12px;color:#a0382f}
      .yc9-contact .bottom{background:#eae0d2;padding:70px 0;text-align:center}.yc9-contact .bottom h2{font-size:clamp(45px,6vw,70px);line-height:.95;margin:0 0 17px}.yc9-contact .bottom p{font-size:12px;line-height:1.8;color:#7f6b59}
      .yc9-contact .bottom a{display:inline-flex;align-items:center;gap:10px;padding:14px 20px;margin-top:15px;background:#34251d;color:#fff;font-size:11px;font-weight:800}
      @media(max-width:900px){.yc9-contact .hero{grid-template-columns:1fr}.yc9-contact .hero-text{padding:80px 32px 55px}.yc9-contact .hero-photo{min-height:310px}.yc9-contact .content{grid-template-columns:1fr}}
      @media(max-width:500px){.yc9-contact .wrap{width:calc(100% - 32px)}.yc9-contact .hero-text{padding:65px 17px 45px}.yc9-contact .hero h1{font-size:65px}.yc9-contact .content{padding:60px 0}.yc9-contact .form{padding:20px}.yc9-contact .result-actions>*{width:100%}}
    `}</style>
    <section className="hero"><div className="hero-text"><span className="overline">A WARM WELCOME, ALWAYS</span><h1>Say hello.<br/><em>Stay awhile.</em></h1><p>Whether it's a quiet coffee question, an event idea or a special gathering, we'd love to help you prepare your inquiry.</p></div><div className="hero-photo" role="img" aria-label="Illustrative café interior photography"/></section>
    <section className="content wrap"><div className="details"><span className="overline">VISIT & CONNECT</span><h2>Your next coffee moment.</h2><p>This is a customizable café concept. Business contact information has not yet been verified; replace placeholders with the real café's details before publishing.</p>
      <div className="info-row"><MapPin size={22}/><div><strong>CAFÉ LOCATION</strong><span>{BRAND.address || "Branch address to be confirmed"}</span></div></div>
      <div className="info-row"><Clock3 size={22}/><div><strong>OPENING HOURS</strong><span>{BRAND.openingHours || "Hours to be confirmed"}</span></div></div>
      <div className="info-row"><Phone size={22}/><div><strong>PHONE</strong><span>{BRAND.phone || "Phone number to be confirmed"}</span></div></div>
      <div className="info-row"><Mail size={22}/><div><strong>EMAIL</strong>{emailReady ? <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> : <span>Official café email not configured yet</span>}</div></div>
      {usableUrl(BRAND.facebook) && <div className="info-row"><MessageCircle size={22}/><div><strong>FACEBOOK</strong><a href={BRAND.facebook} rel="noopener noreferrer" target="_blank">Visit café Facebook <ArrowRight size={13}/></a></div></div>}
    </div>
      <form className="form" onSubmit={prepare}><span className="overline">WRITE A NOTE</span><h2>What's on your mind?</h2><p>Prepare a message below. This frontend demo <strong>does not send or store your inquiry</strong>. Copy it or open your email application if an official address has been configured.</p>
        <label htmlFor="yc9-contact-name">Your name or nickname</label><input id="yc9-contact-name" maxLength={60} value={name} onChange={(e) => {setName(e.target.value);setPrepared(false);}} placeholder="Coffee lover"/>
        <label htmlFor="yc9-contact-topic">Inquiry topic</label><select id="yc9-contact-topic" value={topic} onChange={(e) => {setTopic(e.target.value);setPrepared(false);}}><option>General inquiry</option><option>Table reservation question</option><option>Private gathering</option><option>Workshop & events</option><option>Business collaboration</option></select>
        <label htmlFor="yc9-contact-message">Message</label><textarea id="yc9-contact-message" maxLength={1200} value={message} onChange={(e) => {setMessage(e.target.value);setPrepared(false);}} placeholder="Tell us what you're thinking..." required/>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="prepare" type="submit"><Send size={17}/> PREPARE INQUIRY <ArrowRight size={16}/></button>
        {prepared && <div className="result" role="status"><p><Check size={16}/> Your message is ready. <strong>Nothing has been sent.</strong></p><div className="result-actions"><button type="button" className="copy" onClick={copy}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "COPIED" : "COPY MESSAGE"}</button>{emailReady && <a className="mailto" href={mailUrl}><Mail size={16}/> OPEN EMAIL APP</a>}</div></div>}
      </form></section>
    <section className="bottom"><div className="wrap"><Coffee size={30} color="#91714e"/><h2>The best conversations<br/><em>start with coffee.</em></h2><p>Plan a visit, explore the menu or reserve a sample table.</p><Link to="/reserve">Explore table reservations <ArrowRight size={17}/></Link><p>{BRAND.watermark}</p></div></section>
  </div>;
}
