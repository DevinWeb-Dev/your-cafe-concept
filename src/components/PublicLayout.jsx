// YOUR CAFÉ — Customer-facing layout, Batch 10 navigation
// FILE: src/components/PublicLayout.jsx
// Website Concept Made by: Web Developer Devin Planas
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Coffee, Camera,
  MapPin, Menu, ShoppingBag, Sparkles, X,
} from "lucide-react";
import { BRAND } from "../data/config.js";
import { useCafe } from "../context/CafeContext.jsx";
import CartDrawer from "./CartDrawer.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/menu", label: "Our Menu" },
  { to: "/reserve", label: "Reservations" },
  { to: "/orders", label: "Track Order" },
  { to: "/story", label: "Our Story" },
  { to: "/membership", label: "Rewards" },

];

function BrandLogo({ footer = false }) {
  return (
    <Link to="/" className={`brand ${footer ? "yc-footer-logo" : ""}`} aria-label={`${BRAND.name} homepage`}>
      <span className="brand-symbol" aria-hidden="true"><Coffee size={22} strokeWidth={1.6} /></span>
      <span><b>{BRAND.name}</b><small>{BRAND.subtitle}</small></span>
    </Link>
  );
}

function CafeNotice() {
  const { notice, clearNotice } = useCafe();
  if (!notice) return null;
  return (
    <div className={`toast ${notice.type || "success"}`} role={notice.type === "error" ? "alert" : "status"}>
      <span>{notice.text}</span>
      <button type="button" onClick={clearNotice} aria-label="Dismiss notification"><X size={18} /></button>
    </div>
  );
}

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { pathname } = useLocation();
  const { cartCount } = useCafe();
  const toggleRef = useRef(null);
  const exploreRef = useRef(null);

  // Navigating to another page closes the mobile navigation.
  useEffect(() => { setMenuOpen(false); if (exploreRef.current) exploreRef.current.open = false; }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const keyHandler = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [menuOpen]);

  return (
    <div className="public-app yc-public-shell">
      <a className="yc-skip-link" href="#yc-main">Skip to content</a>
      <div className="yc-topline"><Sparkles size={12} aria-hidden="true" /> THE ART OF EVERYDAY COFFEE <span aria-hidden="true">✦</span> A FRONTEND CONCEPT</div>
      <header className="site-header">
        <div className="shell header-inner">
          <BrandLogo />
          <nav id="yc-primary-nav" className={`public-nav ${menuOpen ? "mobile-open" : ""}`} aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <details className="yc9-explore-menu" ref={exploreRef}>
              <summary>Explore <ArrowRight size={13} aria-hidden="true"/></summary>
              <div className="yc9-explore-panel">
                <Link to="/availability" onClick={() => setMenuOpen(false)}>Table Availability</Link>
                <Link to="/locations" onClick={() => setMenuOpen(false)}>Locations</Link>
                <Link to="/faq" onClick={() => setMenuOpen(false)}>FAQs</Link>
                <Link to="/coffee-beans" onClick={() => setMenuOpen(false)}>Coffee Beans</Link>
                <Link to="/gift-cards" onClick={() => setMenuOpen(false)}>Gift Cards</Link>
                <Link to="/events" onClick={() => setMenuOpen(false)}>Events & Workshops</Link>
                <Link to="/gallery" onClick={() => setMenuOpen(false)}>Café Gallery</Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
              </div>
            </details>
            <Link className="mobile-staff" to="/staff" onClick={() => setMenuOpen(false)}>Staff Management Demo <ArrowUpRight size={14}/></Link>
          </nav>
          <div className="header-actions">
            <button type="button" className="cart-link" onClick={() => setCartOpen(true)}
              aria-label={`Open shopping cart — ${cartCount} items`}>
              <ShoppingBag size={20} aria-hidden="true" />
              <span aria-live="polite">{cartCount}</span>
            </button>
            <Link className="header-reserve" to="/reserve">Book a Table <ArrowUpRight size={15}/></Link>
            <button ref={toggleRef} type="button" className="menu-toggle"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-controls="yc-primary-nav" aria-expanded={menuOpen}>
              {menuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>
      </header>

      <main id="yc-main" tabIndex={-1}><Outlet /></main>

      <footer className="site-footer yc-site-footer">
        <div className="shell footer-inner">
          <div className="yc-footer-lead">
            <BrandLogo footer />
            <h3>Every cup,<br/><em>a little moment.</em></h3>
            <p>{BRAND.description}</p>
            <Link to="/menu" className="yc-footer-cta">Discover our menu <ArrowRight size={17}/></Link>
          </div>
          <div>
            <b>DISCOVER</b>
            <Link to="/menu">Coffee & Food</Link>
            <Link to="/reserve">Table Reservations</Link>
            <Link to="/availability">Table Availability</Link>
            <Link to="/orders">Order Tracking</Link>
            <Link to="/story">Our Story</Link>
            <Link to="/coffee-beans">Coffee Beans</Link>
            <Link to="/gift-cards">Gift Cards</Link>
            <Link to="/events">Events & Workshops</Link>
            <Link to="/gallery">Gallery</Link>
          </div>
          <div>
            <b>VISIT & CONNECT</b>
            <span className="yc-footer-iconline"><MapPin size={15}/> {BRAND.address}</span>
            <span>{BRAND.openingHours}</span>
            <span>{BRAND.country}</span>
            {BRAND.instagram && <a href={BRAND.instagram} target="_blank" rel="noreferrer"><Camera size={15}/> Instagram</a>}
            <Link to="/locations">Locations <ArrowRight size={14}/></Link>
            <Link to="/faq">Frequently Asked Questions <ArrowRight size={14}/></Link>
            <Link to="/contact">Contact Page <ArrowRight size={14}/></Link>
            <Link to="/staff">Explore Staff Demo <ArrowUpRight size={14}/></Link>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© {new Date().getFullYear()} {BRAND.name} · Illustrative website concept</span>
          <span>{BRAND.watermark}</span>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <CafeNotice />
      <div className="demo-stamp" aria-hidden="true">FRONTEND-ONLY CONCEPT</div>
      <style>{`
        .yc-public-shell .yc-topline{display:flex;align-items:center;justify-content:center;gap:14px;padding:8px 15px;text-align:center;background:#33231b;color:#dec8af;font:700 9px/1.5 'DM Sans',sans-serif;letter-spacing:.17em}
        .yc-public-shell .yc9-explore-menu{position:relative;flex-shrink:0;color:#69584d;font-size:11px;font-weight:700;letter-spacing:.045em}
        .yc-public-shell .yc9-explore-menu summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:6px;min-height:34px}
        .yc-public-shell .yc9-explore-menu summary::-webkit-details-marker{display:none}
        .yc-public-shell .yc9-explore-menu[open] summary{color:#a57842}
        .yc-public-shell .yc9-explore-panel{position:absolute;right:0;top:100%;min-width:215px;z-index:90;background:#faf5ec;border:1px solid #e6d6c6;padding:10px;box-shadow:0 16px 36px #24181321;display:grid;gap:2px}
        .yc-public-shell .yc9-explore-panel a{display:block;padding:11px 13px;white-space:nowrap;font-size:11px;color:#624b3b}
        .yc-public-shell .yc9-explore-panel a:hover{background:#f0e5d5}
        .yc-public-shell .site-header{top:0}
        .yc-public-shell .header-actions{flex-shrink:0}
        .yc-public-shell .public-nav{min-width:0}
        .yc-public-shell .yc-skip-link{position:absolute;z-index:1000;top:-80px;left:16px;padding:14px;background:#fff;color:#241813}
        .yc-public-shell .yc-skip-link:focus{top:12px}
        .yc-public-shell .cart-link{position:relative;border:0;background:none;color:inherit;min-width:31px;min-height:38px}
        .yc-public-shell .brand{flex-shrink:0}
        .yc-public-shell .yc-site-footer .yc-footer-logo{color:#f1e6d5}
        .yc-public-shell .yc-footer-lead h3{margin:10px 0}
        .yc-public-shell .yc-footer-iconline{display:flex;align-items:flex-start;gap:9px}
        .yc-public-shell .yc-footer-iconline svg{flex-shrink:0}
        .yc-public-shell .yc-footer-cta{display:inline-flex;align-items:center;gap:9px;border-bottom:1px solid #c0a582;padding-bottom:8px}
        .yc-public-shell .yc-site-footer .footer-inner{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr)}
        @media(max-width:1100px){.yc-public-shell .public-nav{gap:17px}}
        @media(max-width:900px){
          .yc-public-shell .yc-site-footer .footer-inner{grid-template-columns:repeat(2,minmax(0,1fr))}
          .yc-public-shell .yc-footer-lead{grid-column:1/-1}
          .yc-public-shell .public-nav{gap:14px}
        }
        @media(max-width:700px){
          .yc-public-shell .yc-topline{font-size:8px;letter-spacing:.1em}
          .yc-public-shell .site-header{z-index:80}
          .yc-public-shell .menu-toggle{display:grid;place-items:center;flex-shrink:0;background:none;border:0;padding:7px;color:#3a2922}
          .yc-public-shell .header-reserve{display:none}
          .yc-public-shell .public-nav{display:none;position:absolute;left:0;right:0;top:100%;padding:20px 24px 28px;background:#faf5ec;border-bottom:1px solid #e1d5c5;box-shadow:0 22px 40px #24181324;flex-direction:column;align-items:stretch;gap:0;z-index:80}
          .yc-public-shell .public-nav.mobile-open{display:flex}
          .yc-public-shell .public-nav a{padding:13px 0;border-bottom:1px solid #ece1d4;font-size:12px}
          .yc-public-shell .public-nav a.mobile-staff{display:flex;align-items:center;gap:8px;color:#986b45}
          .yc-public-shell .yc9-explore-menu{width:100%;border-bottom:1px solid #e6d6c6}
          .yc-public-shell .yc9-explore-menu summary{padding:13px 0;font-size:12px}
          .yc-public-shell .yc9-explore-panel{position:static;min-width:0;padding:0 0 9px;box-shadow:none;border:0;background:transparent}
          .yc-public-shell .yc9-explore-panel a{padding:11px 14px;font-size:12px}
          .yc-public-shell .yc-site-footer .footer-inner{grid-template-columns:1fr;gap:38px}
          .yc-public-shell .yc-footer-lead{grid-column:auto}
          .yc-public-shell .footer-bottom{flex-direction:column}
        }
      `}</style>
    </div>
  );
}
