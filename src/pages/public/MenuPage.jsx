// YOUR CAFÉ — Complete searchable, filterable coffee & food menu
// FILE: src/pages/public/MenuPage.jsx
// Website Concept Made by: Web Developer Devin Planas
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Check, Coffee, Heart, Plus, Search,
  ShoppingBag, SlidersHorizontal, Sparkles, X,
} from "lucide-react";
import {
  BRAND, MENU_CATEGORIES, MENU_ITEMS, PHOTOS,
  formatPeso,
} from "../../data/config.js";
import { useCafe } from "../../context/CafeContext.jsx";
import DrinkCustomizer from "../../components/DrinkCustomizer.jsx";

const CATEGORIES = MENU_CATEGORIES;
const SORT_MODES = [
  { id: "featured", label: "Featured first" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name", label: "Name: A to Z" },
];

const SAVED_FAVORITES_KEY = "your-cafe-favorite-products-v1";

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(SAVED_FAVORITES_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export default function MenuPage() {
  const { cartCount } = useCafe();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [onlySignature, setOnlySignature] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [maxPrice, setMaxPrice] = useState("all");
  const [favorites, setFavorites] = useState(readFavorites);
  const [activeProduct, setActiveProduct] = useState(null);

  function toggleFavorite(productId) {
    setFavorites((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      try { localStorage.setItem(SAVED_FAVORITES_KEY, JSON.stringify(next)); }
      catch { /* Favorites still work for this open tab. */ }
      return next;
    });
  }

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = MENU_ITEMS.filter((item) => {
      if (!item.available) return false;
      if (category !== "all" && item.categoryId !== category) return false;
      if (onlySignature && !item.signature) return false;
      if (onlyFavorites && !favorites.includes(item.id)) return false;
      if (maxPrice !== "all" && item.price > Number(maxPrice)) return false;
      if (normalized && !`${item.name} ${item.description} ${item.categoryId}`.toLowerCase().includes(normalized)) return false;
      return true;
    });
    result.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return Number(b.featured) - Number(a.featured);
    });
    return result;
  }, [category, query, sort, onlySignature, onlyFavorites, maxPrice, favorites]);

  const hasFilters = Boolean(query) || category !== "all" || onlySignature || onlyFavorites || maxPrice !== "all";
  const resetFilters = () => {
    setQuery(""); setCategory("all"); setSort("featured");
    setOnlySignature(false); setOnlyFavorites(false); setMaxPrice("all");
  };

  return <section className="yc-menu-page">
    <div className="yc-menu-intro" style={{backgroundImage:`linear-gradient(90deg,rgba(31,21,15,.95),rgba(31,21,15,.68)),url('${PHOTOS.coffeeCraft}')`}}>
      <div className="shell">
        <span className="yc-menu-kicker"><Coffee size={16}/> CURATED WITH HEART, SERVED WITH SOUL</span>
        <h1>A little something <em>extraordinary.</em></h1>
        <p>From the first espresso of the morning to an afternoon treat, explore our carefully imagined coffee, drinks and café favorites.</p>
        <div className="yc-menu-intro-actions">
          <a href="#yc-menu-catalog">EXPLORE THE MENU <ArrowRight size={17}/></a>
          <Link to="/cart"><ShoppingBag size={17}/> YOUR CART ({cartCount})</Link>
        </div>
      </div>
    </div>

    <div className="yc-menu-content" id="yc-menu-catalog">
      <div className="shell">
        <div className="yc-menu-header">
          <div><span className="yc-menu-kicker dark"><Sparkles size={15}/> FROM OUR COFFEE BAR & KITCHEN</span><h2>Find your <em>favorite.</em></h2></div>
          <p>Crafted drinks, sweet little indulgences, and comforting food—all with illustrative Philippine peso prices.</p>
        </div>

        <div className="yc-menu-categories" role="group" aria-label="Filter menu category">
          {CATEGORIES.map((entry) => (
            <button key={entry.id} type="button" className={category === entry.id ? "active" : ""} aria-pressed={category === entry.id} onClick={() => setCategory(entry.id)}>{entry.name}</button>
          ))}
        </div>

        <div className="yc-menu-toolbar">
          <label className="yc-menu-search"><Search size={19} aria-hidden="true"/>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search coffee, pastry, cake..." aria-label="Search menu items" />
            {query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={17}/></button>}
          </label>
          <label className="yc-menu-select"><SlidersHorizontal size={16}/><span>Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>{SORT_MODES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
          </label>
          <label className="yc-menu-select"><span>Price</span>
            <select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}>
              <option value="all">Any price</option>
              <option value="150">Up to ₱150</option>
              <option value="200">Up to ₱200</option>
              <option value="250">Up to ₱250</option>
            </select>
          </label>
        </div>

        <div className="yc-menu-options">
          <button type="button" aria-pressed={onlySignature} className={onlySignature ? "selected" : ""} onClick={() => setOnlySignature((value) => !value)}><Sparkles size={15}/> Signature Only {onlySignature && <Check size={14}/>}</button>
          <button type="button" aria-pressed={onlyFavorites} className={onlyFavorites ? "selected" : ""} onClick={() => setOnlyFavorites((value) => !value)}><Heart size={15}/> My Favorites ({favorites.length}) {onlyFavorites && <Check size={14}/>}</button>
          <span className="yc-menu-results" aria-live="polite">Showing {filtered.length} of {MENU_ITEMS.filter((p) => p.available).length} menu items</span>
          {hasFilters && <button type="button" className="yc-menu-clear" onClick={resetFilters}><X size={14}/> Reset filters</button>}
        </div>

        {filtered.length ? <div className="yc-menu-grid">
          {filtered.map((product) => <article className="product-card yc-menu-product" key={product.id}>
            <div className="product-image">
              <img src={product.image} alt={`Illustrative product photo: ${product.name}`} loading="lazy" />
              {product.signature && <span className="signature-tag">SIGNATURE</span>}
              <button className={`yc-product-favorite ${favorites.includes(product.id) ? "is-saved" : ""}`} type="button"
                aria-pressed={favorites.includes(product.id)} aria-label={`${favorites.includes(product.id) ? "Remove" : "Save"} ${product.name} ${favorites.includes(product.id) ? "from" : "to"} favorites`}
                onClick={() => toggleFavorite(product.id)}><Heart size={18} fill={favorites.includes(product.id) ? "currentColor" : "none"}/></button>
            </div>
            <div className="product-details">
              <span className="product-category">{CATEGORIES.find((c) => c.id === product.categoryId)?.name || "CAFÉ FAVORITE"}</span>
              <h3>{product.name}</h3><p>{product.description}</p>
              <div className="yc-menu-product-bottom">
                <div><small>FROM</small><strong>{formatPeso(product.price)}</strong></div>
                <button type="button" onClick={() => setActiveProduct(product)}><Plus size={17}/> Customize</button>
              </div>
            </div>
          </article>)}
        </div> : <div className="yc-menu-empty">
          <Coffee size={33}/><h3>No café favorites found.</h3><p>Try a different category, price range or search term.</p>
          <button type="button" onClick={resetFilters}>Explore All Items <ArrowRight size={16}/></button>
        </div>}

        <div className="yc-menu-bottom-notice"><Coffee size={19}/><p><b>A note from our café concept.</b> Products, photography, stock and prices are illustrative. Customizations and cart totals work locally; no order is placed with a real business.</p></div>
      </div>
    </div>

    <DrinkCustomizer open={Boolean(activeProduct)} product={activeProduct} onClose={() => setActiveProduct(null)}/>

    <style>{`
      .yc-menu-page{background:#faf5ec;color:#2d2018;min-height:70vh}
      .yc-menu-page .yc-menu-intro{background-color:#241813;background-position:center;background-size:cover;display:flex;align-items:center;min-height:410px;color:#f9f1e7;padding:80px 0}
      .yc-menu-page .yc-menu-intro>.shell{width:min(1350px,calc(100% - 72px))}
      .yc-menu-page .yc-menu-kicker{display:inline-flex;align-items:center;gap:11px;font-size:10px;font-weight:800;letter-spacing:.15em;color:#e4c29b;line-height:1.5}
      .yc-menu-page .yc-menu-intro h1{font:500 clamp(58px,8vw,108px)/.88 'Cormorant Garamond',serif;letter-spacing:-.04em;max-width:780px;margin:23px 0 20px;text-wrap:balance;overflow-wrap:anywhere}
      .yc-menu-page .yc-menu-intro h1 em{color:#d9b58a;font-weight:400}
      .yc-menu-page .yc-menu-intro p{font-size:13px;color:#e6d7c7;line-height:1.9;max-width:515px}
      .yc-menu-page .yc-menu-intro-actions{display:flex;gap:24px;flex-wrap:wrap;margin-top:28px}
      .yc-menu-page .yc-menu-intro-actions a{display:inline-flex;align-items:center;gap:10px;font-size:10px;font-weight:800;letter-spacing:.08em;border-bottom:1px solid #a58562;padding:9px 0}
      .yc-menu-page .yc-menu-content{padding:clamp(60px,8vw,105px) 0}
      .yc-menu-page .yc-menu-header{display:flex;justify-content:space-between;align-items:end;gap:40px;margin-bottom:42px}
      .yc-menu-page .yc-menu-header>div{min-width:0}
      .yc-menu-page .yc-menu-kicker.dark{color:#a27752}
      .yc-menu-page .yc-menu-header h2{font:500 clamp(51px,6.2vw,83px)/.91 'Cormorant Garamond',serif;letter-spacing:-.035em;margin:18px 0 0;text-wrap:balance}
      .yc-menu-page .yc-menu-header h2 em{color:#aa7c4e;font-weight:400}
      .yc-menu-page .yc-menu-header>p{font-size:12px;color:#806d5e;line-height:1.9;max-width:330px;margin:0}
      .yc-menu-page .yc-menu-categories{display:flex;flex-wrap:wrap;gap:8px;border-bottom:1px solid #e0d4c5;padding-bottom:22px;margin-bottom:24px}
      .yc-menu-page .yc-menu-categories button{padding:10px 13px;background:transparent;color:#806753;border:1px solid #e0d2bf;font-size:10px;font-weight:700;transition:.2s}
      .yc-menu-page .yc-menu-categories button:hover,.yc-menu-page .yc-menu-categories button.active{background:#3d2d23;color:#fff;border-color:#3d2d23}
      .yc-menu-page .yc-menu-toolbar{display:flex;gap:13px;flex-wrap:wrap;align-items:stretch;margin-bottom:17px}
      .yc-menu-page .yc-menu-search{display:flex;align-items:center;gap:10px;min-width:210px;flex:1;background:#fffaf3;border:1px solid #dbcbb9;padding:0 14px}
      .yc-menu-page .yc-menu-search input{flex:1;min-width:0;border:0;background:none;outline:none;box-shadow:none;padding:14px 0;font-size:12px;color:#3d2d23}
      .yc-menu-page .yc-menu-search button{border:0;background:none;color:#806b56;padding:6px}
      .yc-menu-page .yc-menu-select{display:flex;align-items:center;gap:9px;background:#fffaf3;border:1px solid #dbcbb9;padding:0 12px;color:#70543e;font-size:11px}
      .yc-menu-page .yc-menu-select select{min-height:46px;min-width:0;max-width:210px;border:0;background:transparent;color:#3d2d23;outline:none;font-size:11px;cursor:pointer}
      .yc-menu-page .yc-menu-options{display:flex;align-items:center;flex-wrap:wrap;gap:11px;margin-bottom:27px}
      .yc-menu-page .yc-menu-options button{display:inline-flex;align-items:center;gap:8px;border:1px solid #ddcfbe;background:#f5ecdf;color:#694e39;padding:8px 12px;font-size:10px;font-weight:700}
      .yc-menu-page .yc-menu-options button.selected{background:#e4d6c0;border-color:#b58b5a}
      .yc-menu-page .yc-menu-options .yc-menu-clear{border:0;background:transparent;color:#a16549}
      .yc-menu-page .yc-menu-results{margin-left:auto;font-size:11px;color:#927d68}
      .yc-menu-page .yc-menu-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}
      .yc-menu-page .yc-menu-product{min-width:0}
      .yc-menu-page .yc-menu-product .product-image{overflow:hidden;position:relative}
      .yc-menu-page .yc-menu-product .product-image>img{width:100%;height:100%;object-fit:cover}
      .yc-menu-page .yc-product-favorite{position:absolute;right:14px;top:14px;width:37px;height:37px;display:grid;place-items:center;border:1px solid #e8dccd;border-radius:50%;background:#fff9f1ed;color:#815b43}
      .yc-menu-page .yc-product-favorite.is-saved{color:#a85548}
      .yc-menu-page .yc-menu-product .product-details{min-height:215px}
      .yc-menu-page .yc-menu-product-bottom{display:flex;align-items:end;justify-content:space-between;gap:10px;margin-top:auto;padding-top:17px}
      .yc-menu-page .yc-menu-product-bottom>div{display:flex;flex-direction:column;gap:5px}
      .yc-menu-page .yc-menu-product-bottom small{color:#a18970;font-size:9px;letter-spacing:.1em}
      .yc-menu-page .yc-menu-product-bottom strong{font-size:14px}
      .yc-menu-page .yc-menu-product-bottom button{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:37px;padding:9px 12px;border:0;background:#3b2920;color:#fff;font-size:10px;font-weight:700;transition:background .2s}
      .yc-menu-page .yc-menu-product-bottom button:hover{background:#7c5637}
      .yc-menu-page .yc-menu-empty{display:flex;align-items:center;flex-direction:column;gap:15px;padding:65px 20px;border:1px dashed #c8b7a0;color:#866c54;text-align:center}
      .yc-menu-page .yc-menu-empty h3{font:500 37px 'Cormorant Garamond',serif;margin:0}
      .yc-menu-page .yc-menu-empty p{margin:0;font-size:12px}
      .yc-menu-page .yc-menu-empty button{display:inline-flex;align-items:center;gap:9px;border:0;background:#3d2d23;color:#fff;padding:12px 20px;margin-top:12px;font-size:11px}
      .yc-menu-page .yc-menu-bottom-notice{display:flex;gap:17px;align-items:flex-start;margin-top:47px;padding:20px 24px;background:#ede2d4;color:#725a44}
      .yc-menu-page .yc-menu-bottom-notice svg{flex-shrink:0}
      .yc-menu-page .yc-menu-bottom-notice p{font-size:11px;line-height:1.8;margin:0}
      @media(max-width:1100px){.yc-menu-page .yc-menu-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:800px){.yc-menu-page .yc-menu-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.yc-menu-page .yc-menu-header{align-items:start;flex-direction:column;gap:13px}}
      @media(max-width:600px){
        .yc-menu-page .yc-menu-intro{min-height:350px;padding:70px 0}
        .yc-menu-page .yc-menu-intro>.shell{width:calc(100% - 36px)}
        .yc-menu-page .yc-menu-intro h1{font-size:clamp(55px,11vw,76px)}
        .yc-menu-page .yc-menu-header{margin-bottom:30px}
        .yc-menu-page .yc-menu-grid{gap:11px}
        .yc-menu-page .yc-menu-product .product-image{height:170px}
        .yc-menu-page .yc-menu-product .product-details{min-height:215px;padding:13px}
        .yc-menu-page .yc-menu-product .product-details h3{font-size:23px}
        .yc-menu-page .yc-menu-product .product-details p{font-size:10px}
        .yc-menu-page .yc-menu-product-bottom{flex-direction:column;align-items:stretch}
        .yc-menu-page .yc-menu-product-bottom button{width:100%}
        .yc-menu-page .yc-menu-search{flex-basis:100%}
        .yc-menu-page .yc-menu-select{flex:1}
        .yc-menu-page .yc-menu-select select{max-width:100%}
        .yc-menu-page .yc-menu-results{margin-left:0;order:2;width:100%}
        .yc-menu-page .yc-menu-bottom-notice{padding:15px}
      }
      @media(max-width:360px){.yc-menu-page .yc-menu-grid{grid-template-columns:1fr}.yc-menu-page .yc-menu-product .product-image{height:235px}.yc-menu-page .yc-menu-product-bottom{flex-direction:row;align-items:center}}
      @media(prefers-reduced-motion:reduce){.yc-menu-page .yc-menu-product-bottom button{transition:none}}
    `}</style>
  </section>;
}
