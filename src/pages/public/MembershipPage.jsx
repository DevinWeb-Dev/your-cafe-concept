// YOUR CAFÉ — BATCH 8 / MEMBERSHIP & LOYALTY CONCEPT
// A local preview, not real accounts or redeemable rewards.
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Coffee, Sparkles } from "lucide-react";
import { BRAND, LOYALTY_TIERS, PHOTOS, POLICIES, getLoyaltyTier } from "../../data/config.js";
import { useCafe } from "../../context/CafeContext.jsx";

const PROFILE_KEY = "your-cafe-demo-member-nickname-v1";
function initialNickname() {
  try { return localStorage.getItem(PROFILE_KEY) || ""; } catch { return ""; }
}

export default function MembershipPage() {
  const { getMemberPoints } = useCafe();
  const [draftName, setDraftName] = useState(initialNickname);
  const [nickname, setNickname] = useState(initialNickname);

  const points = nickname.trim() ? getMemberPoints(nickname.trim()) : 0;
  const tier = getLoyaltyTier(points) || LOYALTY_TIERS[0];
  const currentIndex = LOYALTY_TIERS.findIndex((t) => t.id === tier.id);
  const next = LOYALTY_TIERS[currentIndex + 1] || null;
  const progress = next ? Math.min(100, Math.max(0, ((points - tier.minPoints) / (next.minPoints - tier.minPoints)) * 100)) : 100;

  const saveName = (event) => {
    event.preventDefault();
    const cleaned = draftName.trim().slice(0, 40);
    setNickname(cleaned);
    setDraftName(cleaned);
    try {
      if (cleaned) localStorage.setItem(PROFILE_KEY, cleaned);
      else localStorage.removeItem(PROFILE_KEY);
    } catch { /* storage may be blocked */ }
  };
  const remaining = next ? Math.max(0, next.minPoints - points) : 0;
  const benefits = useMemo(() => tier.benefits || [], [tier]);

  return <div className="yc8-membership">
    <style>{`
      .yc8-membership{background:#faf5ec;color:#38271d;min-width:0}.yc8-membership *{box-sizing:border-box}
      .yc8-membership .container{width:min(1280px,calc(100% - 64px));margin-inline:auto}
      .yc8-membership .hero{min-height:530px;height:auto;display:grid;align-items:center;background:#281b16;isolation:isolate;position:relative;overflow:hidden;color:#f6eee5}
      .yc8-membership .hero::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,#241813f2 0%,#241813d8 42%,#24181365 100%),var(--member-photo) center/cover}
      .yc8-membership .hero-inner{padding:100px 0;max-width:640px}
      .yc8-membership .kicker{display:block;font-size:10px;letter-spacing:.2em;font-weight:800;color:#cbad86}
      .yc8-membership h1{font:500 clamp(65px,8vw,116px)/.86 'Cormorant Garamond',Georgia,serif;margin:25px 0}
      .yc8-membership h1 em{color:#d6b692;font-weight:400}.yc8-membership .hero p{font-size:13px;line-height:1.9;color:#e4d7c8;max-width:450px}
      .yc8-membership .content{padding:80px 0 95px}.yc8-membership .two-col{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(280px,0.9fr);gap:28px;align-items:stretch;margin-bottom:78px}
      .yc8-membership .pane{padding:clamp(22px,4vw,42px);background:#fffaf4;border:1px solid #eadbca;min-width:0}
      .yc8-membership h2{font:500 clamp(35px,4vw,54px)/1 'Cormorant Garamond',Georgia,serif;margin:12px 0 16px}.yc8-membership .description{font-size:12px;line-height:1.9;color:#8a7662}
      .yc8-membership label{display:block;font-size:10px;font-weight:800;letter-spacing:.11em;margin:30px 0 10px;color:#7c6046}
      .yc8-membership .entry{display:flex;gap:8px}.yc8-membership input{min-width:0;width:100%;padding:14px 15px;border:1px solid #d9c6b0;background:#fffdf9;outline-color:#ad855e;font-size:12px}
      .yc8-membership button,.yc8-membership .cta{cursor:pointer;background:#3e2c21;border:1px solid #3e2c21;color:#fff;padding:13px 19px;font:800 11px 'DM Sans',sans-serif;display:inline-flex;align-items:center;justify-content:center;gap:10px;transition:background .3s,transform .3s}
      .yc8-membership button:hover,.yc8-membership .cta:hover{background:#765339;transform:translateY(-2px)}
      .yc8-membership .points{display:flex;align-items:baseline;flex-wrap:wrap;gap:9px;margin:23px 0 10px}.yc8-membership .points strong{font:600 62px/1 'Cormorant Garamond',Georgia,serif}.yc8-membership .points span{font-size:10px;font-weight:800;letter-spacing:.12em;color:#9a7d5c}
      .yc8-membership .progress{height:8px;background:#eee0ce;overflow:hidden;margin:15px 0 10px}.yc8-membership .progress i{display:block;height:100%;background:#ac845f;transition:width .4s}
      .yc8-membership .progress-label{font-size:10px;color:#8b775f;display:flex;justify-content:space-between;gap:14px}
      .yc8-membership .member-card{padding:35px;display:flex;flex-direction:column;justify-content:space-between;min-height:335px;background:radial-gradient(circle at 90% 10%,#79614970,transparent 50%),linear-gradient(135deg,#36251d,#5b4232 60%,#241813);color:#ffefd9;position:relative;overflow:hidden;box-shadow:0 26px 60px #39241f33}
      .yc8-membership .member-card::after{content:"";position:absolute;width:280px;height:280px;border:1px solid #ffffff21;border-radius:50%;right:-100px;top:-105px;box-shadow:0 0 0 35px #ffffff08,0 0 0 70px #ffffff05;pointer-events:none}
      .yc8-membership .card-top,.yc8-membership .card-bottom{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;position:relative;z-index:1}
      .yc8-membership .card-top b{font-size:11px;letter-spacing:.17em}.yc8-membership .card-middle{position:relative;z-index:1}.yc8-membership .card-middle small{display:block;font-size:9px;letter-spacing:.15em;color:#d0b69b}
      .yc8-membership .card-middle strong{display:block;font:500 clamp(42px,5vw,62px)/1 'Cormorant Garamond',Georgia,serif;margin-top:7px;overflow-wrap:anywhere}
      .yc8-membership .card-bottom span{font-size:9px;letter-spacing:.09em;color:#e2cab0;overflow-wrap:anywhere}
      .yc8-membership .tiers{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px}.yc8-membership .tier{padding:26px 20px;background:#fffaf4;border:1px solid #e5d6c3;min-width:0;display:flex;flex-direction:column;align-items:start}
      .yc8-membership .tier.current{border-color:#ad845d;box-shadow:0 15px 40px #8b60321a}.yc8-membership .tier .symbol{width:37px;height:37px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:#fff;margin-bottom:24px}
      .yc8-membership .tier small{font-size:9px;letter-spacing:.1em;font-weight:800;color:#99816b}.yc8-membership .tier h3{font:600 32px/1 'Cormorant Garamond',Georgia,serif;min-height:65px;margin:12px 0 10px;overflow-wrap:anywhere}
      .yc8-membership .tier ul{list-style:none;padding:0;margin:15px 0 0;display:grid;gap:12px}.yc8-membership .tier li{display:flex;gap:7px;align-items:start;color:#82705e;font-size:11px;line-height:1.5}.yc8-membership .tier li svg{flex-shrink:0;color:#687e5c}
      .yc8-membership .footer-cta{margin-top:70px;padding:32px 36px;background:#efe3d2;display:flex;align-items:center;justify-content:space-between;gap:25px;flex-wrap:wrap}.yc8-membership .footer-cta h2{margin:0 0 8px}.yc8-membership .footer-cta p{margin:0;font-size:11px;color:#816d5a}
      .yc8-membership .disclaimer{font-size:11px;line-height:1.8;color:#8f7a66;margin-top:20px}
      @media(max-width:1000px){.yc8-membership .tiers{grid-template-columns:repeat(2,minmax(0,1fr))}.yc8-membership .two-col{grid-template-columns:1fr}}
      @media(max-width:600px){.yc8-membership .container{width:calc(100% - 34px)}.yc8-membership .hero-inner{padding:75px 0}.yc8-membership .content{padding:50px 0}.yc8-membership .entry{flex-direction:column}.yc8-membership .tiers{gap:10px}.yc8-membership .tier{padding:18px 13px}.yc8-membership .tier h3{font-size:28px;min-height:65px}.yc8-membership .member-card{padding:25px}.yc8-membership .footer-cta{padding:24px}}
      @media(max-width:370px){.yc8-membership .tiers{grid-template-columns:1fr}.yc8-membership .tier h3{min-height:auto}}
      @media(prefers-reduced-motion:reduce){.yc8-membership *{transition:none!important}}
    `}</style>
    <section className="hero" style={{"--member-photo":`url('${PHOTOS.cafeInterior}')`}}>
      <div className="container hero-inner"><span className="kicker">YOUR CAFÉ / COFFEE REWARDS</span><h1>Good coffee.<br/><em>Better moments.</em></h1><p>A beautifully designed loyalty experience for the everyday coffee ritual. Explore your demo tier, preview rewards, and enjoy every detail.</p></div>
    </section>
    <div className="container content"><div className="two-col"><div className="pane"><span className="kicker">01 / YOUR LOCAL MEMBERSHIP PREVIEW</span><h2>Make it a daily ritual.</h2><p className="description">For demonstration purposes, enter the same nickname used on a paid demo order. The preview calculates points from matching paid orders stored in this browser—no real membership account is created.</p>
      <form onSubmit={saveName}><label htmlFor="yc8-member-name">DEMO CUSTOMER NICKNAME</label><div className="entry"><input id="yc8-member-name" value={draftName} onChange={(e)=>setDraftName(e.target.value)} maxLength={40} placeholder="Example: Coffee Explorer" autoComplete="off"/><button type="submit">Preview Tier <ArrowRight size={15}/></button></div></form>
      <div className="points"><strong>{points.toLocaleString("en-PH")}</strong><span>DEMO POINTS</span></div>
      <div className="progress" role="progressbar" aria-label="Progress to next rewards tier" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><i style={{width:`${progress}%`}}/></div>
      <div className="progress-label"><span>{tier.name}</span><span>{next ? `${remaining} points until ${next.name}` : "Highest demo tier unlocked"}</span></div>
      <p className="description">Illustrative formula: one point per {`₱${POLICIES.loyaltySpendPerPoint}`} in paid demo orders. The engine currently counts paid orders; it does not require completed preparation.</p>
    </div><div className="member-card" aria-label="Digital demo membership card">
      <div className="card-top"><b>{BRAND.name}</b><Coffee size={28}/></div>
      <div className="card-middle"><small>YOUR COFFEE JOURNEY</small><strong>{tier.name}</strong></div>
      <div className="card-bottom"><span>{nickname.trim() || "YOUR NAME HERE"}</span><span>DEMO • NOT REDEEMABLE</span></div>
    </div></div>
    <span className="kicker">02 / THE JOURNEY</span><h2>The more you sip, <em>the richer the story.</em></h2>
    <div className="tiers">{LOYALTY_TIERS.map((level) => <article key={level.id} className={`tier ${tier.id === level.id ? "current" : ""}`} style={{"--accent":level.color}}>
      <span className="symbol"><Sparkles size={18}/></span><small>{level.minPoints.toLocaleString("en-PH")}+ POINTS</small><h3>{level.name}</h3>
      {tier.id === level.id && <small>YOUR CURRENT DEMO TIER</small>}
      <ul>{level.benefits.map((benefit) => <li key={benefit}><CheckCircle2 size={14}/>{benefit}</li>)}</ul>
    </article>)}</div>
    <div className="footer-cta"><div><h2>Find your next favorite.</h2><p>Discover the signature drinks behind every coffee moment.</p></div><Link to="/menu" className="cta">Explore Café Menu <ArrowRight size={17}/></Link></div>
    <p className="disclaimer">Loyalty is a local demo only. Nicknames are not verified identities; points and tier privileges cannot be redeemed at a real café. Do not use real customer details in a public prototype.</p>
    </div>
  </div>;
}
