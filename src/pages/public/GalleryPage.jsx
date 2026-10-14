// YOUR CAFÉ — BATCH 8 / ATMOSPHERE GALLERY
// Concept photography; replace with real licensed client assets before production.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Coffee, X } from "lucide-react";
import { BRAND, PHOTOS } from "../../data/config.js";

const SHOTS = [
  { id: "space-1", category: "Interiors", title: "A place to stay a while", subtitle: "A warm, unhurried coffee moment", image: PHOTOS.interior, featured: true },
  { id: "coffee-1", category: "Coffee", title: "The perfect everyday cup", subtitle: "Carefully brewed coffee", image: PHOTOS.coffee },
  { id: "craft-1", category: "Craft", title: "A ritual of craftsmanship", subtitle: "Coffee preparation and brewing", image: PHOTOS.coffeeCraft },
  { id: "food-1", category: "Pastries", title: "Golden morning layers", subtitle: "A buttery croissant", image: PHOTOS.croissant },
  { id: "space-2", category: "Interiors", title: "Your favorite corner", subtitle: "A welcoming café interior", image: PHOTOS.cafeInterior },
  { id: "coffee-2", category: "Coffee", title: "Coffee in its element", subtitle: "A specialty espresso moment", image: PHOTOS.espresso },
  { id: "craft-2", category: "Craft", title: "The aroma of the bean", subtitle: "Whole roasted coffee beans", image: PHOTOS.beans },
  { id: "coffee-3", category: "Coffee", title: "A softer kind of morning", subtitle: "Milk coffee and latte craft", image: PHOTOS.latte },
  { id: "food-2", category: "Pastries", title: "An afternoon indulgence", subtitle: "A slice of café cake", image: PHOTOS.cake },
  { id: "food-3", category: "Food", title: "A comforting pause", subtitle: "A café sandwich", image: PHOTOS.sandwich },
  { id: "food-4", category: "Food", title: "The slow lunch", subtitle: "Fresh pasta and café comfort", image: PHOTOS.pasta },
];
const FILTERS = ["All", "Interiors", "Coffee", "Craft", "Pastries", "Food"];
function Photo({ shot, onClick, index }) {
  const [failed, setFailed] = useState(false);
  return <button className={`yc8-gallery-photo ${shot.featured ? "featured" : ""}`} type="button" onClick={onClick} aria-label={`Open photo: ${shot.title}`}>
    <span className="yc8-image-background" aria-hidden="true"/>
    {!failed ? <img loading={index < 2 ? "eager" : "lazy"} src={shot.image} alt={shot.subtitle} onError={() => setFailed(true)}/> : <span className="yc8-gallery-fallback"><Coffee size={32}/><small>COFFEE MOMENTS</small></span>}
    <span className="yc8-gallery-photo-caption"><span>{shot.category.toUpperCase()}</span><strong>{shot.title}</strong><ArrowUpRight size={20}/></span>
  </button>;
}

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const filtered = filter === "All" ? SHOTS : SHOTS.filter((shot) => shot.category === filter);
  const selectedIndex = filtered.findIndex((shot) => shot.id === selected?.id);
  useEffect(() => {
    if (!selected) return undefined;
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event) {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight") setSelected((current) => filtered[(filtered.findIndex((shot) => shot.id === current?.id) + 1) % filtered.length]);
      if (event.key === "ArrowLeft") setSelected((current) => filtered[(filtered.findIndex((shot) => shot.id === current?.id) - 1 + filtered.length) % filtered.length]);
    }
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prior; window.removeEventListener("keydown", onKey); };
  }, [selected, filter]);

  return <div className="yc8-gallery">
    <style>{`
      .yc8-gallery{min-width:0;color:#30231b;background:#faf5ec}.yc8-gallery *{box-sizing:border-box}
      .yc8-gallery .shell8{width:min(1300px,calc(100% - 64px));margin-inline:auto}.yc8-gallery .intro{padding:105px 0 78px;display:grid;grid-template-columns:1.4fr .6fr;gap:35px;align-items:end}
      .yc8-gallery .eyebrow8{font:800 10px 'DM Sans',sans-serif;letter-spacing:.2em;color:#a27b55}.yc8-gallery h1{font:500 clamp(72px,9vw,145px)/.8 'Cormorant Garamond',Georgia,serif;letter-spacing:-.025em;margin:24px 0 0}
      .yc8-gallery h1 em{color:#a88460;font-weight:400}.yc8-gallery .intro p{font-size:13px;line-height:2;color:#867361;max-width:330px;margin:0 0 8px}
      .yc8-gallery .filters{display:flex;gap:7px;flex-wrap:wrap;padding-bottom:25px;border-bottom:1px solid #e4d6c5;margin-bottom:28px}
      .yc8-gallery .filters button{padding:11px 16px;background:transparent;border:1px solid #dfcfbd;color:#705746;font:700 11px 'DM Sans',sans-serif;cursor:pointer;transition:all .2s}
      .yc8-gallery .filters button.active,.yc8-gallery .filters button:hover{background:#3d2b21;color:#fff;border-color:#3d2b21}
      .yc8-gallery .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:stretch}.yc8-gallery-photo{position:relative;display:block;aspect-ratio:4/4.5;min-width:0;padding:0;border:0;overflow:hidden;cursor:pointer;background:#4d382c;text-align:left;color:#fff}
      .yc8-gallery-photo.featured{grid-column:span 2;aspect-ratio:8.5/4.5}.yc8-gallery-photo img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.22,1,.36,1);filter:saturate(.85) sepia(.07)}
      .yc8-gallery-photo:hover img{transform:scale(1.065)}.yc8-image-background{position:absolute;inset:0;background:linear-gradient(125deg,#36241e,#a27956)}
      .yc8-gallery-photo::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,#130e0ccf,transparent 56%);pointer-events:none}
      .yc8-gallery-photo-caption{position:absolute;bottom:0;left:0;right:0;padding:clamp(16px,3vw,28px);z-index:1;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px}
      .yc8-gallery-photo-caption>span{font:800 9px 'DM Sans',sans-serif;letter-spacing:.17em;color:#e6c4a1;grid-column:1/-1}.yc8-gallery-photo-caption strong{font:500 clamp(22px,3vw,36px)/1 'Cormorant Garamond',Georgia,serif;overflow-wrap:anywhere}
      .yc8-gallery-photo-caption svg{align-self:center}.yc8-gallery-fallback{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:13px;color:#e6c2a0}.yc8-gallery-fallback small{font-size:9px;letter-spacing:.2em}
      .yc8-gallery .end-note{padding:80px 0 100px;text-align:center}.yc8-gallery .end-note h2{font:500 clamp(43px,6vw,75px)/.96 'Cormorant Garamond',Georgia,serif;margin:0 auto 17px;max-width:720px}
      .yc8-gallery .end-note p{font-size:12px;line-height:1.8;color:#897562;margin:0 auto 25px;max-width:480px}.yc8-gallery .end-note a{display:inline-flex;align-items:center;gap:12px;padding:15px 23px;background:#38271e;color:#fff;font-size:11px;font-weight:800}
      .yc8-gallery-overlay{position:fixed;inset:0;z-index:1500;display:grid;place-items:center;background:#140c08f2;padding:56px 50px;color:#fff}
      .yc8-gallery-overlay img{display:block;width:auto;max-width:100%;max-height:min(75dvh,780px);object-fit:contain;box-shadow:0 25px 75px #0008}
      .yc8-gallery-overlay .modal-caption{text-align:center;padding:20px 0 0}.yc8-gallery-overlay .modal-caption strong{display:block;font:500 34px 'Cormorant Garamond',Georgia,serif}.yc8-gallery-overlay .modal-caption small{font-size:10px;color:#c6a98c;letter-spacing:.06em}
      .yc8-gallery-overlay button{cursor:pointer;border:1px solid #ffffff55;background:#231911e0;color:#fff;display:grid;place-items:center;min-width:44px;min-height:44px}
      .yc8-gallery-overlay .close{position:absolute;right:20px;top:18px}.yc8-gallery-overlay .arrows{position:absolute;bottom:20px;right:22px;display:flex;align-items:center;gap:9px}.yc8-gallery-overlay .arrows>span{font-size:11px;margin-right:7px;color:#dbc2a8}
      .yc8-gallery-overlay .arrows button{font:700 18px 'DM Sans',sans-serif}
      .yc8-gallery .legal{font-size:10px;color:#917a67;text-align:center;padding:15px;background:#f1e6d8}
      @media(max-width:950px){.yc8-gallery .intro{grid-template-columns:1fr}.yc8-gallery .intro p{max-width:560px}.yc8-gallery .grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:590px){.yc8-gallery .shell8{width:calc(100% - 32px)}.yc8-gallery .intro{padding:70px 0 45px}.yc8-gallery h1{font-size:clamp(64px,15vw,100px)}.yc8-gallery .grid{gap:9px}.yc8-gallery-photo{aspect-ratio:3/4}.yc8-gallery-photo.featured{grid-column:span 2;aspect-ratio:1.2}.yc8-gallery-photo-caption{padding:12px}.yc8-gallery-photo-caption strong{font-size:24px}.yc8-gallery-overlay{padding:65px 15px 85px}.yc8-gallery-overlay .modal-caption strong{font-size:28px}}
      @media(max-width:360px){.yc8-gallery .grid{grid-template-columns:1fr}.yc8-gallery-photo.featured{grid-column:auto;aspect-ratio:4/4.5}}
      @media(prefers-reduced-motion:reduce){.yc8-gallery-photo img{transition:none!important}}
    `}</style>
    <section className="shell8 intro"><div><span className="eyebrow8">YOUR CAFÉ / THROUGH THE LENS</span><h1>A slower way<br/><em>to savor life.</em></h1></div><p>Soft afternoon light, quiet conversations, freshly crafted coffee, and small rituals made meaningful. Explore an illustrative vision of the café experience.</p></section>
    <div className="shell8"><div className="filters" role="group" aria-label="Filter gallery">
      {FILTERS.map((name) => <button key={name} type="button" className={filter === name ? "active" : ""} aria-pressed={filter === name} onClick={() => {setFilter(name); setSelected(null);}}>{name}</button>)}
    </div><div className="grid">{filtered.map((shot, index) => <Photo key={shot.id} shot={shot} index={index} onClick={() => setSelected(shot)}/>)}</div>
    <section className="end-note"><h2>Come for the coffee.<br/>Stay for the feeling.</h2><p>Explore signature drinks and imagine your next favorite café moment.</p><Link to="/menu">Discover Our Menu <ArrowRight size={18}/></Link></section></div>
    <div className="legal">Concept photography, not verified photos of an operating branch. {BRAND.watermark}</div>
    {selected && <div className="yc8-gallery-overlay" role="dialog" aria-modal="true" aria-label={`Photo: ${selected.title}`} onMouseDown={(event) => {if (event.target === event.currentTarget) setSelected(null);}}>
      <button type="button" className="close" aria-label="Close photo viewer" onClick={() => setSelected(null)}><X size={22}/></button>
      <div><img src={selected.image} alt={selected.subtitle}/><div className="modal-caption"><strong>{selected.title}</strong><small>{selected.category} · {selected.subtitle}</small></div></div>
      <div className="arrows"><span>{selectedIndex + 1} / {filtered.length}</span><button type="button" aria-label="Previous photo" onClick={() => setSelected(filtered[(selectedIndex - 1 + filtered.length) % filtered.length])}>←</button><button type="button" aria-label="Next photo" onClick={() => setSelected(filtered[(selectedIndex + 1) % filtered.length])}>→</button></div>
    </div>}
  </div>;
}
