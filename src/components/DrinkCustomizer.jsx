import { useEffect, useMemo, useRef, useState } from "react";
import {
  X, Coffee, Minus, Plus, Check, ShoppingBag,
  Sparkles, ThermometerSun, Snowflake, Milk,
} from "lucide-react";
import {
  DRINK_SIZES, MILK_OPTIONS, SWEETNESS_OPTIONS,
  DRINK_EXTRAS, formatPeso, getCustomizationProfile,
} from "../data/config.js";
import { quoteMenuItem } from "../engine/cafeEngine.js";
import { useCafe } from "../context/CafeContext.jsx";

const TEMP_LABELS = { hot: "Hot", iced: "Iced" };

export default function DrinkCustomizer({ product, open, onClose }) {
  const { cartActions } = useCafe();
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("medium");
  const [temperature, setTemperature] = useState("hot");
  const [milk, setMilk] = useState("dairy");
  const [sweetness, setSweetness] = useState("regular");
  const [extras, setExtras] = useState([]);
  const [error, setError] = useState("");

  const profile = useMemo(
    () => product ? getCustomizationProfile(product.customizationProfile) : null,
    [product]
  );
  const allowedTemperatures = useMemo(
    () => product && profile ? (product.allowedTemperatures || profile.temperatures) : [],
    [product, profile]
  );

  // Reset only when opening a new product; never reset on every render.
  useEffect(() => {
    if (!open || !product || !profile) return;
    setQuantity(1);
    setSize(profile.sizes.includes("medium") ? "medium" : profile.sizes[0] || "");
    setTemperature(allowedTemperatures[0] || "");
    setMilk(profile.milks.includes("dairy") ? "dairy" : profile.milks[0] || "");
    setSweetness("regular");
    setExtras([]);
    setError("");
  }, [open, product?.id, profile, allowedTemperatures]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") onCloseRef.current?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open]);

  const options = useMemo(() => ({
    ...(profile?.sizes.length ? { size } : {}),
    ...(allowedTemperatures.length ? { temperature } : {}),
    ...(profile?.milks.length ? { milk } : {}),
    ...(profile?.sweetness ? { sweetness } : {}),
    extras,
  }), [profile, allowedTemperatures, size, temperature, milk, sweetness, extras]);

  const preview = useMemo(() => {
    if (!open || !product) return { quote: null, error: "" };
    try {
      return { quote: quoteMenuItem(product.id, quantity, options), error: "" };
    } catch (err) {
      return { quote: null, error: err.message };
    }
  }, [open, product, quantity, options]);

  if (!open || !product || !profile) return null;

  const toggleExtra = (id) => {
    setExtras((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  };

  const addToCart = () => {
    setError("");
    const result = cartActions.add(product.id, quantity, options);
    if (result.ok) onClose?.();
    else setError(result.error || "Unable to add this item.");
  };

  const isDrink = product.kind === "drink";

  return (
    <div className="yc-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose?.();
    }}>
      <section className="yc-customizer" role="dialog" aria-modal="true" aria-label={`Customize ${product.name}`}>
        <div className="yc-customizer-visual">
          <img src={product.image} alt={product.name} />
          <div className="yc-customizer-photo-label"><Coffee size={15} /> THE ART OF EVERYDAY COFFEE</div>
        </div>
        <div className="yc-customizer-main">
          <header className="yc-modal-header">
            <div><p className="yc-eyebrow">HANDCRAFTED FOR YOU</p><h2>{product.name}</h2></div>
            <button ref={closeButtonRef} className="yc-icon-btn" onClick={onClose} aria-label="Close customizer"><X size={20} /></button>
          </header>
          <p className="yc-product-description">{product.description}</p>
          {profile.sizes.length > 0 && (
            <fieldset className="yc-options-group">
              <legend>Choose your size</legend>
              <div className="yc-option-grid">
                {DRINK_SIZES.filter((item) => profile.sizes.includes(item.id)).map((item) => (
                  <button key={item.id} type="button" className={`yc-choice ${size === item.id ? "active" : ""}`} onClick={() => setSize(item.id)} aria-pressed={size === item.id}>
                    <span>{item.name}</span><small>{item.priceDelta === 0 ? "Included" : `${item.priceDelta > 0 ? "+" : "−"}${formatPeso(Math.abs(item.priceDelta))}`}</small>
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {allowedTemperatures.length > 1 && (
            <fieldset className="yc-options-group">
              <legend>How would you like it?</legend>
              <div className="yc-option-grid">
                {allowedTemperatures.map((id) => (
                  <button key={id} type="button" className={`yc-choice yc-choice-inline ${temperature === id ? "active" : ""}`} onClick={() => setTemperature(id)} aria-pressed={temperature === id}>
                    {id === "hot" ? <ThermometerSun size={17} /> : <Snowflake size={17} />}{TEMP_LABELS[id] || id}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {profile.milks.length > 0 && (
            <fieldset className="yc-options-group">
              <legend><Milk size={15} /> Choose your milk</legend>
              <div className="yc-option-grid">
                {MILK_OPTIONS.filter((item) => profile.milks.includes(item.id)).map((item) => (
                  <button key={item.id} type="button" className={`yc-choice ${milk === item.id ? "active" : ""}`} onClick={() => setMilk(item.id)} aria-pressed={milk === item.id}>
                    <span>{item.name}</span><small>{item.priceDelta ? `+${formatPeso(item.priceDelta)}` : "Included"}</small>
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {profile.sweetness && (
            <fieldset className="yc-options-group">
              <legend>Sweetness preference</legend>
              <div className="yc-option-grid">
                {SWEETNESS_OPTIONS.map((item) => (
                  <button key={item.id} type="button" className={`yc-choice ${sweetness === item.id ? "active" : ""}`} onClick={() => setSweetness(item.id)} aria-pressed={sweetness === item.id}>{item.name}</button>
                ))}
              </div>
            </fieldset>
          )}
          {profile.extras.length > 0 && (
            <fieldset className="yc-options-group">
              <legend><Sparkles size={16} /> Make it yours <small>Optional extras</small></legend>
              <div className="yc-option-grid">
                {DRINK_EXTRAS.filter((item) => profile.extras.includes(item.id)).map((item) => (
                  <button key={item.id} type="button" className={`yc-choice yc-choice-extra ${extras.includes(item.id) ? "active" : ""}`} onClick={() => toggleExtra(item.id)} aria-pressed={extras.includes(item.id)}>
                    <span>{extras.includes(item.id) ? <Check size={14} /> : <Plus size={14} />}{item.name}</span><small>+{formatPeso(item.price)}</small>
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {!isDrink && <p className="yc-helper-note">Freshly prepared café favorite — no drink customization needed.</p>}
          <footer className="yc-customizer-footer">
            <div className="yc-quantity-stepper" aria-label="Quantity">
              <button type="button" onClick={() => setQuantity((n) => Math.max(1, n - 1))} disabled={quantity <= 1} aria-label="Decrease quantity"><Minus size={17} /></button>
              <strong aria-live="polite">{quantity}</strong>
              <button type="button" onClick={() => setQuantity((n) => Math.min(30, n + 1))} disabled={quantity >= 30} aria-label="Increase quantity"><Plus size={17} /></button>
            </div>
            <button type="button" className="yc-primary-button" disabled={!preview.quote} onClick={addToCart}>
              <ShoppingBag size={17} /><span>Add to cart</span><strong>{formatPeso(preview.quote?.lineTotal || 0)}</strong>
            </button>
          </footer>
          {(error || preview.error) && <p role="alert" className="yc-inline-error">{error || preview.error}</p>}
          <p className="yc-demo-note">Illustrative menu and pricing. No real order is sent.</p>
        </div>
      </section>
    </div>
  );
}
