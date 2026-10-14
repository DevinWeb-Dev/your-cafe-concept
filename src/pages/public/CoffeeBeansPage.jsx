// YOUR CAFÉ — Coffee Beans & Retail Collection
// Location: src/pages/public/CoffeeBeansPage.jsx
// Frontend-only prototype · Web Developer Devin Planas
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Coffee, Leaf, Minus, Plus, ShoppingBag, Sun, Wind } from "lucide-react";
import { BRAND, MENU_ITEMS, PHOTOS, formatPeso } from "../../data/config.js";
import { useCafe } from "../../context/CafeContext.jsx";

const RETAIL_ITEMS = MENU_ITEMS.filter((item) => item.categoryId === "retail" && item.available);
const BREW_GUIDE = [
  { title: "A mindful morning", description: "Take your time with a hand-poured cup, and explore how aroma changes as it cools.", icon: Sun },
  { title: "Find your grind", description: "Grind beans to suit your chosen brewer. Product grinding is only a concept until configured by the café.", icon: Coffee },
  { title: "Keep it fresh", description: "Store whole beans in a sealed container, away from direct light, heat and moisture.", icon: Wind },
];

export default function CoffeeBeansPage() {
  const { cartActions, cartCount } = useCafe();
  const [quantities, setQuantities] = useState({});
  const [added, setAdded] = useState("");
  const [failedImages, setFailedImages] = useState({});

  function changeQuantity(id, amount) {
    setQuantities((current) => ({ ...current, [id]: Math.min(30, Math.max(1, (current[id] || 1) + amount)) }));
  }

  function addRetail(item) {
    const result = cartActions.add(item.id, quantities[item.id] || 1, {});
    if (result.ok) {
      setAdded(item.id);
      window.setTimeout(() => setAdded((current) => current === item.id ? "" : current), 2000);
    }
  }

  return <div className="yc9-beans">
    <style>{`
      .yc9-beans{background:#faf5ec;color:#30251d;min-width:0}.yc9-beans *{box-sizing:border-box}
      .yc9-beans .wrap{width:min(1240px,calc(100% - 48px));margin:auto}.yc9-beans .eyebrow9{font:800 10px 'DM Sans',sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#b58b5a}
      .yc9-beans h1,.yc9-beans h2,.yc9-beans h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;letter-spacing:-.035em}
      .yc9-beans .hero9{min-height:540px;display:grid;align-items:center;background:#241813;color:#fff;position:relative;isolation:isolate;overflow:hidden}
      .yc9-beans .hero9::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,#241813ed 0%,#241813bd 46%,#24181344),url('${PHOTOS.beans}') center/cover;opacity:.93}
      .yc9-beans .hero9-inner{padding:95px 0;max-width:720px}.yc9-beans h1{font-size:clamp(66px,9.2vw,126px);line-height:.82;margin:29px 0}.yc9-beans h1 em{color:#e0bd8d}
      .yc9-beans .hero9 p{max-width:510px;line-height:1.95;color:#e8d8c7;font-size:14px}.yc9-beans .hero9 a{display:inline-flex;align-items:center;gap:12px;margin-top:20px;padding:16px 22px;color:#fff;background:#ae8054;font-size:12px;font-weight:800}
      .yc9-beans .collection{padding:95px 0}.yc9-beans .heading{display:flex;justify-content:space-between;gap:30px;align-items:end;margin-bottom:30px}
      .yc9-beans .heading h2{font-size:clamp(48px,6vw,79px);line-height:.95;margin:12px 0 0}.yc9-beans .heading p{max-width:360px;font-size:13px;line-height:1.9;color:#8b7665}
      .yc9-beans .products{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr));gap:24px}
      .yc9-beans .product{min-width:0;background:#fffaf3;border:1px solid #e4d6c7;display:grid;grid-template-columns:minmax(0,1fr);overflow:hidden}
      .yc9-beans .photo{position:relative;height:330px;background:radial-gradient(circle,#9a7655,#3c2c22);overflow:hidden}
      .yc9-beans .photo img{width:100%;height:100%;object-fit:cover;transition:transform .5s}.yc9-beans .product:hover .photo img{transform:scale(1.045)}
      .yc9-beans .photo .fallback{position:absolute;inset:0;display:grid;place-content:center;text-align:center;color:#f4d7b7;gap:8px}
      .yc9-beans .product-info{padding:27px}.yc9-beans .product-info small{font-size:10px;font-weight:800;letter-spacing:.15em;color:#97683f}
      .yc9-beans .product-info h3{font-size:37px;line-height:1.02;margin:12px 0}.yc9-beans .product-info p{font-size:12px;line-height:1.85;color:#866d5b;min-height:44px}
      .yc9-beans .product-bar{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:20px 0;flex-wrap:wrap}.yc9-beans .price{font-size:21px;font-weight:700;color:#513828}
      .yc9-beans .qty{display:inline-flex;border:1px solid #d9c4b1;align-items:center}.yc9-beans .qty button{width:39px;height:39px;border:0;background:transparent;display:grid;place-items:center;color:#493428}.yc9-beans .qty span{min-width:34px;text-align:center;font-size:13px;font-weight:800}
      .yc9-beans .add{display:flex;width:100%;align-items:center;justify-content:center;gap:10px;padding:15px;border:0;background:#3c2b21;color:#fff;font-weight:800;font-size:11px;letter-spacing:.09em}
      .yc9-beans .guide{padding:83px 0 105px;background:#eae0d2}.yc9-beans .guide h2{font-size:clamp(46px,6vw,75px);margin:12px 0 40px;line-height:.95}.yc9-beans .tips{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
      .yc9-beans .tip{border-top:1px solid #bba38b;padding:28px 12px 0 0}.yc9-beans .tip svg{color:#896746}.yc9-beans .tip h3{font-size:29px;margin:16px 0 10px}.yc9-beans .tip p{font-size:12px;line-height:1.9;color:#776250}
      .yc9-beans .disclaimer{font-size:11px;color:#8a725f;margin-top:23px;line-height:1.8}
      @media(max-width:750px){.yc9-beans .heading{display:block}.yc9-beans .tips{grid-template-columns:1fr}.yc9-beans .photo{height:280px}.yc9-beans .hero9{min-height:480px}}
      @media(max-width:400px){.yc9-beans .wrap{width:calc(100% - 32px)}.yc9-beans h1{font-size:61px}.yc9-beans .product-info{padding:20px}}
      @media(prefers-reduced-motion:reduce){.yc9-beans .photo img{transition:none}}
    `}</style>
    <section className="hero9"><div className="wrap hero9-inner"><span className="eyebrow9">YOUR CAFÉ / FROM BEAN TO CUP</span><h1>Slow down.<br/><em>Savor more.</em></h1><p>Explore our carefully imagined coffee retail collection and bring the café ritual home. All listings are illustrative products and sample prices.</p><a href="#retail-selection">Explore the collection <ArrowRight size={17}/></a></div></section>
    <section className="collection wrap" id="retail-selection"><div className="heading"><div><span className="eyebrow9">THE HOME BREW COLLECTION</span><h2>A better everyday <em>brew.</em></h2></div><p>Bring a little café warmth into your kitchen. Add an illustrative retail item to the same demo cart used by our full coffee menu.</p></div>
      {RETAIL_ITEMS.length ? <div className="products">{RETAIL_ITEMS.map((item) => <article className="product" key={item.id}>
        <div className="photo">{failedImages[item.id] ? <span className="fallback"><Coffee size={52}/><span>COFFEE COLLECTION</span></span> : <img src={item.image} alt={`Illustrative product: ${item.name}`} loading="lazy" onError={() => setFailedImages((s) => ({ ...s,[item.id]:true }))}/>}</div>
        <div className="product-info"><small>RETAIL COLLECTION · DEMONSTRATION</small><h3>{item.name}</h3><p>{item.description}</p><div className="product-bar"><strong className="price">{formatPeso(item.price)}</strong><div className="qty"><button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => changeQuantity(item.id,-1)}><Minus size={15}/></button><span>{quantities[item.id] || 1}</span><button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => changeQuantity(item.id,1)}><Plus size={15}/></button></div></div>
        <button type="button" className="add" onClick={() => addRetail(item)}>{added === item.id ? <><Check size={17}/> ADDED TO CART</> : <><ShoppingBag size={17}/> ADD TO DEMO CART</>}</button></div>
      </article>)}</div> : <div><p>No retail items are currently configured.</p><Link to="/menu">Explore our menu <ArrowRight size={15}/></Link></div>}
      <p className="disclaimer">{BRAND.watermark}. Retail orders are browser-local demonstrations. No actual product is shipped or purchased. <Link to="/cart"><u>View demo cart ({cartCount})</u></Link>.</p>
    </section>
    <section className="guide"><div className="wrap"><span className="eyebrow9">SMALL RITUALS, BEAUTIFULLY DONE</span><h2>The art of brewing <em>at home.</em></h2><div className="tips">{BREW_GUIDE.map(({title,description,icon:Icon}) => <article className="tip" key={title}><Icon size={28} strokeWidth={1.4}/><h3>{title}</h3><p>{description}</p></article>)}</div><Link to="/menu" className="add" style={{display:"inline-flex",width:"auto",marginTop:42,textDecoration:"none"}}>Explore drinks & pastries <ArrowRight size={17}/></Link></div></section>
  </div>;
}
