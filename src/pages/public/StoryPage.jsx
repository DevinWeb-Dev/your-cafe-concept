// YOUR CAFÉ — PART 10 | src/pages/public/StoryPage.jsx
// Editorial brand storytelling. Illustrative concept — no invented business history.
import { Link } from "react-router-dom";
import { ArrowRight, Coffee, Heart, Leaf, Sparkles, Sun, Quote } from "lucide-react";
import { BRAND, PHOTOS } from "../../data/config.js";

const PRINCIPLES = [
  { icon: Coffee, number: "01", title: "Made with intention", text: "From the first aroma to the last sip, thoughtful preparation is the experience we want to celebrate." },
  { icon: Heart, number: "02", title: "Room to belong", text: "A good café welcomes a solo morning, a catch-up with friends, and those moments in between." },
  { icon: Leaf, number: "03", title: "A slower rhythm", text: "Good things deserve attention. Our concept makes space for warmth, quiet details and unhurried conversation." },
];

export default function StoryPage() {
  return (
    <div className="yc10-story">
      <style>{`
        .yc10-story{color:#34261e;background:#faf5ec;overflow:hidden}.yc10-story *{box-sizing:border-box}
        .yc10-story .wrap{width:min(1280px,calc(100% - 56px));margin-inline:auto}.yc10-story .ey{font:800 10px/1.4 'DM Sans',sans-serif;letter-spacing:.2em;color:#a37b54;text-transform:uppercase}
        .yc10-story h1,.yc10-story h2,.yc10-story h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;letter-spacing:-.045em;text-wrap:balance}
        .yc10-story p{font-size:13px;line-height:1.95;color:#77685b}.yc10-story .cover{position:relative;min-height:min(760px,85vh);display:flex;align-items:center;background:#211811;color:#fff;isolation:isolate}
        .yc10-story .cover-bg{position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(25,17,13,.95) 0%,rgba(30,20,14,.67) 53%,rgba(30,20,14,.13)),url('${PHOTOS.interior}') center/cover}
        .yc10-story .cover-body{padding:125px 0;position:relative}.yc10-story .cover h1{font-size:clamp(70px,10vw,151px);line-height:.83;margin:27px 0;max-width:960px}.yc10-story .cover h1 em{color:#ddb88b;font-weight:400}.yc10-story .cover p{max-width:435px;color:#e0d3c6;font-size:14px}
        .yc10-story .cover .ey{color:#eed3ad}.yc10-story .cover a,.yc10-story .cta a{display:inline-flex;align-items:center;gap:13px;background:#b58b5a;color:#fff;padding:17px 24px;margin-top:25px;font-size:11px;font-weight:800;letter-spacing:.05em;transition:transform .25s}
        .yc10-story .cover a:hover,.yc10-story .cta a:hover{transform:translateY(-3px)}.yc10-story .intro{padding:115px 0 105px}.yc10-story .intro-layout{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:clamp(35px,7vw,130px);align-items:center}
        .yc10-story .intro h2,.yc10-story .craft h2,.yc10-story .values h2{font-size:clamp(54px,7vw,103px);line-height:.94;margin:19px 0 29px}.yc10-story h2 em{color:#aa8054;font-weight:400}
        .yc10-story .intro-img{position:relative;padding:0 0 8% 11%}.yc10-story .intro-img img{width:100%;height:560px;object-fit:cover;display:block}.yc10-story .intro-img:before{content:"";position:absolute;left:0;top:9%;width:35%;height:70%;background:#dfcbb4;z-index:0}.yc10-story .intro-img img{position:relative;z-index:1}
        .yc10-story .stamp{position:absolute;z-index:2;bottom:2%;right:-3%;width:137px;height:137px;display:grid;place-content:center;text-align:center;border-radius:50%;background:#52634c;color:#fff;transform:rotate(10deg);font-size:11px;line-height:1.6;letter-spacing:.07em}
        .yc10-story .quote{padding:90px 0;text-align:center;background:#e9ddcd}.yc10-story .quote svg{color:#a17b4f}.yc10-story .quote blockquote{margin:18px auto;font:italic 500 clamp(37px,5vw,75px)/1.08 'Cormorant Garamond',serif;max-width:910px;letter-spacing:-.035em}.yc10-story .quote p{letter-spacing:.12em;font-size:10px;font-weight:800}
        .yc10-story .craft{padding:110px 0;background:#2f231b;color:#fff}.yc10-story .craft-layout{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:clamp(30px,7vw,115px)}.yc10-story .craft h2{color:#f8efe2}.yc10-story .craft p{color:#d4c5b5}.yc10-story .craft img{width:100%;height:520px;object-fit:cover}.yc10-story .craft small{display:block;margin-top:13px;color:#bd9d7e;font-size:10px;letter-spacing:.12em}
        .yc10-story .values{padding:112px 0}.yc10-story .values-heading{max-width:800px;margin-bottom:45px}.yc10-story .value-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.yc10-story .value{padding:36px 30px;background:#fff9f1;border:1px solid #eadac7;min-width:0;transition:transform .25s}.yc10-story .value:hover{transform:translateY(-5px)}.yc10-story .value .vtop{display:flex;justify-content:space-between;align-items:center;color:#af8657}.yc10-story .value h3{font-size:36px;margin:34px 0 10px}.yc10-story .value p{font-size:12px;margin:0}
        .yc10-story .cta{padding:90px 0 100px;text-align:center;background:linear-gradient(#0006,#0006),url('${PHOTOS.cafeInterior}') center/cover;color:white}.yc10-story .cta h2{font:500 clamp(56px,8vw,115px)/.9 'Cormorant Garamond',Georgia,serif;margin:17px auto;max-width:890px;letter-spacing:-.04em}.yc10-story .cta p{color:#eaddcf}.yc10-story .concept-note{color:#988777;font-size:11px;margin-top:30px}
        @media(max-width:900px){.yc10-story .intro-layout,.yc10-story .craft-layout{grid-template-columns:1fr}.yc10-story .intro-img{max-width:620px}.yc10-story .value-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:620px){.yc10-story .wrap{width:calc(100% - 34px)}.yc10-story .cover{min-height:560px}.yc10-story .cover-body{padding:90px 0}.yc10-story .cover h1{font-size:clamp(65px,14vw,95px)}.yc10-story .intro,.yc10-story .craft,.yc10-story .values{padding:70px 0}.yc10-story .intro-img{padding-left:6%}.yc10-story .intro-img img,.yc10-story .craft img{height:345px}.yc10-story .stamp{width:100px;height:100px;right:0;font-size:9px}.yc10-story .value-grid{grid-template-columns:1fr}.yc10-story .quote{padding:70px 0}.yc10-story .cta{padding:75px 0}}
        @media(prefers-reduced-motion:reduce){.yc10-story a,.yc10-story .value{transition:none}}
      `}</style>
      <section className="cover" aria-label="Our café story"><div className="cover-bg"/><div className="wrap cover-body">
        <span className="ey">YOUR CAFÉ / AN EDITORIAL BRAND CONCEPT</span><h1>More than coffee.<br/><em>A feeling.</em></h1>
        <p>{BRAND.tagline} A thoughtful space where coffee, people and everyday moments meet.</p>
        <Link to="/menu">Explore our coffee <ArrowRight size={16}/></Link>
      </div></section>
      <section className="intro"><div className="wrap intro-layout"><div><span className="ey">OUR IMAGINED PHILOSOPHY</span><h2>Made for<br/><em>the moments.</em></h2><p>Great coffee has a way of making ordinary time feel special. This concept imagines a café built around the little things: beautifully prepared drinks, relaxed spaces, welcoming service, and conversations that seem to last a little longer.</p><p>Not every moment needs a grand occasion. Sometimes, a well-made cup and a comfortable place to sit are more than enough.</p><p className="concept-note">This is illustrative brand storytelling—not a claim about an operating café's real history or sourcing.</p></div><div className="intro-img"><img src={PHOTOS.cafeInterior} alt="Illustrative warm specialty café interior" loading="lazy"/><div className="stamp">CRAFTED<br/>WITH CARE<br/>✦</div></div></div></section>
      <section className="quote"><div className="wrap"><Quote size={28} aria-hidden="true"/><blockquote>“We believe the best parts of the day are often the ones we didn't rush.”</blockquote><p>YOUR CAFÉ — BRAND CONCEPT MANIFESTO</p></div></section>
      <section className="craft"><div className="wrap craft-layout"><img src={PHOTOS.coffeeCraft} alt="Illustrative handcrafted coffee preparation" loading="lazy"/><div><span className="ey">THE RITUAL OF A GOOD CUP</span><h2>Little details.<br/><em>Lasting warmth.</em></h2><p>Consider the first aroma, the contrast of crema and milk, the warmth of ceramics, and the quiet rhythm of the coffee bar. Each detail creates a sensory experience worth staying for.</p><p>Our digital experience mirrors that philosophy: refined, warm, simple to navigate, and thoughtfully crafted.</p><small>VISUALS AND DESCRIPTIONS ARE CONCEPT SAMPLES</small></div></div></section>
      <section className="values"><div className="wrap"><div className="values-heading"><span className="ey">THINGS THAT MATTER</span><h2>A little more <em>heart</em> in every cup.</h2></div><div className="value-grid">{PRINCIPLES.map(({icon:Icon,...x})=><article className="value" key={x.number}><div className="vtop"><Icon size={29} strokeWidth={1.5}/><span>{x.number}</span></div><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></div></section>
      <section className="cta"><div className="wrap"><span className="ey">TAKE YOUR TIME</span><h2>Your next favorite moment starts here.</h2><p>Explore our illustrative menu or preview a table booking.</p><Link to="/reserve">Find a seat <ArrowRight size={17}/></Link></div></section>
      <p style={{textAlign:"center",padding:"20px",fontSize:10,color:"#8c7d6d",background:"#faf5ec",margin:0}}><Sun size={12} style={{display:"inline",verticalAlign:"middle"}}/> {BRAND.watermark}</p>
    </div>
  );
}
