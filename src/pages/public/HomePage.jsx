// YOUR CAFÉ — Premium customer homepage
// FILE: src/pages/public/HomePage.jsx
// Website Concept Made by: Web Developer Devin Planas
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Armchair,
  Coffee, Heart, Leaf, Plus, Sparkles, Sun,
} from "lucide-react";
import {
  BRAND, MENU_CATEGORIES, MENU_ITEMS, PHOTOS,
  SEATING_ZONES, formatPeso,
} from "../../data/config.js";
import { useCafe } from "../../context/CafeContext.jsx";
import DrinkCustomizer from "../../components/DrinkCustomizer.jsx";

function Kicker({ children, light = false }) {
  return <span className={`yc-home-kicker ${light ? "light" : ""}`}><span aria-hidden="true"/> {children}</span>;
}

function FeatureProduct({ product }) {
  const [customize, setCustomize] = useState(false);
  return <>
    <article className="product-card yc-home-product">
      <div className="product-image">
        <img src={product.image} alt={`Illustrative photo for ${product.name}`} loading="lazy" />
        {product.signature && <span className="signature-tag">SIGNATURE</span>}
      </div>
      <div className="product-details">
        <span className="product-category">{MENU_CATEGORIES.find((item) => item.id === product.categoryId)?.name || "CAFÉ FAVORITE"}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-bottom">
          <strong>{formatPeso(product.price)}</strong>
          <button type="button" aria-label={`Customize ${product.name}`} onClick={() => setCustomize(true)}><Plus size={18}/></button>
        </div>
      </div>
    </article>
    <DrinkCustomizer open={customize} product={product} onClose={() => setCustomize(false)}/>
  </>;
}

