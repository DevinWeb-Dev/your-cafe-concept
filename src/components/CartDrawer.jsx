import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { formatPeso } from "../data/config.js";
import { useCafe } from "../context/CafeContext.jsx";

function optionSummary(options = {}) {
  return [
    options.size, options.temperature, options.milk,
    ...(options.extras || []),
  ].filter(Boolean).join(" · ") || "Standard preparation";
}

export default function CartDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const { cart, cartActions, cartPreview, cartCount } = useCafe();

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event) => { if (event.key === "Escape") onCloseRef.current?.(); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const proceed = () => {
    onClose?.();
    navigate("/cart");
  };

  return (
    <div className="yc-drawer-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose?.();
    }}>
      <aside className="yc-cart-drawer" role="dialog" aria-modal="true" aria-label="Your café cart">
        <header className="yc-drawer-header">
          <div><p className="yc-eyebrow">YOUR COFFEE MOMENTS</p><h2>Your Basket <span>({cartCount})</span></h2></div>
          <button ref={closeButtonRef} className="yc-icon-btn" aria-label="Close cart" onClick={onClose}><X size={20} /></button>
        </header>
        <div className="yc-drawer-content">
          {cart.length === 0 ? (
            <div className="yc-cart-empty">
              <ShoppingBag size={38} strokeWidth={1.25} />
              <h3>Good things start with coffee.</h3>
              <p>Your basket is waiting for something delicious.</p>
              <Link to="/menu" onClick={onClose} className="yc-secondary-button">Explore our menu <ArrowRight size={15} /></Link>
            </div>
          ) : (
            <div className="yc-drawer-items">
              {cart.map((entry, index) => {
                const line = cartPreview.lines[index];
                return (
                  <article className="yc-cart-line" key={entry.key}>
                    <div className="yc-cart-line-photo">
                      {line?.image ? <img src={line.image} alt="" loading="lazy" /> : <ShoppingBag size={20} />}
                    </div>
                    <div className="yc-cart-line-main">
                      <h3>{line?.name || entry.productId}</h3>
                      <p>{optionSummary(line?.options || entry.options)}</p>
                      <b>{formatPeso(line?.lineTotal || 0)}</b>
                      <div className="yc-cart-line-controls">
                        <button type="button" onClick={() => cartActions.quantity(entry.key, entry.quantity - 1)} aria-label={`Decrease ${line?.name || "item"} quantity`}><Minus size={15} /></button>
                        <span>{entry.quantity}</span>
                        <button type="button" onClick={() => cartActions.quantity(entry.key, entry.quantity + 1)} disabled={entry.quantity >= 30} aria-label={`Increase ${line?.name || "item"} quantity`}><Plus size={15} /></button>
                        <button type="button" className="yc-remove" onClick={() => cartActions.remove(entry.key)} aria-label={`Remove ${line?.name || "item"}`}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <footer className="yc-drawer-footer">
            <div className="yc-price-row"><span>Subtotal</span><b>{formatPeso(cartPreview.subtotal)}</b></div>
            <p>Customization included. Promotions can be applied at checkout.</p>
            <button type="button" className="yc-primary-button" onClick={proceed}>Review & checkout <strong>{formatPeso(cartPreview.total)}</strong><ArrowRight size={17} /></button>
            <p className="yc-demo-note">Frontend demo only · No actual payments or café orders.</p>
          </footer>
        )}
      </aside>
    </div>
  );
}