export default function HomePage() {
  const { stats } = useCafe();
  const featured = MENU_ITEMS.filter((item) => item.available && item.featured).slice(0, 4);

  return <div className="yc-home">
    {/* Cinematic coffee arrival */}
    <section className="hero yc-home-hero">
      <div className="hero-image" style={{
        backgroundImage: `linear-gradient(92deg,rgba(30,19,13,.95) 0%,rgba(30,19,13,.84) 30%,rgba(30,19,13,.22) 72%,rgba(30,19,13,.09) 100%),url('${PHOTOS.hero}')`,
      }}/>
      <div className="shell hero-content">
        <Kicker light>A SPACE FOR LIFE'S LITTLE MOMENTS</Kicker>
        <h1>Crafted <i>with care.</i><br/>Served with <em>soul.</em></h1>
        <p>Exceptional coffee. Beautifully unhurried moments. An everyday ritual worth slowing down for.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/menu">Discover Our Menu <ArrowUpRight size={17}/></Link>
          <Link className="btn btn-outline" to="/reserve">Reserve a Table <ArrowRight size={17}/></Link>
        </div>
        <span className="hero-foot"><span className="hero-foot-line"/> SPECIALTY COFFEE · EVERYDAY RITUALS · WARM HOSPITALITY</span>
      </div>
      <div className="yc-hero-coffee-tag"><Coffee size={22}/><div><strong>A moment in every cup</strong><small>{BRAND.subtitle}</small></div></div>
    </section>

    {/* A quiet ribbon instead of a generic feature grid */}
    <div className="marquee-strip yc-coffee-ribbon" aria-label="Our café values">
      <div className="shell"><span>BREWED WITH PURPOSE</span><b>✦</b><span>MADE FOR CONNECTION</span><b>✦</b><span>SAVOR THE SLOW MOMENTS</span><b>✦</b><span>THE ART OF EVERYDAY COFFEE</span></div>
    </div>

    {/* Specialty selection */}
    <section className="section cream yc-home-collection">
      <div className="shell">
        <div className="section-top">
          <div><Kicker>FROM OUR COFFEE BAR</Kicker><h2>Beautifully made.<br/><em>Thoughtfully enjoyed.</em></h2></div>
          <Link className="text-link" to="/menu">DISCOVER THE FULL MENU <ArrowUpRight size={17}/></Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => <FeatureProduct key={product.id} product={product}/>) }
        </div>
        <p className="yc-home-products-note">Illustrative menu, photography and sample prices in Philippine pesos.</p>
      </div>
    </section>

    {/* An editorial architectural composition */}
    <section className="yc-home-editorial">
      <div className="yc-home-editorial-media">
        <img src={PHOTOS.interior} alt="Illustrative warm specialty coffee shop interior" loading="lazy"/>
        <div className="yc-home-photo-stamp"><span>01</span> A PLACE TO BELONG</div>
      </div>
      <div className="yc-home-editorial-copy">
        <Kicker>A LITTLE MORE THAN COFFEE</Kicker>
        <h2>Stay a little.<br/><em>Savor a lot.</em></h2>
        <p>Some moments deserve to be unhurried. A quiet window seat, a warm cup in your hands, and the simple pleasure of being right where you want to be.</p>
        <p>Discover our concept café spaces and reserve a comfortable place for your next conversation.</p>
        <Link to="/reserve" className="btn btn-primary">Find Your Perfect Seat <ArrowUpRight size={17}/></Link>
        <div className="yc-home-space-stats">
          <span><Armchair size={17}/><strong>{stats.totalTables}</strong><small>DEMO SEATING UNITS</small></span>
          <span><Sun size={17}/><strong>{SEATING_ZONES.length}</strong><small>SEATING EXPERIENCES</small></span>
        </div>
      </div>
    </section>

    {/* Purposefully asymmetrical visual storytelling */}
    <section className="yc-home-craft">
      <div className="shell yc-home-craft-grid">
        <div className="yc-home-craft-copy">
          <Kicker light>THE ART BEHIND EVERY CUP</Kicker>
          <h2>Good coffee is<br/><em>a beautiful ritual.</em></h2>
          <p>From the aroma of freshly ground beans to that first calming sip, every detail creates a feeling worth returning to.</p>
          <Link className="yc-home-underline-link" to="/story">THE STORY BEHIND THE CUP <ArrowUpRight size={17}/></Link>
          <div className="yc-home-craft-points">
            <span><Leaf size={18}/> Thoughtful coffee preparation</span>
            <span><Heart size={18}/> Hospitality in every detail</span>
            <span><Sparkles size={18}/> Warm, welcoming café moments</span>
          </div>
        </div>
        <div className="yc-home-craft-images">
          <img className="yc-craft-main" src={PHOTOS.coffeeCraft} alt="Illustrative coffee brewing arrangement" loading="lazy" />
          <img className="yc-craft-detail" src={PHOTOS.beans} alt="Illustrative coffee beans" loading="lazy" />
          <span className="yc-craft-caption">SLOW COFFEE. BEAUTIFUL DAYS.</span>
        </div>
      </div>
    </section>

    {/* Real destinations — not dead feature buttons */}
    <section className="yc-home-journey section cream">
      <div className="shell">
        <div className="section-top"><div><Kicker>YOUR NEXT MOMENT STARTS HERE</Kicker><h2>More ways to <em>feel at home.</em></h2></div></div>
        <div className="yc-home-journey-grid">
          <Link to="/menu" className="yc-home-journey-card"><div className="yc-journey-photo" style={{backgroundImage:`url('${PHOTOS.latte}')`}}/><span>01 / DISCOVER</span><h3>Find your favorite cup.</h3><p>Explore specialty coffee, comforting drinks, pastries and café classics.</p><ArrowUpRight size={22}/></Link>
          <Link to="/cart" className="yc-home-journey-card"><div className="yc-journey-photo" style={{backgroundImage:`url('${PHOTOS.croissant}')`}}/><span>02 / ENJOY</span><h3>Build your coffee order.</h3><p>Customize a beverage, choose your favorites, and explore our demo checkout.</p><ArrowUpRight size={22}/></Link>
          <Link to="/reserve" className="yc-home-journey-card"><div className="yc-journey-photo" style={{backgroundImage:`url('${PHOTOS.cafeInterior}')`}}/><span>03 / SETTLE IN</span><h3>A table just for you.</h3><p>Select a café seating area and try our local reservation experience.</p><ArrowUpRight size={22}/></Link>
        </div>
      </div>
    </section>

    <section className="yc-home-finale">
      <div className="shell"><Kicker light>EVERYDAY MOMENTS, BEAUTIFULLY BREWED</Kicker><h2>There is always time<br/>for <em>one more cup.</em></h2><p>Choose something wonderful from our menu. Make your next coffee ritual your own.</p><Link to="/menu" className="btn btn-primary">Explore the Coffee Menu <ArrowUpRight size={17}/></Link><span><ArrowDownRight size={18}/> {BRAND.tagline}</span></div>
    </section>

    <style>{`
      .yc-home .yc-home-kicker{display:inline-flex;align-items:center;gap:12px;color:#997247;font-size:10px;letter-spacing:.16em;font-weight:800;line-height:1.5}
      .yc-home .yc-home-kicker>span{display:block;width:30px;height:1px;background:#b58b5a;flex-shrink:0}
      .yc-home .yc-home-kicker.light{color:#e6cfb3}
      .yc-home .yc-home-hero{min-height:620px}
      .yc-home .yc-home-hero .hero-image{background-position:center;filter:saturate(.82)}
      .yc-home .yc-hero-coffee-tag{position:absolute;right:max(36px,calc((100vw - 1350px)/2));bottom:46px;z-index:2;display:flex;align-items:center;gap:14px;padding:19px 25px;background:#f7eee4ed;color:#3f2b1e;box-shadow:0 20px 70px #0003}
      .yc-home .yc-hero-coffee-tag>div{display:flex;flex-direction:column;gap:5px}
      .yc-home .yc-hero-coffee-tag strong{font-size:12px}
      .yc-home .yc-hero-coffee-tag small{font-size:9px;letter-spacing:.1em;color:#856a50}
      .yc-home .yc-home-collection{padding-bottom:110px}
      .yc-home .yc-home-collection .product-grid{gap:22px}
      .yc-home .yc-home-product .product-image{overflow:hidden}
      .yc-home .yc-home-product .product-details{min-height:220px}
      .yc-home .yc-home-products-note{margin-top:26px;font-size:10px;color:#8f806e}
      .yc-home .yc-home-editorial{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);min-height:680px;background:#eee3d4}
      .yc-home .yc-home-editorial-media{position:relative;min-height:480px;overflow:hidden;background:#bea58d}
      .yc-home .yc-home-editorial-media>img{width:100%;height:100%;object-fit:cover}
      .yc-home .yc-home-photo-stamp{position:absolute;bottom:0;left:0;display:flex;align-items:center;gap:15px;padding:17px 23px;background:#38291f;color:#f4eadd;font-size:10px;letter-spacing:.14em}
      .yc-home .yc-home-photo-stamp span{font:500 30px 'Cormorant Garamond',serif;color:#d4b48b}
      .yc-home .yc-home-editorial-copy{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;min-width:0;padding:clamp(42px,8vw,120px)}
      .yc-home .yc-home-editorial-copy h2,.yc-home .yc-home-craft h2,.yc-home .yc-home-finale h2{font:500 clamp(55px,6vw,96px)/.92 'Cormorant Garamond',serif;letter-spacing:-.043em;margin:20px 0 25px;text-wrap:balance;overflow-wrap:anywhere}
      .yc-home .yc-home-editorial-copy h2 em,.yc-home .yc-home-craft h2 em,.yc-home .yc-home-finale h2 em{font-weight:400;color:#a77d51}
      .yc-home .yc-home-editorial-copy p{font-size:13px;line-height:1.95;color:#756656;max-width:480px;margin:0 0 17px}
      .yc-home .yc-home-editorial-copy .btn{margin-top:15px}
      .yc-home .yc-home-space-stats{display:flex;flex-wrap:wrap;gap:35px;margin-top:54px}
      .yc-home .yc-home-space-stats>span{display:grid;grid-template-columns:24px auto;column-gap:12px;align-items:center}
      .yc-home .yc-home-space-stats strong{font:500 36px/.9 'Cormorant Garamond',serif}
      .yc-home .yc-home-space-stats small{grid-column:2;color:#876e55;font-size:9px;letter-spacing:.1em;margin-top:8px}
      .yc-home .yc-home-craft{background:#2b2019;color:#f8f0e4;padding:clamp(85px,10vw,150px) 0;overflow:hidden}
      .yc-home .yc-home-craft-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(40px,7vw,120px);align-items:center}
      .yc-home .yc-home-craft h2{margin:24px 0 27px}
      .yc-home .yc-home-craft p{font-size:13px;line-height:1.95;color:#cbbba9;max-width:460px}
      .yc-home .yc-home-underline-link{display:inline-flex;align-items:center;gap:15px;color:#d2ac7c;border-bottom:1px solid #ae8455;padding:10px 0;margin-top:19px;font-size:10px;letter-spacing:.1em;font-weight:800}
      .yc-home .yc-home-craft-points{display:grid;gap:15px;margin-top:57px}
      .yc-home .yc-home-craft-points span{display:flex;align-items:center;gap:13px;color:#dfcdb8;font-size:12px}
      .yc-home .yc-home-craft-points svg{color:#d2b08a}
      .yc-home .yc-home-craft-images{position:relative;min-height:590px}
      .yc-home .yc-home-craft-images .yc-craft-main{position:absolute;top:0;right:0;width:79%;height:81%;object-fit:cover;filter:saturate(.8)}
      .yc-home .yc-home-craft-images .yc-craft-detail{position:absolute;bottom:0;left:0;width:42%;height:45%;object-fit:cover;border:10px solid #2b2019;filter:saturate(.8)}
      .yc-home .yc-craft-caption{position:absolute;right:0;bottom:3%;font-size:9px;letter-spacing:.15em;color:#d1b593}
      .yc-home .yc-home-journey-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px}
      .yc-home .yc-home-journey-card{display:flex;flex-direction:column;min-width:0;position:relative;padding:0 0 20px;border-bottom:1px solid #d3c3ae}
      .yc-home .yc-journey-photo{width:100%;aspect-ratio:1.35;background-size:cover;background-position:center;filter:saturate(.82);transition:transform .5s}
      .yc-home .yc-home-journey-card:hover .yc-journey-photo{transform:translateY(-4px)}
      .yc-home .yc-home-journey-card>span{color:#9c7554;font-size:10px;font-weight:800;letter-spacing:.13em;margin:25px 0 8px}
      .yc-home .yc-home-journey-card h3{font:500 clamp(29px,3vw,43px)/1.05 'Cormorant Garamond',serif;margin:0 0 10px}
      .yc-home .yc-home-journey-card p{font-size:12px;line-height:1.8;color:#887665;margin:0 0 20px;max-width:350px}
      .yc-home .yc-home-journey-card>svg{margin-top:auto;color:#8c6845}
      .yc-home .yc-home-finale{padding:clamp(85px,9vw,145px) 20px;background:radial-gradient(ellipse at center,#4a3025,#241813 70%);text-align:center;color:#f4eadb}
      .yc-home .yc-home-finale .shell{display:flex;flex-direction:column;align-items:center}
      .yc-home .yc-home-finale h2{margin:20px 0}
      .yc-home .yc-home-finale p{color:#d4c2ad;font-size:13px;line-height:1.85;max-width:440px}
      .yc-home .yc-home-finale .btn{margin-top:19px}
      .yc-home .yc-home-finale .shell>span:last-child{display:inline-flex;align-items:center;gap:10px;margin-top:50px;color:#ba9977;font-size:10px;letter-spacing:.08em}
      @media(max-width:1050px){.yc-home .yc-home-editorial-copy{padding:55px}.yc-home .yc-home-craft-images{min-height:500px}}
      @media(max-width:780px){
        .yc-home .yc-hero-coffee-tag{display:none}
        .yc-home .yc-home-editorial{grid-template-columns:1fr}
        .yc-home .yc-home-editorial-media{min-height:380px;max-height:540px}
        .yc-home .yc-home-editorial-copy{padding:60px clamp(22px,5vw,55px)}
        .yc-home .yc-home-craft-grid{grid-template-columns:1fr}
        .yc-home .yc-home-craft-images{min-height:500px}
        .yc-home .yc-home-journey-grid{grid-template-columns:1fr 1fr}
      }
      @media(max-width:560px){
        .yc-home .yc-home-hero{min-height:580px}
        .yc-home .yc-home-hero h1{font-size:clamp(57px,11.2vw,80px)}
        .yc-home .yc-coffee-ribbon>.shell{overflow:hidden;justify-content:flex-start;white-space:nowrap}
        .yc-home .yc-home-collection{padding-block:70px}
        .yc-home .yc-home-collection .product-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}
        .yc-home .yc-home-product .product-image{height:170px}
        .yc-home .yc-home-product .product-details{min-height:225px;padding:13px}
        .yc-home .yc-home-product h3{font-size:24px}
        .yc-home .yc-home-product p{font-size:10px}
        .yc-home .yc-home-space-stats{gap:18px}
        .yc-home .yc-home-craft-images{min-height:390px}
        .yc-home .yc-home-journey-grid{grid-template-columns:1fr}
        .yc-home .yc-journey-photo{aspect-ratio:1.6}
      }
      @media(prefers-reduced-motion:reduce){.yc-home .yc-journey-photo{transition:none}}
    `}</style>
  </div>;
}
